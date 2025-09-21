import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable } from '@/lib/prisma'

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

    const profile = await prisma!.userProfile.findUnique({
      where: { userId },
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
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { userId, email, name, role = 'USER' } = body

    if (!userId || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'userId, email, and name are required' },
        { status: 400 }
      )
    }

    const profile = await prisma!.userProfile.create({
      data: {
        userId,
        email,
        name,
        role: role.toUpperCase(),
      },
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear perfil' },
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
    if (updates.role) prismaUpdates.role = updates.role.toUpperCase()

    const profile = await prisma!.userProfile.update({
      where: { userId },
      data: prismaUpdates,
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