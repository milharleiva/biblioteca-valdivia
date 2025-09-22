import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    console.log('Admin announcements DELETE API called - Using Prisma');

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    const deletedAnnouncement = await prisma.announcement.delete({
      where: {
        id: id
      }
    });

    console.log(`Successfully deleted announcement ${id} via Prisma`);

    return NextResponse.json({
      success: true,
      data: deletedAnnouncement
    });

  } catch (error) {
    console.error('Error in admin announcements DELETE API:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}