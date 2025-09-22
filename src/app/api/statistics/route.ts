import { NextResponse } from 'next/server'
import { prisma, isPrismaAvailable } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// GET /api/statistics - Obtener estadísticas del sistema
export async function GET() {
  try {
    const prismaAvailable = await isPrismaAvailable()
    console.log('Statistics API - Prisma available:', prismaAvailable)

    if (prismaAvailable) {
      // Use Prisma if available
      console.log('Using Prisma for statistics')
      const userCount = await prisma!.userProfile.count()
      const workshopCount = await prisma!.workshop.count({
        where: {
          isActive: true,
          endDate: {
            gte: new Date()
          }
        }
      })

      const currentYear = new Date().getFullYear()
      const startOfYear = new Date(currentYear, 0, 1)
      const totalWorkshopsThisYear = await prisma!.workshop.count({
        where: {
          createdAt: {
            gte: startOfYear
          }
        }
      })

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

      const totalEnrollments = await prisma!.workshopEnrollment.count()
      const activeEnrollments = await prisma!.workshopEnrollment.count({
        where: {
          status: 'ENROLLED'
        }
      })
      const completedEnrollments = await prisma!.workshopEnrollment.count({
        where: {
          status: 'COMPLETED'
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          userCount,
          workshopCount,
          totalWorkshopsThisYear,
          activeAnnouncements,
          totalEnrollments,
          activeEnrollments,
          completedEnrollments
        }
      })
    } else {
      // Fallback to Supabase
      console.log('Using Supabase for statistics')
      const supabase = createClient()

      // Get user count
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Get active workshop count
      const { count: workshopCount } = await supabase
        .from('workshops')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())

      // Get workshops created this year
      const currentYear = new Date().getFullYear()
      const startOfYear = new Date(currentYear, 0, 1).toISOString()
      const { count: totalWorkshopsThisYear } = await supabase
        .from('workshops')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfYear)

      // Get active announcements
      const { count: activeAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())

      // Get workshop enrollments (this is the key for production)
      const { count: totalEnrollments } = await supabase
        .from('workshop_enrollments')
        .select('*', { count: 'exact', head: true })

      const { count: activeEnrollments } = await supabase
        .from('workshop_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'enrolled')

      const { count: completedEnrollments } = await supabase
        .from('workshop_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      return NextResponse.json({
        success: true,
        data: {
          userCount: userCount || 0,
          workshopCount: workshopCount || 0,
          totalWorkshopsThisYear: totalWorkshopsThisYear || 0,
          activeAnnouncements: activeAnnouncements || 0,
          totalEnrollments: totalEnrollments || 0,
          activeEnrollments: activeEnrollments || 0,
          completedEnrollments: completedEnrollments || 0
        }
      })
    }
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