import { NextRequest, NextResponse } from 'next/server';
import { cleanupCache, getCacheStats } from '@/lib/bookCache';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Iniciando limpieza automática de caché...');

    // Obtener estadísticas antes de la limpieza
    const statsBefore = await getCacheStats();

    // Ejecutar limpieza
    const cleanupResult = await cleanupCache();

    // Obtener estadísticas después de la limpieza
    const statsAfter = await getCacheStats();

    console.log('✅ Limpieza completada:', {
      before: statsBefore,
      removed: cleanupResult,
      after: statsAfter
    });

    return NextResponse.json({
      success: true,
      message: 'Limpieza de caché completada exitosamente',
      statistics: {
        before: statsBefore,
        removed: cleanupResult,
        after: statsAfter
      },
      cleanupSummary: {
        expiredRecordsRemoved: cleanupResult.removed,
        oldRecordsRemoved: cleanupResult.oldRemoved,
        totalRemoved: cleanupResult.removed + cleanupResult.oldRemoved,
        booksRemaining: statsAfter.totalBooks,
        spaceSaved: `${cleanupResult.removed + cleanupResult.oldRemoved} registros`
      }
    });

  } catch (error) {
    console.error('Error durante la limpieza de caché:', error);

    return NextResponse.json(
      {
        error: 'Error durante la limpieza de caché',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Solo obtener estadísticas sin limpiar
    const stats = await getCacheStats();

    return NextResponse.json({
      success: true,
      statistics: stats,
      cacheInfo: {
        totalBooks: stats.totalBooks,
        uniqueSearchTerms: stats.uniqueSearchTerms,
        oldestEntry: stats.oldestEntry,
        newestEntry: stats.newestEntry,
        cacheHealthy: stats.totalBooks < 10000, // Saludable si tiene menos de 10k registros
        needsCleanup: stats.totalBooks > 8000 // Necesita limpieza si supera 8k
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de caché:', error);

    return NextResponse.json(
      {
        error: 'Error obteniendo estadísticas de caché',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}