'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  birth_date?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: unknown; error?: unknown }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data?: unknown; error?: unknown }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we're in a server environment or missing Supabase config
  const canUseSupabase = typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = canUseSupabase ? createClient() : null;

  useEffect(() => {
    // Skip if Supabase is not available (during build or missing config)
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [canUseSupabase]);

  const fetchProfile = async (userId: string) => {
    // Skip if Supabase is not available
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // Try to fetch profile using our API
      const response = await fetch(`/api/profile?userId=${userId}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Profile exists - convert to expected format
        const profile = result.data;
        setProfile({
          id: profile.id,
          user_id: profile.userId,
          email: profile.email || user?.email || '',
          name: profile.name,
          role: profile.role.toLowerCase() as 'user' | 'admin',
          phone: profile.phone,
          address: profile.address,
          birth_date: profile.birthDate?.slice(0, 10), // Convert to YYYY-MM-DD format
          emergency_contact: profile.emergencyContact,
          emergency_phone: profile.emergencyPhone,
        });
      } else {
        // Profile doesn't exist - this could mean the user was deleted by an admin
        console.log('👤 Profile not found for user:', userId);

        // Get user data from Supabase Auth to verify the user exists
        const { data: authUser, error: authError } = await supabase.auth.getUser();

        // If there's an auth error or no user data, the user might have been deleted
        if (authError || !authUser.user) {
          console.log('🚫 User appears to have been deleted from auth, signing out...');
          await signOut();
          return;
        }

        const userName = authUser.user?.user_metadata?.name || 'Usuario';
        const userEmail = authUser.user?.email || '';

        console.log('👤 User exists in auth but no profile found, attempting to create profile...');

        try {
          const createResponse = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              email: userEmail,
              name: userName,
              role: 'USER',
            }),
          });

          const createResult = await createResponse.json();

          if (createResult.success) {
            const newProfile = createResult.data;
            setProfile({
              id: newProfile.id,
              user_id: newProfile.userId,
              email: newProfile.email || userEmail,
              name: newProfile.name,
              role: newProfile.role.toLowerCase() as 'user' | 'admin',
              phone: newProfile.phone,
              address: newProfile.address,
              birth_date: newProfile.birthDate?.slice(0, 10),
              emergency_contact: newProfile.emergencyContact,
              emergency_phone: newProfile.emergencyPhone,
            });

            console.log('✅ New profile created successfully');
          } else {
            // If profile creation fails, it might be because user was deleted
            console.warn('❌ Profile creation failed:', createResult.error);
            console.log('🚫 User may have been deleted by admin, signing out...');
            await signOut();
            return;
          }
        } catch (createError) {
          console.error('❌ Error creating profile:', createError);
          console.log('🚫 Profile creation failed, user may have been deleted, signing out...');
          await signOut();
          return;
        }
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);

      // Check if this is a 404 error (profile not found) which might indicate user was deleted
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('not found'))) {
        console.log('🚫 Profile fetch returned 404, user may have been deleted, signing out...');
        await signOut();
        return;
      }

      // For other errors, create fallback profile
      setProfile({
        id: 'error-' + userId,
        user_id: userId,
        email: user?.email || '',
        name: 'Usuario',
        role: 'user'
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not available' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not available' } };
    }

    try {
      // 1. Create user in Supabase Auth
      console.log('🔵 Iniciando registro para:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      console.log('🔵 Respuesta de Supabase Auth:', {
        hasUser: !!data.user,
        userConfirmed: data.user?.email_confirmed_at,
        hasError: !!error,
        errorMessage: error?.message
      });

      // 2. If auth user created successfully, create profile in our database
      // Note: El usuario puede existir pero no estar confirmado
      if (data.user && !error) {
        try {
          console.log('🔵 Creando perfil de usuario con datos:', {
            userId: data.user.id,
            email: email,
            name: name,
            role: 'USER'
          });

          const createResponse = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: email,
              name: name,
              role: 'USER',
            }),
          });

          console.log('🔵 Status del API call:', createResponse.status);
          console.log('🔵 Response headers:', Object.fromEntries(createResponse.headers.entries()));

          const createResult = await createResponse.json();
          console.log('🔵 Respuesta del API:', createResult);

          if (!createResponse.ok) {
            console.error('🔴 API call failed with status:', createResponse.status);
            console.error('🔴 API response:', createResult);
          }

          if (createResult.success) {
            console.log('✅ User profile created successfully');
          } else {
            console.error('❌ Error creating user profile:', createResult.error);
          }
        } catch (profileError) {
          console.error('❌ Error creating user profile:', profileError);
          // Don't return error here - user auth was successful
          // Profile can be created later if needed
        }
      }

      return { data, error };
    } catch (error) {
      console.error('❌ Error in signUp:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      // Clear local state
      setUser(null);
      setProfile(null);
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Update using our API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: updates,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Profile updated successfully');
        // Refresh profile
        await fetchProfile(user.id);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};