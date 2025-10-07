import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaAvailable } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      DIRECT_URL: process.env.DIRECT_URL ? 'SET' : 'NOT SET',
    },
    prisma: {
      available: !!prisma,
      connection: false,
      error: null
    },
    cache: {
      totalBooks: 0,
      totalSearches: 0,
      error: null
    }
  };

  try {
    // Test Prisma connection
    if (prisma) {
      debugInfo.prisma.connection = await isPrismaAvailable();

      if (debugInfo.prisma.connection) {
        try {
          debugInfo.cache.totalBooks = await prisma.bookCache.count();
          debugInfo.cache.totalSearches = await prisma.searchQuery.count();
        } catch (error) {
          debugInfo.cache.error = error instanceof Error ? error.message : 'Unknown error';
        }
      }
    }
  } catch (error) {
    debugInfo.prisma.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json({
    success: true,
    debug: debugInfo,
    recommendations: generateRecommendations(debugInfo)
  });
}

function generateRecommendations(debugInfo: any): string[] {
  const recommendations: string[] = [];

  if (!debugInfo.environment.DATABASE_URL) {
    recommendations.push('⚠️ DATABASE_URL no está configurada en las variables de entorno');
  }

  if (debugInfo.environment.VERCEL && !debugInfo.environment.DIRECT_URL) {
    recommendations.push('⚠️ DIRECT_URL no está configurada (recomendada para Vercel)');
  }

  if (!debugInfo.prisma.available) {
    recommendations.push('❌ Prisma client no está disponible');
  }

  if (!debugInfo.prisma.connection) {
    recommendations.push('❌ No se puede conectar a la base de datos');
  }

  if (debugInfo.cache.error) {
    recommendations.push(`❌ Error en operaciones de caché: ${debugInfo.cache.error}`);
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Todo parece estar funcionando correctamente');
  }

  return recommendations;
}