import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable, withPrisma } from '@/lib/prisma'

// GET /api/workshops - Obtener todos los talleres o uno específico por ID
export async function GET(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    // Si hay ID, obtener taller específico
    if (id) {
      const workshop = await withPrisma(async (client) => {
        return await client.workshop.findUnique({
        where: { id },
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
        })
      })

      if (!workshop) {
        return NextResponse.json(
          { success: false, error: 'Taller no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: workshop,
      })
    }

    // Si no hay ID, obtener todos los talleres
    const whereClause: Record<string, unknown> = {
      isActive: true,
    }

    // Si se solicitan solo talleres destacados
    if (featured === 'true') {
      whereClause.endDate = {
        gte: new Date()
      }
    }

    const workshops = await withPrisma(async (client) => {
      return await client.workshop.findMany({
      where: whereClause,
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
      take: limit ? parseInt(limit) : undefined,
      })
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
    console.log('Received workshop data:', body); // Debug logging

    const {
      title,
      description,
      instructor,
      category = 'general',
      max_participants = 20,
      start_date,
      end_date,
      schedule,
      location,
      image_url,
      is_active = true,
      created_by,
    } = body

    console.log('Parsed fields:', { title, description, instructor, start_date, end_date, location }); // Debug logging

    if (!title || !description || !instructor || !start_date || !end_date || !location) {
      console.log('Validation failed - missing required fields'); // Debug logging
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos obligatorios deben ser completados',
        },
        { status: 400 }
      )
    }

    // Mapear valores de español a los tipos de Prisma
    const categoryMapping: { [key: string]: 'GENERAL' | 'TECHNOLOGY' | 'ART' | 'LITERATURE' | 'EDUCATION' | 'CULTURE' } = {
      'general': 'GENERAL',
      'tecnologia': 'TECHNOLOGY',
      'arte': 'ART',
      'literatura': 'LITERATURE',
      'educacion': 'EDUCATION',
      'cultura': 'CULTURE'
    };

    const workshop = await withPrisma(async (client) => {
      return await client.workshop.create({
        data: {
          title,
          description,
          instructor,
          category: categoryMapping[category] || 'GENERAL',
          maxParticipants: max_participants,
          startDate: new Date(start_date),
          endDate: new Date(end_date),
          schedule: schedule || '', // Campo opcional para compatibilidad
          location,
          imageUrl: image_url,
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

// DELETE /api/workshops - Eliminar un taller (solo para admin)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del taller requerido' },
        { status: 400 }
      )
    }

    await withPrisma(async (client) => {
      return await client.workshop.delete({
        where: { id }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Taller eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting workshop:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar taller',
      },
      { status: 500 }
    )
  }
}

// PUT /api/workshops - Actualizar taller completo
export async function PUT(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('Received workshop update data:', body);

    const {
      id,
      title,
      description,
      instructor,
      category = 'general',
      max_participants = 20,
      start_date,
      end_date,
      schedule,
      location,
      image_url,
      is_active = true,
    } = body

    if (!id || !title || !description || !instructor || !start_date || !end_date || !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID y todos los campos obligatorios deben ser completados',
        },
        { status: 400 }
      )
    }

    // Mapear valores de español a los tipos de Prisma
    const categoryMapping: { [key: string]: 'GENERAL' | 'TECHNOLOGY' | 'ART' | 'LITERATURE' | 'EDUCATION' | 'CULTURE' } = {
      'general': 'GENERAL',
      'tecnologia': 'TECHNOLOGY',
      'arte': 'ART',
      'literatura': 'LITERATURE',
      'educacion': 'EDUCATION',
      'cultura': 'CULTURE'
    };

    const workshop = await withPrisma(async (client) => {
      return await client.workshop.update({
        where: { id },
        data: {
          title,
          description,
          instructor,
          category: categoryMapping[category] || 'GENERAL',
          maxParticipants: max_participants,
          startDate: new Date(start_date),
          endDate: new Date(end_date),
          schedule: schedule || '',
          location,
          imageUrl: image_url,
          isActive: is_active,
        },
        include: {
          creator: {
            select: {
              name: true,
            },
          },
        },
      })
    })

    return NextResponse.json({
      success: true,
      data: workshop,
    })
  } catch (error) {
    console.error('Error updating workshop:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar taller',
      },
      { status: 500 }
    )
  }
}

// PATCH /api/workshops - Actualizar estado de un taller
export async function PATCH(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { id, isActive } = body

    if (!id || isActive === undefined) {
      return NextResponse.json(
        { success: false, error: 'ID y estado requeridos' },
        { status: 400 }
      )
    }

    const workshop = await withPrisma(async (client) => {
      return await client.workshop.update({
        where: { id },
        data: { isActive }
      })
    })

    return NextResponse.json({
      success: true,
      data: workshop
    })
  } catch (error) {
    console.error('Error updating workshop:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar taller',
      },
      { status: 500 }
    )
  }
}