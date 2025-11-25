import { prisma, isPrismaAvailable } from './prisma';

export interface CachedBook {
  id: string;
  title: string;
  author: string;
  availability: string;
  library: string;
  detailUrl?: string;
  docNumber?: string;
}

export interface BookCacheConfig {
  TTL_HOURS: number;
  MAX_CACHE_SIZE: number;
  SEARCH_SIMILARITY: number;
}

export const CACHE_CONFIG: BookCacheConfig = {
  TTL_HOURS: 24,
  MAX_CACHE_SIZE: 10000,
  SEARCH_SIMILARITY: 0.8
};

export async function searchInCache(searchTerm: string): Promise<CachedBook[]> {
  // Verificar si Prisma está disponible
  if (!prisma || !(await isPrismaAvailable())) {
    console.warn('⚠️ Prisma no disponible, saltando búsqueda en caché');
    return [];
  }

  const now = new Date();

  // Normalizar término de búsqueda
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, ' ') // Remover caracteres especiales
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  };

  const normalizedSearchTerm = normalizeText(searchTerm);
  console.log(`🔍 Cache search for: "${searchTerm}" (normalized: "${normalizedSearchTerm}")`);
  const startCacheQuery = Date.now();

  try {
    // 1. PRIMERO: Búsqueda exacta por searchTerm (más rápida y precisa)
    console.log(`   Intentando búsqueda exacta...`);
    let cachedBooks = await prisma.bookCache.findMany({
      where: {
        AND: [
          { expiresAt: { gt: now } },
          { searchTerm: { equals: normalizedSearchTerm, mode: 'insensitive' } }
        ]
      },
      orderBy: { cachedAt: 'desc' }, // Cambio: ordenar por fecha de cache, no por acceso
      take: 40
    });

    // 2. Si no hay coincidencia exacta, aplicar filtrado más estricto
    if (cachedBooks.length === 0) {
      console.log(`   Sin coincidencia exacta, aplicando filtros de relevancia...`);

      // Obtener todos los libros en caché válidos
      const allCachedBooks = await prisma.bookCache.findMany({
        where: {
          expiresAt: { gt: now }
        },
        orderBy: { cachedAt: 'desc' }
      });

      // Aplicar el mismo algoritmo de relevancia que en la búsqueda externa
      const relevantBooks = allCachedBooks.filter(book => {
        const titleNormalized = normalizeText(book.title);
        const authorNormalized = normalizeText(book.author);

        // Usar mismo sistema de scoring
        let relevanceScore = 0;

        // Coincidencia exacta del término completo
        if (titleNormalized.includes(normalizedSearchTerm)) {
          relevanceScore += 100;
        }
        if (authorNormalized.includes(normalizedSearchTerm)) {
          relevanceScore += 80;
        }
        if (titleNormalized.startsWith(normalizedSearchTerm)) {
          relevanceScore += 90;
        }

        // Solo usar palabras individuales si no hay coincidencia exacta
        if (relevanceScore === 0) {
          const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length >= 3);
          let wordMatches = 0;

          for (const word of searchWords) {
            const normalizedWord = normalizeText(word);
            if (titleNormalized.includes(normalizedWord)) {
              wordMatches++;
              relevanceScore += 15;
            }
            if (authorNormalized.includes(normalizedWord)) {
              wordMatches++;
              relevanceScore += 10;
            }
          }

          // Bonificación por mayoría de palabras
          if (wordMatches >= searchWords.length * 0.7) {
            relevanceScore += 20;
          }
        }

        // Solo incluir libros con relevancia significativa
        return relevanceScore >= 10;
      });

      cachedBooks = relevantBooks.slice(0, 40);
      console.log(`   Filtrado por relevancia: ${relevantBooks.length} libros relevantes encontrados`);
    }

    const cacheQueryTime = Date.now() - startCacheQuery;
    console.log(`⏱️ Cache query completed in ${cacheQueryTime}ms (found ${cachedBooks.length} books)`);

    // Actualizar lastAccessed para los libros encontrados
    if (cachedBooks.length > 0) {
      const bookIds = cachedBooks.map(book => book.id);
      await prisma.bookCache.updateMany({
        where: { id: { in: bookIds } },
        data: { lastAccessed: now }
      });
    }

    return cachedBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      availability: book.availability,
      library: book.library,
      detailUrl: book.detailUrl || undefined,
      docNumber: book.docNumber || undefined
    }));

  } catch (error) {
    console.error('Error searching in cache:', error);
    return [];
  }
}

export async function saveToCache(
  books: any[],
  searchTerm: string,
  sourceUrl: string
): Promise<void> {
  // Verificar si Prisma está disponible
  if (!prisma || !(await isPrismaAvailable())) {
    console.warn('⚠️ Prisma no disponible, saltando guardado en caché');
    return;
  }

  if (!books || books.length === 0) return;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_CONFIG.TTL_HOURS * 60 * 60 * 1000);

  try {
    // Crear datos para insertar
    const cacheData = books.map(book => ({
      title: book.title || '',
      author: book.author || 'Autor no especificado',
      availability: book.availability || 'Disponibilidad no especificada',
      library: book.library || 'Biblioteca no especificada',
      detailUrl: book.detailUrl || null,
      docNumber: extractDocNumber(book.detailUrl) || null,
      searchTerm: searchTerm.toLowerCase().trim(),
      sourceUrl: sourceUrl,
      region: 'Los Ríos',
      comuna: 'Valdivia',
      cachedAt: now,
      lastAccessed: now,
      expiresAt: expiresAt
    }));

    // Insertar en lotes para mejor performance
    await prisma.bookCache.createMany({
      data: cacheData,
      skipDuplicates: true
    });

    // Registrar la búsqueda
    await updateSearchQuery(searchTerm, books.length);

    console.log(`✅ Cached ${books.length} books for search term: "${searchTerm}"`);

  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

function extractDocNumber(detailUrl?: string): string | null {
  if (!detailUrl) return null;

  const match = detailUrl.match(/doc_number=(\d+)/);
  return match ? match[1] : null;
}

async function updateSearchQuery(query: string, resultCount: number): Promise<void> {
  const normalizedQuery = query.toLowerCase().trim();

  try {
    await prisma.searchQuery.upsert({
      where: { query: normalizedQuery },
      update: {
        resultCount: resultCount,
        lastSearched: new Date(),
        searchCount: { increment: 1 }
      },
      create: {
        query: normalizedQuery,
        resultCount: resultCount,
        lastSearched: new Date(),
        searchCount: 1
      }
    });
  } catch (error) {
    console.error('Error updating search query:', error);
  }
}

export async function cleanupCache(): Promise<{ removed: number; oldRemoved: number }> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Eliminar registros expirados
    const expiredResult = await prisma.bookCache.deleteMany({
      where: { expiresAt: { lt: now } }
    });

    // Eliminar registros muy antiguos no accedidos
    const oldResult = await prisma.bookCache.deleteMany({
      where: { lastAccessed: { lt: thirtyDaysAgo } }
    });

    console.log(`🧹 Cache cleanup: ${expiredResult.count} expired, ${oldResult.count} old removed`);

    return {
      removed: expiredResult.count,
      oldRemoved: oldResult.count
    };

  } catch (error) {
    console.error('Error during cache cleanup:', error);
    return { removed: 0, oldRemoved: 0 };
  }
}

export async function getCacheStats(): Promise<{
  totalBooks: number;
  uniqueSearchTerms: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}> {
  try {
    const [totalBooks, searchTermsCount, oldestEntry, newestEntry] = await Promise.all([
      prisma.bookCache.count(),
      prisma.searchQuery.count(),
      prisma.bookCache.findFirst({
        orderBy: { cachedAt: 'asc' },
        select: { cachedAt: true }
      }),
      prisma.bookCache.findFirst({
        orderBy: { cachedAt: 'desc' },
        select: { cachedAt: true }
      })
    ]);

    return {
      totalBooks,
      uniqueSearchTerms: searchTermsCount,
      oldestEntry: oldestEntry?.cachedAt || null,
      newestEntry: newestEntry?.cachedAt || null
    };

  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalBooks: 0,
      uniqueSearchTerms: 0,
      oldestEntry: null,
      newestEntry: null
    };
  }
}

export async function getPopularSearches(limit: number = 10): Promise<Array<{
  query: string;
  searchCount: number;
  lastSearched: Date;
  resultCount: number;
}>> {
  try {
    return await prisma.searchQuery.findMany({
      orderBy: { searchCount: 'desc' },
      take: limit,
      select: {
        query: true,
        searchCount: true,
        lastSearched: true,
        resultCount: true
      }
    });
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
}