import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable, withPrisma } from '@/lib/prisma'

// GET /api/profile?userId=xxx - Get user profile
export async function GET(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const profile = await withPrisma(async (client) => {
      let foundProfile = await client.userProfile.findUnique({
        where: { userId },
        select: {
          id: true,
          userId: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          birthDate: true,
          emergencyContact: true,
          emergencyPhone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })

      // Si no existe el perfil, intentar crearlo
      if (!foundProfile) {
        console.log('Profile not found, attempting to create one for userId:', userId)
        foundProfile = await client.userProfile.create({
          data: {
            userId,
            email: `user-${userId}@temp.com`, // Email temporal
            name: 'Usuario',
            role: 'USER'
          },
          select: {
            id: true,
            userId: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            birthDate: true,
            emergencyContact: true,
            emergencyPhone: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        })
        console.log('Profile created successfully for userId:', userId)
      }

      return foundProfile
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener perfil' },
      { status: 500 }
    )
  }
}

// POST /api/profile - Create user profile
export async function POST(request: NextRequest) {
  try {
    console.log('🟡 POST /api/profile - Iniciando creación de perfil');

    if (!(await isPrismaAvailable())) {
      console.log('🔴 Database not available');
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('🟡 Datos recibidos:', body);
    const { userId, email, name, role = 'USER' } = body

    if (!userId || !name || !email) {
      console.log('🔴 Datos faltantes:', { userId: !!userId, email: !!email, name: !!name });
      return NextResponse.json(
        { success: false, error: 'userId, email, and name are required' },
        { status: 400 }
      )
    }

    console.log('🟡 Creando perfil en base de datos...');

    // First check if a user with this ID was recently deleted (optional safety check)
    // This could prevent recreation of deleted users
    try {
      const existingCheck = await withPrisma(async (client) => {
        return await client.userProfile.findUnique({
          where: { userId },
          select: { id: true }
        })
      })

      if (existingCheck) {
        console.log('🔴 Perfil ya existe para userId:', userId);
        return NextResponse.json(
          { success: false, error: 'User profile already exists' },
          { status: 409 }
        );
      }
    } catch (checkError) {
      console.log('⚠️ Error checking existing profile (continuing):', checkError);
    }

    let profile;
    try {
      profile = await withPrisma(async (client) => {
        return await client.userProfile.create({
          data: {
            userId,
            email,
            name,
            role: (role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN',
          },
        })
      })
      console.log('🟢 Perfil creado exitosamente:', profile.id);
    } catch (prismaError) {
      console.error('🔴 Error específico de Prisma:', prismaError);
      throw new Error(`Database error: ${prismaError instanceof Error ? prismaError.message : 'Unknown database error'}`);
    }

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('🔴 Error creating profile:', error)
    console.error('🔴 Error details:', {
      message: errorMessage,
      stack: (error as Error)?.stack,
      name: (error as Error)?.name
    });

    return NextResponse.json(
      {
        success: false,
        error: `Error al crear perfil: ${errorMessage}`,
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { userId, updates } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    // Convert updates to Prisma format
    const prismaUpdates: Record<string, unknown> = {}
    if (updates.name) prismaUpdates.name = updates.name
    if (updates.email) prismaUpdates.email = updates.email
    if (updates.phone) prismaUpdates.phone = updates.phone
    if (updates.address) prismaUpdates.address = updates.address
    if (updates.birth_date) prismaUpdates.birthDate = new Date(updates.birth_date)
    if (updates.emergency_contact) prismaUpdates.emergencyContact = updates.emergency_contact
    if (updates.emergency_phone) prismaUpdates.emergencyPhone = updates.emergency_phone
    if (updates.role) prismaUpdates.role = (updates.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN'

    const profile = await withPrisma(async (client) => {
      return await client.userProfile.update({
        where: { userId },
        data: prismaUpdates,
      })
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}