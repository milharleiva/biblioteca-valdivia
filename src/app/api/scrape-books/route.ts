import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  let browser = null;
  
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

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      timeout: 30000
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    // Ir directamente a la URL específica con el término de búsqueda
    const searchUrl = `https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal?region_id=14&commune_id%5B%5D=310&geolocation_center%5Bcoordinates%5D%5Blat%5D=&geolocation_center%5Bcoordinates%5D%5Blng%5D=&query=${encodeURIComponent(searchTerm)}`;
    console.log('Navegando directamente a:', searchUrl);

    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Página cargada, esperando resultados...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verificar si la página cargó completamente
    const pageLoaded = await page.evaluate(() => {
      const resultsDiv = document.querySelector('.results');
      const bookRows = document.querySelectorAll('.results .row');
      return {
        hasResults: !!resultsDiv,
        rowCount: bookRows.length,
        pageTitle: document.title,
        url: window.location.href
      };
    });

    console.log('Estado de la página:', pageLoaded);

    // Si no hay resultados, esperar más tiempo
    if (pageLoaded.rowCount === 0) {
      console.log('No se encontraron resultados inicialmente, esperando más...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const valdiviaCode = 'D207'; // Código fijo para Valdivia
    const finalUrl = page.url();
    console.log('URL actual:', finalUrl);

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extraer libros y doc_number de la página de resultados
    console.log('Extrayendo libros y doc_number...');

    // Primero obtener información básica de la página
    const rawBookData = await page.evaluate(() => {
      const bookRows = document.querySelectorAll('.results .row');
      const rawBooks = [];

      for (let i = 0; i < bookRows.length; i++) {
        const row = bookRows[i];
        const titleElement = row.querySelector('.title-book');
        const authorElement = row.querySelector('.autor span:not(.label)');
        const availabilityLink = row.querySelector('a.availability[href*="doc_number"]');

        rawBooks.push({
          index: i,
          title: titleElement?.textContent?.trim() || '',
          author: authorElement?.textContent?.trim() || 'Autor no especificado',
          hasAvailabilityLink: !!availabilityLink,
          availabilityHref: availabilityLink ? (availabilityLink as HTMLAnchorElement).href : '',
          hasTitle: !!titleElement,
          fullHtml: row.innerHTML.substring(0, 200) + '...' // Para debugging
        });
      }

      return {
        totalContainers: bookRows.length,
        books: rawBooks,
        pageInfo: {
          hasResultsDiv: !!document.querySelector('.results'),
          totalRows: document.querySelectorAll('.row').length,
          resultsRows: bookRows.length,
          hasPagination: !!document.querySelector('.pager'),
          currentPage: document.querySelector('.pager .is-active')?.textContent?.trim() || 'N/A'
        }
      };
    });

    console.log('=== INFORMACIÓN DETALLADA DE LA PÁGINA ===');
    console.log('Información de la página:', rawBookData.pageInfo);
    console.log(`Total de contenedores encontrados: ${rawBookData.totalContainers}`);

    console.log('\n=== ANÁLISIS DETALLADO DE CADA CONTENEDOR ===');
    rawBookData.books.forEach((book, index) => {
      console.log(`[${index + 1}/${rawBookData.totalContainers}] "${book.title}" por ${book.author}`);
      console.log(`  - Tiene título: ${book.hasTitle}`);
      console.log(`  - Tiene link de disponibilidad: ${book.hasAvailabilityLink}`);
      console.log(`  - URL de disponibilidad: ${book.availabilityHref}`);
      console.log(`  - HTML (primeros 200 chars): ${book.fullHtml}`);
    });

    // Ahora procesar con la lógica de filtrado
    const processedBooks = [];

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
    console.log(`Libros devueltos: ${Math.min(processedBooks.length, 20)}`);

    console.log(`\n=== LISTA FINAL DE LIBROS (TODOS) ===`);
    processedBooks.slice(0, 20).forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" - ${book.author}`);
      console.log(`   URL: ${book.detailUrl ? 'SÍ' : 'NO'}`);
      console.log(`   Doc Number: ${book.detailUrl.match(/doc_number=(\d+)/)?.[1] || 'N/A'}`);
    });

    const finalBooks = processedBooks.slice(0, 20);

    await browser.close();

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
        finalUrl,
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
          finalUrl,
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
    
    if (browser) {
      await browser.close();
    }
    
    return NextResponse.json(
      { 
        error: 'Error durante la búsqueda',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}