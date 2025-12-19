import { NextResponse } from 'next/server'
import { prisma, isPrismaAvailable, withPrisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// GET /api/statistics - Obtener estadísticas del sistema
export async function GET() {
  try {
    const prismaAvailable = await isPrismaAvailable()
    console.log('Statistics API - Prisma available:', prismaAvailable)

    if (prismaAvailable) {
      // Use Prisma if available
      console.log('Using Prisma for statistics')

      try {
        const statistics = await withPrisma(async (client) => {
          const userCount = await client.userProfile.count()

          const workshopCount = await client.workshop.count({
            where: {
              isActive: true,
              endDate: {
                gte: new Date()
              }
            }
          })

          const currentYear = new Date().getFullYear()
          const startOfYear = new Date(currentYear, 0, 1)
          const totalWorkshopsThisYear = await client.workshop.count({
            where: {
              createdAt: {
                gte: startOfYear
              }
            }
          })

          const activeAnnouncements = await client.announcement.count({
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

          const totalEnrollments = await client.workshopEnrollment.count()

          const activeEnrollments = await client.workshopEnrollment.count({
            where: {
              status: 'ENROLLED'
            }
          })

          const completedEnrollments = await client.workshopEnrollment.count({
            where: {
              status: 'COMPLETED'
            }
          })

          // Nuevas estadísticas
          const attendanceRate = totalEnrollments > 0 ?
            Math.round((completedEnrollments / totalEnrollments) * 100) : 0

          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const activeUsersLastMonth = await client.workshopEnrollment.findMany({
            where: {
              enrollmentDate: {
                gte: thirtyDaysAgo
              }
            },
            distinct: ['userId'],
            select: {
              userId: true
            }
          }).then(result => result.length)

          const currentMonth = new Date()
          const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

          const newUsersThisMonth = await client.userProfile.count({
            where: {
              createdAt: {
                gte: startOfMonth
              }
            }
          })

          const workshopsByCategory = await client.workshop.groupBy({
            by: ['category'],
            _count: {
              category: true
            },
            where: {
              isActive: true
            }
          })


          const pinnedAnnouncements = await client.announcement.count({
            where: {
              isPinned: true,
              isActive: true
            }
          })

          return {
            userCount,
            workshopCount,
            totalWorkshopsThisYear,
            activeAnnouncements,
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            attendanceRate,
            activeUsersLastMonth,
            newUsersThisMonth,
            workshopsByCategory,
            pinnedAnnouncements
          }
        })

        return NextResponse.json({
          success: true,
          data: statistics
        })
      } catch (error) {
        console.error('Error in Prisma statistics:', error)
        // Fallback to default values
        return NextResponse.json({
          success: true,
          data: {
            userCount: 0,
            workshopCount: 0,
            totalWorkshopsThisYear: 0,
            activeAnnouncements: 0,
            totalEnrollments: 0,
            activeEnrollments: 0,
            completedEnrollments: 0,
            attendanceRate: 0,
            activeUsersLastMonth: 0,
            newUsersThisMonth: 0,
            workshopsByCategory: [],
            pinnedAnnouncements: 0
          }
        })
      }
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

      // Calculate new statistics for Supabase
      const attendanceRate = (totalEnrollments || 0) > 0 ?
        Math.round(((completedEnrollments || 0) / (totalEnrollments || 0)) * 100) : 0

      return NextResponse.json({
        success: true,
        data: {
          userCount: userCount || 0,
          workshopCount: workshopCount || 0,
          totalWorkshopsThisYear: totalWorkshopsThisYear || 0,
          activeAnnouncements: activeAnnouncements || 0,
          totalEnrollments: totalEnrollments || 0,
          activeEnrollments: activeEnrollments || 0,
          completedEnrollments: completedEnrollments || 0,
          attendanceRate,
          activeUsersLastMonth: 0, // Would need additional queries for Supabase
          newUsersThisMonth: 0,
          workshopsByCategory: [],
          pinnedAnnouncements: 0
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