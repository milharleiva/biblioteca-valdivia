import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable } from '@/lib/prisma'

// GET /api/users - Obtener todos los usuarios
export async function GET() {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const users = await prisma!.userProfile.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            workshopEnrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuarios',
      },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { userId, name, phone, address, role = 'USER' } = body

    if (!userId || !name) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId y name son requeridos',
        },
        { status: 400 }
      )
    }

    const user = await prisma!.userProfile.create({
      data: {
        userId,
        name,
        phone,
        address,
        role,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear usuario',
      },
      { status: 500 }
    )
  }
}