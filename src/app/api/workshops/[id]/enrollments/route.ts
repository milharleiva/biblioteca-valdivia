import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaAvailable, ensurePrismaConnection } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    if (!(await ensurePrismaConnection())) {
      return NextResponse.json(
        { success: false, error: 'Could not establish database connection' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const workshopId = id;

    if (!workshopId) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID is required' },
        { status: 400 }
      );
    }

    const enrollments = await prisma!.workshopEnrollment.findMany({
      where: {
        workshopId: workshopId,
        status: 'ENROLLED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: {
        enrollmentDate: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: enrollments
    });

  } catch (error) {
    console.error('Error fetching workshop enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/workshops/[id]/enrollments - Inscribirse a un taller
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    if (!(await ensurePrismaConnection())) {
      return NextResponse.json(
        { success: false, error: 'Could not establish database connection' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const workshopId = id;
    const body = await request.json();
    const { userId } = body;

    if (!workshopId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if workshop exists and is active
    const workshop = await prisma!.workshop.findUnique({
      where: { id: workshopId },
      select: {
        id: true,
        maxParticipants: true,
        isActive: true,
        title: true
      }
    });

    if (!workshop) {
      return NextResponse.json(
        { success: false, error: 'Taller no encontrado' },
        { status: 404 }
      );
    }

    if (!workshop.isActive) {
      return NextResponse.json(
        { success: false, error: 'Este taller no está disponible para inscripciones' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma!.workshopEnrollment.findUnique({
      where: {
        userId_workshopId: {
          userId: userId,
          workshopId: workshopId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Ya estás inscrito en este taller' },
        { status: 400 }
      );
    }

    // Check if workshop is full
    const currentEnrollments = await prisma!.workshopEnrollment.count({
      where: {
        workshopId: workshopId,
        status: 'ENROLLED'
      }
    });

    if (currentEnrollments >= workshop.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Este taller ya está lleno' },
        { status: 400 }
      );
    }

    // Create the enrollment
    const enrollment = await prisma!.workshopEnrollment.create({
      data: {
        userId: userId,
        workshopId: workshopId,
        status: 'ENROLLED'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        workshop: {
          select: {
            title: true
          }
        }
      }
    });

    // Update workshop's current participants count
    await prisma!.workshop.update({
      where: { id: workshopId },
      data: { currentParticipants: currentEnrollments + 1 }
    });

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: 'Inscripción exitosa'
    });

  } catch (error) {
    console.error('Error creating workshop enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isPrismaAvailable())) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }

    const { id } = await params;
    const workshopId = id;
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');

    if (!workshopId || !enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID and enrollment ID are required' },
        { status: 400 }
      );
    }

    // Delete the enrollment
    await prisma!.workshopEnrollment.delete({
      where: {
        id: enrollmentId,
        workshopId: workshopId
      }
    });

    // Update the workshop's current participants count
    const currentCount = await prisma!.workshopEnrollment.count({
      where: {
        workshopId: workshopId,
        status: 'ENROLLED'
      }
    });

    await prisma!.workshop.update({
      where: { id: workshopId },
      data: { currentParticipants: currentCount }
    });

    return NextResponse.json({
      success: true,
      message: 'Enrollment removed successfully'
    });

  } catch (error) {
    console.error('Error removing workshop enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}