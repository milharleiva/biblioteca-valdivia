import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaAvailable } from '@/lib/prisma';

// GET /api/users/[id]/enrollments - Obtener las inscripciones de un usuario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const enrollments = await prisma!.workshopEnrollment.findMany({
      where: {
        userId: userId
      },
      select: {
        workshopId: true,
        status: true,
        enrollmentDate: true,
        workshop: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            location: true,
            instructor: true
          }
        }
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });

    // Map to match the expected frontend format
    const mappedEnrollments = enrollments.map(enrollment => ({
      workshop_id: enrollment.workshopId,
      status: enrollment.status.toLowerCase(), // Convert ENROLLED to enrolled
      enrollment_date: enrollment.enrollmentDate,
      workshop: enrollment.workshop
    }));

    return NextResponse.json({
      success: true,
      data: mappedEnrollments
    });

  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}