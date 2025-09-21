import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable } from '@/lib/prisma'

// GET /api/workshops - Obtener todos los talleres
export async function GET() {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const workshops = await prisma!.workshop.findMany({
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
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      instructor,
      instructor_bio,
      category = 'GENERAL',
      max_participants = 20,
      start_date,
      end_date,
      schedule,
      location,
      image_url,
      requirements,
      materials,
      target_audience,
      difficulty_level = 'BEGINNER',
      is_active = true,
      created_by,
    } = body

    if (!title || !description || !instructor || !start_date || !end_date || !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos obligatorios deben ser completados',
        },
        { status: 400 }
      )
    }

    const workshop = await prisma!.workshop.create({
      data: {
        title,
        description,
        instructor,
        instructorBio: instructor_bio,
        category,
        maxParticipants: max_participants,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        schedule: schedule || '', // Campo opcional para compatibilidad
        location,
        imageUrl: image_url,
        requirements,
        materials,
        targetAudience: target_audience,
        difficultyLevel: difficulty_level,
        isActive: is_active,
        createdBy: created_by,
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