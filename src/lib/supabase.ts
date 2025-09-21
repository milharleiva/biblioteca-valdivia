import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  phone?: string;
  address?: string;
  birth_date?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  schedule: string;
  location: string;
  image_url?: string;
  requirements?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface WorkshopEnrollment {
  id: string;
  user_id: string;
  workshop_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'completed' | 'cancelled';
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  updated_at: string;
}