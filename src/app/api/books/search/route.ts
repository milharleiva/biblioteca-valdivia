import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { searchInCache, saveToCache, CACHE_CONFIG } from '@/lib/bookCache';

interface RawBookData {
  index: number;
  title: string;
  author: string;
  hasAvailabilityLink: boolean;
  availabilityHref: string;
  hasTitle: boolean;
  fullHtml: string;
}

interface ProcessedBook {
  title: string;
  author: string;
  availability: string;
  library: string;
  detailUrl: string;
}

interface PageData {
  totalContainers: number;
  books: RawBookData[];
  pageInfo: {
    hasResultsDiv: boolean;
    totalRows: number;
    resultsRows: number;
    hasPagination: boolean;
    currentPage: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm } = await request.json();

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Término de búsqueda requerido' },
        { status: 400 }
      );
    }

    const normalizedSearchTerm = searchTerm.trim();

    console.log('========================================');
    console.log('BÚSQUEDA CON CACHÉ INTELIGENTE');
    console.log('Término:', normalizedSearchTerm);
    console.log('========================================');

    // 1. BUSCAR EN CACHÉ PRIMERO
    console.log('🔍 Buscando en caché...');
    const cachedBooks = await searchInCache(normalizedSearchTerm);

    if (cachedBooks.length > 0) {
      console.log(`✅ CACHÉ HIT: ${cachedBooks.length} libros encontrados en caché`);

      return NextResponse.json({
        success: true,
        books: cachedBooks,
        searchTerm: normalizedSearchTerm,
        source: 'cache',
        cacheHit: true,
        responseTime: 'instant',
        debugInfo: {
          cacheBooks: cachedBooks.length,
          ttlHours: CACHE_CONFIG.TTL_HOURS
        }
      });
    }

    console.log('❌ CACHÉ MISS: Consultando catálogo externo...');

    // 2. SI NO HAY CACHÉ, BUSCAR EN CATÁLOGO EXTERNO
    const searchUrl = `https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal?region_id=14&commune_id%5B%5D=310&geolocation_center%5Bcoordinates%5D%5Blat%5D=&geolocation_center%5Bcoordinates%5D%5Blng%5D=&query=${encodeURIComponent(normalizedSearchTerm)}`;
    console.log('Solicitando URL:', searchUrl);

    const startTime = Date.now();
    let response: AxiosResponse<string> | undefined;
    let retries = 3;

    while (retries > 0) {
      try {
        response = await axios.get(searchUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          }
        });
        break;
      } catch (error: unknown) {
        retries--;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Error en solicitud HTTP, intentos restantes: ${retries}`, errorMessage);
        if (retries === 0) {
          throw new Error(`Failed to fetch after multiple attempts: ${errorMessage}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!response) {
      throw new Error('No response received from server');
    }

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Respuesta externa recibida en ${responseTime}ms, parseando HTML...`);

    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);

    // Extract book data
    const bookRows = $('.results .row');
    console.log(`Encontradas ${bookRows.length} filas de resultados`);

    const rawBooks: RawBookData[] = [];

    bookRows.each((i, row) => {
      const $row = $(row);
      const titleElement = $row.find('.title-book');
      const authorElement = $row.find('.autor span:not(.label)');
      const availabilityLink = $row.find('a.availability[href*="doc_number"]');

      rawBooks.push({
        index: i,
        title: titleElement.text().trim() || '',
        author: authorElement.text().trim() || 'Autor no especificado',
        hasAvailabilityLink: availabilityLink.length > 0,
        availabilityHref: availabilityLink.attr('href') || '',
        hasTitle: titleElement.length > 0,
        fullHtml: $row.html()?.substring(0, 200) + '...' || ''
      });
    });

    const rawBookData: PageData = {
      totalContainers: bookRows.length,
      books: rawBooks,
      pageInfo: {
        hasResultsDiv: $('.results').length > 0,
        totalRows: $('.row').length,
        resultsRows: bookRows.length,
        hasPagination: $('.pager').length > 0,
        currentPage: $('.pager .is-active').text().trim() || 'N/A'
      }
    };

    const valdiviaCode = 'D207';
    const processedBooks: ProcessedBook[] = [];

    console.log('\n=== PROCESAMIENTO CON FILTROS ===');
    console.log(`Buscando libros con término: "${normalizedSearchTerm}"`);

    for (const rawBook of rawBookData.books) {
      console.log(`\n[${processedBooks.length + 1}] Procesando: "${rawBook.title}" por ${rawBook.author}`);

      if (!rawBook.hasTitle || !rawBook.title) {
        console.log('  ❌ SALTANDO: Sin elemento de título válido');
        continue;
      }

      if (normalizedSearchTerm && normalizedSearchTerm !== '') {
        const searchWords = normalizedSearchTerm.toLowerCase().split(' ').filter((word: string) => word.length > 0);

        // Normalizar texto removiendo acentos y caracteres especiales
        const normalizeText = (text: string) => {
          return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^\w\s]/g, ' ') // Remover caracteres especiales
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
        };

        const titleNormalized = normalizeText(rawBook.title);
        const authorNormalized = normalizeText(rawBook.author);

        console.log(`  🔍 Palabras de búsqueda: ${searchWords.join(', ')}`);
        console.log(`  📝 Título normalizado: "${titleNormalized}"`);
        console.log(`  👤 Autor normalizado: "${authorNormalized}"`);

        const hasMatch = searchWords.some((word: string) => {
          const normalizedWord = normalizeText(word);
          const titleMatch = titleNormalized.includes(normalizedWord);
          const authorMatch = authorNormalized.includes(normalizedWord);
          console.log(`    - Palabra "${normalizedWord}": título=${titleMatch}, autor=${authorMatch}`);
          return titleMatch || authorMatch;
        });

        if (!hasMatch) {
          console.log(`  ❌ SALTANDO: "${rawBook.title}" no contiene ninguna palabra de "${normalizedSearchTerm}"`);
          continue;
        }

        console.log(`  ✅ COINCIDENCIA encontrada en: "${rawBook.title}"`);
      }

      let detailUrl = '';
      if (rawBook.hasAvailabilityLink) {
        const docNumberMatch = rawBook.availabilityHref.match(/doc_number=(\d+)/);
        console.log(`  🔗 Extrayendo doc_number de: ${rawBook.availabilityHref}`);

        if (docNumberMatch) {
          const docNumber = docNumberMatch[1].padStart(9, '0');
          detailUrl = `http://www.bncatalogo.cl/F?func=item-global&doc_library=SBP01&doc_number=${docNumber}&sub_library=D207`;
          console.log(`  ✅ URL generada: ${detailUrl}`);
        } else {
          console.log(`  ⚠️  No se encontró doc_number en el href`);
        }
      } else {
        console.log(`  ⚠️  No tiene link de disponibilidad`);
      }

      processedBooks.push({
        title: rawBook.title,
        author: rawBook.author,
        availability: 'Disponible en Biblioteca Municipal Valdivia',
        library: 'Biblioteca Municipal Valdivia',
        detailUrl: detailUrl
      });

      console.log(`  ✅ LIBRO AGREGADO: "${rawBook.title}"`);
    }

    const finalBooks = processedBooks.slice(0, 40);

    // 3. GUARDAR EN CACHÉ PARA FUTURAS BÚSQUEDAS
    if (finalBooks.length > 0) {
      console.log(`\n💾 Guardando ${finalBooks.length} libros en caché...`);
      await saveToCache(finalBooks, normalizedSearchTerm, searchUrl);
    }

    console.log(`\n=== RESUMEN FINAL ===`);
    console.log(`Contenedores encontrados: ${rawBookData.totalContainers}`);
    console.log(`Libros procesados: ${processedBooks.length}`);
    console.log(`Libros devueltos: ${finalBooks.length}`);
    console.log(`Tiempo de respuesta: ${responseTime}ms`);
    console.log(`Guardado en caché: ${finalBooks.length > 0 ? 'SÍ' : 'NO'}`);

    if (finalBooks.length > 0) {
      return NextResponse.json({
        success: true,
        books: finalBooks,
        searchTerm: normalizedSearchTerm,
        source: 'external',
        cacheHit: false,
        responseTime: `${responseTime}ms`,
        region: 'Los Ríos',
        comuna: 'Valdivia',
        finalUrl: searchUrl,
        debugInfo: {
          totalContainers: rawBookData.totalContainers,
          processedBooks: processedBooks.length,
          finalBooks: finalBooks.length,
          cached: true,
          ttlHours: CACHE_CONFIG.TTL_HOURS
        }
      });
    } else {
      return NextResponse.json(
        {
          error: 'No se encontraron libros en Valdivia',
          details: `No se encontraron resultados para "${normalizedSearchTerm}" en la Biblioteca Municipal de Valdivia`,
          suggestion: 'Intenta con otros términos de búsqueda',
          finalUrl: searchUrl,
          debugInfo: {
            totalContainers: rawBookData.totalContainers,
            processedBooks: processedBooks.length,
            finalBooks: finalBooks.length,
            cached: false
          }
        },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('ERROR:', error);

    return NextResponse.json(
      {
        error: 'Error durante la búsqueda',
        details: error instanceof Error ? error.message : 'Error desconocido',
        source: 'error',
        cacheHit: false
      },
      { status: 500 }
    );
  }
}