import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats, getPopularSearches } from '@/lib/bookCache';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includePopular = url.searchParams.get('includePopular') === 'true';
    const popularLimit = parseInt(url.searchParams.get('popularLimit') || '10');

    console.log('📊 Obteniendo estadísticas del caché...');

    // Obtener estadísticas básicas
    const cacheStats = await getCacheStats();

    // Calcular métricas adicionales
    const cacheAgeInDays = cacheStats.oldestEntry && cacheStats.newestEntry
      ? Math.ceil((cacheStats.newestEntry.getTime() - cacheStats.oldestEntry.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const result: any = {
      success: true,
      timestamp: new Date().toISOString(),
      cache: {
        totalBooks: cacheStats.totalBooks,
        uniqueSearchTerms: cacheStats.uniqueSearchTerms,
        oldestEntry: cacheStats.oldestEntry,
        newestEntry: cacheStats.newestEntry,
        cacheAgeInDays,
        health: {
          isHealthy: cacheStats.totalBooks < 10000,
          needsCleanup: cacheStats.totalBooks > 8000,
          utilizationPercentage: Math.round((cacheStats.totalBooks / 10000) * 100)
        }
      },
      metrics: {
        averageBooksPerSearch: cacheStats.uniqueSearchTerms > 0
          ? Math.round(cacheStats.totalBooks / cacheStats.uniqueSearchTerms * 100) / 100
          : 0,
        cacheEfficiency: cacheStats.totalBooks > 0 ? 'Activo' : 'Vacío',
        storageOptimization: cacheStats.totalBooks < 5000 ? 'Óptimo' :
                            cacheStats.totalBooks < 8000 ? 'Bueno' : 'Necesita limpieza'
      }
    };

    // Incluir búsquedas populares si se solicita
    if (includePopular) {
      console.log(`📈 Obteniendo las ${popularLimit} búsquedas más populares...`);
      const popularSearches = await getPopularSearches(popularLimit);

      result.popularSearches = popularSearches.map(search => ({
        query: search.query,
        searchCount: search.searchCount,
        lastSearched: search.lastSearched,
        resultCount: search.resultCount,
        avgResultsPerSearch: search.searchCount > 0
          ? Math.round(search.resultCount / search.searchCount * 100) / 100
          : 0
      }));

      result.searchAnalytics = {
        totalSearches: popularSearches.reduce((sum, search) => sum + search.searchCount, 0),
        averageResultsPerQuery: popularSearches.length > 0
          ? Math.round(popularSearches.reduce((sum, search) => sum + search.resultCount, 0) / popularSearches.length * 100) / 100
          : 0,
        mostPopularQuery: popularSearches[0]?.query || 'N/A',
        topQueriesCount: popularSearches.length
      };
    }

    console.log('✅ Estadísticas obtenidas correctamente');

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);

    return NextResponse.json(
      {
        error: 'Error obteniendo estadísticas del sistema',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}