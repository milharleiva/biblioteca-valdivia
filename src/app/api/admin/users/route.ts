import { NextRequest, NextResponse } from 'next/server';
import { withPrisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin users API called - Using Prisma');

    const users = await withPrisma(async (client) => {
      return await client.userProfile.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    console.log(`Successfully fetched ${users?.length || 0} users via Prisma`);

    return NextResponse.json({
      success: true,
      data: users || []
    });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Admin users API PUT called - Using Prisma');

    const body = await request.json();
    const { userId, name, phone, address, birth_date, role } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Convert birth_date to proper format if provided
    const updateData: any = {};

    // Only include fields that are provided and not empty
    if (name !== undefined && name !== null) {
      updateData.name = name;
    }
    if (phone !== undefined && phone !== null) {
      updateData.phone = phone || null; // Convert empty string to null
    }
    if (address !== undefined && address !== null) {
      updateData.address = address || null; // Convert empty string to null
    }
    if (role !== undefined && role !== null) {
      updateData.role = role;
    }

    // Handle birth_date specially - only update if provided and valid
    if (birth_date && birth_date.trim() !== '') {
      try {
        updateData.birthDate = new Date(birth_date);
        // Verify the date is valid
        if (isNaN(updateData.birthDate.getTime())) {
          return NextResponse.json(
            { success: false, error: 'Fecha de nacimiento inválida' },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Formato de fecha de nacimiento inválido' },
          { status: 400 }
        );
      }
    } else if (birth_date === '') {
      // If explicitly set to empty string, set to null
      updateData.birthDate = null;
    }

    const updatedUser = await withPrisma(async (client) => {
      return await client.userProfile.update({
        where: {
          userId: userId
        },
        data: updateData
      });
    });

    console.log(`Successfully updated user ${userId} via Prisma`);

    return NextResponse.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    console.error('Error in admin users API PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Admin users API DELETE called - Using Prisma');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use withPrisma for database operations
    await withPrisma(async (client) => {
      // First, check if the user exists
      const existingUser = await client.userProfile.findUnique({
        where: { userId }
      });

      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Delete all related data first (workshopEnrollments, etc.)
      // This will cascade delete if configured in schema, but let's be explicit
      await client.workshopEnrollment.deleteMany({
        where: { userId }
      });

      // Delete the user profile
      await client.userProfile.delete({
        where: { userId }
      });

      console.log(`Successfully deleted user profile ${userId} via Prisma`);
    });

    // Delete from Supabase auth - use service role key for admin operations
    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      console.log(`🔄 Attempting to delete auth user ${userId} from Supabase...`);

      // First, force sign out all sessions for this user
      try {
        const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(userId);
        if (signOutError) {
          console.warn(`⚠️ Could not sign out user ${userId}:`, signOutError.message);
        } else {
          console.log(`✅ Successfully signed out all sessions for user ${userId}`);
        }
      } catch (signOutErr) {
        console.warn(`⚠️ Error signing out user ${userId}:`, signOutErr);
      }

      // Then delete the user completely
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) {
        console.error(`❌ Could not delete auth user ${userId}:`, authError.message);
        console.error(`❌ Auth error details:`, authError);
        // Don't fail the whole operation if auth deletion fails
        // The profile is already deleted, which is the main goal
      } else {
        console.log(`✅ Successfully deleted auth user ${userId} from Supabase`);
      }
    } catch (authError) {
      console.error(`❌ Error deleting auth user ${userId}:`, authError);
      // Continue execution - profile deletion was successful
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error in admin users API DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}