import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin users API called - Using Prisma');

    // Use the correct Prisma model name from schema
    const users = await prisma.userProfile.findMany({
      orderBy: {
        createdAt: 'desc'
      }
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
  } finally {
    await prisma.$disconnect();
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

    const updatedUser = await prisma.userProfile.update({
      where: {
        userId: userId
      },
      data: updateData
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
  } finally {
    await prisma.$disconnect();
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

    // First, check if the user exists
    const existingUser = await prisma.userProfile.findUnique({
      where: { userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Delete all related data first (workshopEnrollments, etc.)
    // This will cascade delete if configured in schema, but let's be explicit
    await prisma.workshopEnrollment.deleteMany({
      where: { userId }
    });

    // Delete the user profile
    await prisma.userProfile.delete({
      where: { userId }
    });

    console.log(`Successfully deleted user ${userId} via Prisma`);

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
  } finally {
    await prisma.$disconnect();
  }
}