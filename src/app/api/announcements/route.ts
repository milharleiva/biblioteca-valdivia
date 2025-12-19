import { NextRequest, NextResponse } from 'next/server'
import { prisma, isPrismaAvailable, withPrisma } from '@/lib/prisma'

// GET /api/announcements - Obtener todos los anuncios
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

    const result = await withPrisma(async (client) => {
      // Si hay ID, obtener anuncio específico
      if (id) {
        const announcement = await client.announcement.findUnique({
          where: { id },
          include: {
            creator: {
              select: {
                name: true,
              },
            },
          },
        })

        if (!announcement) {
          return { type: 'error', error: 'Anuncio no encontrado', status: 404 }
        }

        return { type: 'single', data: announcement }
      }

      // Si no hay ID, obtener todos los anuncios
      const announcements = await client.announcement.findMany({
        include: {
          creator: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          { isPinned: 'desc' },
          { priority: 'desc' },
          { startDate: 'desc' },
        ],
      })

      return { type: 'list', data: announcements }
    })

    if (result.type === 'error') {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener anuncios',
      },
      { status: 500 }
    )
  }
}

// POST /api/announcements - Crear un nuevo anuncio
export async function POST(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('Received announcement data:', body)

    const {
      title,
      content,
      excerpt,
      type = 'GENERAL',
      priority = 1,
      is_active = true,
      is_pinned = false,
      start_date,
      end_date,
      image_url,
      link_url,
      link_text,
      target_audience = 'ALL',
      created_by,
    } = body

    console.log('Parsed fields:', { title, content, type, start_date, end_date })

    if (!title || !content || !start_date) {
      console.log('Validation failed - missing required fields')
      return NextResponse.json(
        {
          success: false,
          error: 'Título, contenido y fecha de inicio son obligatorios',
        },
        { status: 400 }
      )
    }

    // Mapear valores de español a los tipos de Prisma
    const typeMapping: { [key: string]: 'GENERAL' | 'EVENT' | 'IMPORTANT' | 'MAINTENANCE' | 'NEWS' | 'EMERGENCY' } = {
      'general': 'GENERAL',
      'event': 'EVENT',
      'important': 'IMPORTANT',
      'maintenance': 'MAINTENANCE',
      'news': 'NEWS',
      'emergency': 'EMERGENCY'
    }

    const targetAudienceMapping: { [key: string]: 'ALL' | 'USERS' | 'STAFF' } = {
      'all': 'ALL',
      'users': 'USERS',
      'staff': 'STAFF'
    }

    const announcement = await withPrisma(async (client) => {
      return await client.announcement.create({
        data: {
          title,
          content,
          excerpt,
          type: typeMapping[type] || 'GENERAL',
          priority,
          isActive: is_active,
          isPinned: is_pinned,
          startDate: new Date(start_date),
          endDate: end_date ? new Date(end_date) : null,
          imageUrl: image_url,
          linkUrl: link_url,
          linkText: link_text,
          targetAudience: targetAudienceMapping[target_audience] || 'ALL',
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
      data: announcement,
    })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear anuncio',
      },
      { status: 500 }
    )
  }
}

// PUT /api/announcements - Actualizar anuncio completo
export async function PUT(request: NextRequest) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('Received announcement update data:', body)

    const {
      id,
      title,
      content,
      excerpt,
      type = 'GENERAL',
      priority = 1,
      is_active = true,
      is_pinned = false,
      start_date,
      end_date,
      image_url,
      link_url,
      link_text,
      target_audience = 'ALL',
    } = body

    if (!id || !title || !content || !start_date) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID, título, contenido y fecha de inicio son obligatorios',
        },
        { status: 400 }
      )
    }

    // Mapear valores de español a los tipos de Prisma
    const typeMapping: { [key: string]: 'GENERAL' | 'EVENT' | 'IMPORTANT' | 'MAINTENANCE' | 'NEWS' | 'EMERGENCY' } = {
      'general': 'GENERAL',
      'event': 'EVENT',
      'important': 'IMPORTANT',
      'maintenance': 'MAINTENANCE',
      'news': 'NEWS',
      'emergency': 'EMERGENCY'
    }

    const targetAudienceMapping: { [key: string]: 'ALL' | 'USERS' | 'STAFF' } = {
      'all': 'ALL',
      'users': 'USERS',
      'staff': 'STAFF'
    }

    const announcement = await withPrisma(async (client) => {
      return await client.announcement.update({
        where: { id },
        data: {
          title,
          content,
          excerpt,
          type: typeMapping[type] || 'GENERAL',
          priority,
          isActive: is_active,
          isPinned: is_pinned,
          startDate: new Date(start_date),
          endDate: end_date ? new Date(end_date) : null,
          imageUrl: image_url,
          linkUrl: link_url,
          linkText: link_text,
          targetAudience: targetAudienceMapping[target_audience] || 'ALL',
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
      data: announcement,
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar anuncio',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/announcements - Eliminar un anuncio
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
        { success: false, error: 'ID del anuncio requerido' },
        { status: 400 }
      )
    }

    await withPrisma(async (client) => {
      return await client.announcement.delete({
        where: { id }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Anuncio eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar anuncio',
      },
      { status: 500 }
    )
  }
}

// PATCH /api/announcements - Actualizar estado de un anuncio
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

    const announcement = await withPrisma(async (client) => {
      return await client.announcement.update({
        where: { id },
        data: { isActive }
      })
    })

    return NextResponse.json({
      success: true,
      data: announcement
    })
  } catch (error) {
    console.error('Error updating announcement status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar estado del anuncio',
      },
      { status: 500 }
    )
  }
}