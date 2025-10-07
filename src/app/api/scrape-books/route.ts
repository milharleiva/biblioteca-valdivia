import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';

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

    console.log('========================================');
    console.log('BÚSQUEDA DIRECTA: VALDIVIA - LOS RÍOS');
    console.log('Término:', searchTerm);
    console.log('========================================');

    // Configure HTTP request with axios
    const searchUrl = `https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal?region_id=14&commune_id%5B%5D=310&geolocation_center%5Bcoordinates%5D%5Blat%5D=&geolocation_center%5Bcoordinates%5D%5Blng%5D=&query=${encodeURIComponent(searchTerm)}`;
    console.log('Solicitando URL:', searchUrl);

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

    console.log('Respuesta recibida, parseando HTML...');

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
        fullHtml: $row.html()?.substring(0, 200) + '...' || '' // Para debugging
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

    const valdiviaCode = 'D207'; // Código fijo para Valdivia

    console.log('=== INFORMACIÓN DETALLADA DE LA PÁGINA ===');
    console.log('Información de la página:', rawBookData.pageInfo);
    console.log(`Total de contenedores encontrados: ${rawBookData.totalContainers}`);

    console.log('\n=== ANÁLISIS DETALLADO DE CADA CONTENEDOR ===');
    rawBookData.books.forEach((book: RawBookData, index: number) => {
      console.log(`[${index + 1}/${rawBookData.totalContainers}] "${book.title}" por ${book.author}`);
      console.log(`  - Tiene título: ${book.hasTitle}`);
      console.log(`  - Tiene link de disponibilidad: ${book.hasAvailabilityLink}`);
      console.log(`  - URL de disponibilidad: ${book.availabilityHref}`);
      console.log(`  - HTML (primeros 200 chars): ${book.fullHtml}`);
    });

    // Ahora procesar con la lógica de filtrado
    const processedBooks: ProcessedBook[] = [];

    console.log('\n=== PROCESAMIENTO CON FILTROS ===');
    console.log(`Buscando libros con término: "${searchTerm}"`);

    for (const rawBook of rawBookData.books) {
      console.log(`\n[${processedBooks.length + 1}] Procesando: "${rawBook.title}" por ${rawBook.author}`);

      // Verificar si tiene título válido
      if (!rawBook.hasTitle || !rawBook.title) {
        console.log('  ❌ SALTANDO: Sin elemento de título válido');
        continue;
      }

      // Si hay término de búsqueda, hacer búsqueda más flexible
      if (searchTerm && searchTerm.trim() !== '') {
        const searchWords = searchTerm.toLowerCase().split(' ').filter((word: string) => word.length > 0);
        const titleLower = rawBook.title.toLowerCase();
        const authorLower = rawBook.author.toLowerCase();

        console.log(`  🔍 Palabras de búsqueda: ${searchWords.join(', ')}`);
        console.log(`  🔍 Título en minúsculas: "${titleLower}"`);
        console.log(`  🔍 Autor en minúsculas: "${authorLower}"`);

        // Verificar si el título o autor contiene al menos una palabra del término de búsqueda
        const hasMatch = searchWords.some((word: string) => {
          const titleMatch = titleLower.includes(word);
          const authorMatch = authorLower.includes(word);
          console.log(`    - Palabra "${word}": título=${titleMatch}, autor=${authorMatch}`);
          return titleMatch || authorMatch;
        });

        if (!hasMatch) {
          console.log(`  ❌ SALTANDO: "${rawBook.title}" no contiene ninguna palabra de "${searchTerm}"`);
          continue;
        }

        console.log(`  ✅ COINCIDENCIA encontrada en: "${rawBook.title}"`);
      }

      // Procesar URL de detalle
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

    console.log(`\n=== RESUMEN FINAL ===`);
    console.log(`Contenedores encontrados: ${rawBookData.totalContainers}`);
    console.log(`Libros procesados: ${processedBooks.length}`);
    console.log(`Libros devueltos: ${Math.min(processedBooks.length, 40)}`);

    console.log(`\n=== LISTA FINAL DE LIBROS (TODOS) ===`);
    processedBooks.slice(0, 40).forEach((book: ProcessedBook, index: number) => {
      console.log(`${index + 1}. "${book.title}" - ${book.author}`);
      console.log(`   URL: ${book.detailUrl ? 'SÍ' : 'NO'}`);
      console.log(`   Doc Number: ${book.detailUrl ? book.detailUrl.match(/doc_number=(\d+)/)?.[1] || 'N/A' : 'N/A'}`);
    });

    const finalBooks = processedBooks.slice(0, 40);

    console.log(`Libros encontrados en Valdivia: ${finalBooks.length}`);
    console.log(`Código de biblioteca utilizado: ${valdiviaCode}`);

    if (finalBooks.length > 0) {
      return NextResponse.json({
        success: true,
        books: finalBooks,
        searchTerm,
        source: 'Biblioteca Municipal Valdivia',
        region: 'Los Ríos',
        comuna: 'Valdivia',
        finalUrl: searchUrl,
        debugInfo: {
          totalContainers: rawBookData.totalContainers,
          processedBooks: processedBooks.length,
          finalBooks: finalBooks.length
        }
      });
    } else {
      return NextResponse.json(
        {
          error: 'No se encontraron libros en Valdivia',
          details: `No se encontraron resultados para "${searchTerm}" en la Biblioteca Municipal de Valdivia`,
          suggestion: 'Intenta con otros términos de búsqueda',
          finalUrl: searchUrl,
          debugInfo: {
            totalContainers: rawBookData.totalContainers,
            processedBooks: processedBooks.length,
            finalBooks: finalBooks.length
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
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}