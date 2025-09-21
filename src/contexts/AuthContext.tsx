'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { prisma } from '@/lib/prisma';

interface UserProfile {
  id: string;
  user_id: string;
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
      // Try to fetch profile using Prisma
      const profile = await prisma.userProfile.findUnique({
        where: {
          userId: userId,
        },
      });

      if (profile) {
        // Profile exists - convert to expected format
        setProfile({
          id: profile.id,
          user_id: profile.userId,
          name: profile.name,
          role: profile.role.toLowerCase() as 'user' | 'admin',
          phone: profile.phone,
          address: profile.address,
          birth_date: profile.birthDate?.toISOString(),
          emergency_contact: profile.emergencyContact,
          emergency_phone: profile.emergencyPhone,
        });
      } else {
        // Profile doesn't exist - create it (lazy creation)
        console.log('👤 Profile not found, creating new profile for user:', userId);

        // Get user data from Supabase Auth to get the name
        const { data: authUser } = await supabase.auth.getUser();
        const userName = authUser.user?.user_metadata?.name || 'Usuario';

        try {
          const newProfile = await prisma.userProfile.create({
            data: {
              userId: userId,
              name: userName,
              role: 'USER',
            },
          });

          setProfile({
            id: newProfile.id,
            user_id: newProfile.userId,
            name: newProfile.name,
            role: newProfile.role.toLowerCase() as 'user' | 'admin',
            phone: newProfile.phone,
            address: newProfile.address,
            birth_date: newProfile.birthDate?.toISOString(),
            emergency_contact: newProfile.emergencyContact,
            emergency_phone: newProfile.emergencyPhone,
          });

          console.log('✅ New profile created successfully');
        } catch (createError) {
          console.error('❌ Error creating profile:', createError);
          // Set a fallback profile
          setProfile({
            id: 'fallback-' + userId,
            user_id: userId,
            name: userName,
            role: 'user'
          });
        }
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      // Set a default profile as fallback
      setProfile({
        id: 'error-' + userId,
        user_id: userId,
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      // 2. If auth user created successfully, create profile in our database
      if (data.user && !error) {
        try {
          await prisma.userProfile.create({
            data: {
              userId: data.user.id,
              name: name,
              role: 'USER',
            },
          });
          console.log('✅ User profile created successfully');
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
      // Convert updates to Prisma format
      const prismaUpdates: any = {};

      if (updates.name) prismaUpdates.name = updates.name;
      if (updates.phone) prismaUpdates.phone = updates.phone;
      if (updates.address) prismaUpdates.address = updates.address;
      if (updates.birth_date) prismaUpdates.birthDate = new Date(updates.birth_date);
      if (updates.emergency_contact) prismaUpdates.emergencyContact = updates.emergency_contact;
      if (updates.emergency_phone) prismaUpdates.emergencyPhone = updates.emergency_phone;
      if (updates.role) prismaUpdates.role = updates.role.toUpperCase();

      // Update using Prisma
      await prisma.userProfile.update({
        where: {
          userId: user.id,
        },
        data: prismaUpdates,
      });

      console.log('✅ Profile updated successfully');

      // Refresh profile
      await fetchProfile(user.id);
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