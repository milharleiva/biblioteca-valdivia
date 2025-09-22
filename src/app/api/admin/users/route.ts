import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const updateData: any = {
      name,
      phone,
      address,
      role
    };

    if (birth_date) {
      updateData.birthDate = new Date(birth_date);
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