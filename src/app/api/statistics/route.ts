import { NextResponse } from 'next/server'
import { prisma, isPrismaAvailable } from '@/lib/prisma'

// GET /api/statistics - Obtener estadísticas del sistema
export async function GET() {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    // Get user count
    const userCount = await prisma!.userProfile.count()

    // Get active workshop count
    const workshopCount = await prisma!.workshop.count({
      where: {
        isActive: true,
        endDate: {
          gte: new Date()
        }
      }
    })

    // Get workshops created this year
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const totalWorkshopsThisYear = await prisma!.workshop.count({
      where: {
        createdAt: {
          gte: startOfYear
        }
      }
    })

    // Get total announcements active
    const activeAnnouncements = await prisma!.announcement.count({
      where: {
        isActive: true,
        startDate: {
          lte: new Date()
        },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        userCount,
        workshopCount,
        totalWorkshopsThisYear,
        activeAnnouncements
      }
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas',
      },
      { status: 500 }
    )
  }
}