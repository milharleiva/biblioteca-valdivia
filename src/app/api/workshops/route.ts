import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/workshops - Obtener todos los talleres
export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      where: {
        isActive: true,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: {
              where: {
                status: 'ENROLLED',
              },
            },
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { startDate: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: workshops,
    })
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener talleres',
      },
      { status: 500 }
    )
  }
}

// POST /api/workshops - Crear un nuevo taller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      instructor,
      category = 'GENERAL',
      maxParticipants = 20,
      startDate,
      endDate,
      schedule,
      location,
      createdBy,
    } = body

    if (!title || !description || !instructor || !startDate || !endDate || !schedule || !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos obligatorios deben ser completados',
        },
        { status: 400 }
      )
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description,
        instructor,
        category,
        maxParticipants,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schedule,
        location,
        createdBy,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: workshop,
    })
  } catch (error) {
    console.error('Error creating workshop:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear taller',
      },
      { status: 500 }
    )
  }
}