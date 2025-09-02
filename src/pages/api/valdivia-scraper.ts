// src/pages/api/valdivia-scraper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { VALDIVIA_CONFIG, buildValdiviaURL } from '@/utils/valdivia-config';
import { extraerISBN, extraerAño } from '@/utils/scraper-helpers';
import type { Libro, ScrapingRequest, ScrapingResponse } from '@/types/biblioteca';

// Configuración del scraper específico para Valdivia
class ValdiviaScraperService {
  private browser: any = null;
  private page: any = null;
  private librosData: Libro[] = [];

  async initBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      
      this.page = await this.browser.newPage();
      
      // Configurar user agent específico
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      // Configurar viewport
      await this.page.setViewport({ width: 1366, height: 768 });
      
      // Bloquear recursos innecesarios para mayor velocidad
      await this.page.setRequestInterception(true);
      this.page.on('request', (request: any) => {
        const resourceType = request.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });
      
      console.log('Browser inicializado para Valdivia');
    } catch (error) {
      console.error('Error inicializando browser:', error);
      throw new Error('No se pudo inicializar el navegador');
    }
  }

  async navegarAValdivia(query: string = '') {
    try {
      const url = buildValdiviaURL(query);
      console.log(`Navegando a Valdivia: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 45000
      });

      console.log('Página de Valdivia cargada exitosamente');
    } catch (error) {
      console.error('Error navegando a Valdivia:', error);
      throw new Error('No se pudo cargar la página de bibliotecas de Valdivia');
    }
  }

  async esperarContenidoDinamico() {
    try {
      console.log('Esperando contenido dinámico de Valdivia...');
      
      // Selectores específicos para el sistema de bibliotecas de Valdivia
      const selectoresValdivia = [
        '.libro-item',
        '.book-item', 
        '.result-item',
        '.card-libro',
        '[data-libro]',
        '[class*="libro"]',
        '[class*="book"]',
        '.item',
        '.resultado',
        '.search-result',
        '.publication'
      ];

      let contenidoEncontrado = false;
      
      for (const selector of selectoresValdivia) {
        try {
          await this.page.waitForSelector(selector, { timeout: 15000 });
          console.log(`Contenido de Valdivia encontrado con: ${selector}`);
          contenidoEncontrado = true;
          break;
        } catch (e) {
          console.log(`Selector ${selector} no encontrado en Valdivia`);
        }
      }

      // Scroll para cargar todo el contenido de las bibliotecas
      await this.scrollParaCargarTodo();
      
      // Tiempo adicional para asegurar carga completa
      await this.page.waitForTimeout(5000);
      
      if (!contenidoEncontrado) {
        console.warn('No se encontraron selectores específicos, pero continuando...');
      }
      
    } catch (error) {
      console.log('Timeout esperando contenido específico de Valdivia, continuando con HTML disponible');
    }
  }

  async scrollParaCargarTodo() {
    try {
      await this.page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 150;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      console.log('Scroll completado en página de Valdivia');
    } catch (error) {
      console.error('Error durante scroll en Valdivia:', error);
    }
  }

  async extraerLibrosValdivia(): Promise<Libro[]> {
    try {
      console.log('Extrayendo libros de las bibliotecas de Valdivia...');
      
      const html = await this.page.content();
      const $ = cheerio.load(html);
      
      const librosEncontrados: Libro[] = [];
      
      // Estructuras específicas para el sistema de bibliotecas de Valdivia
      const estructurasValdivia = [
        {
          container: '.libro-item, .book-item, .item-libro, .book-card, .publication',
          titulo: '.titulo, .title, h2, h3, .book-title, .nombre, .publication-title',
          autor: '.autor, .author, .book-author, .by, .creator',
          disponibilidad: '.disponibilidad, .availability, .status, .estado, .disponible, .location',
          enlace: 'a[href*="bncatalogo"], a[href*="disponibilidad"], .ver-disponibilidad, .link-disponibilidad'
        },
        {
          container: '.result-item, .resultado, .card, .search-result, .item',
          titulo: 'h2, h3, h4, .title, .titulo-libro, strong, .main-title',
          autor: '.author, .autor, .by-author, .writer, .creator',
          disponibilidad: '.status, .disponible, .estado-libro, .availability, .library-info',
          enlace: 'a[href*="bncatalogo"], a[href*="disponibilidad"]'
        },
        {
          container: '[class*="libro"], [class*="book"], [data-libro], .item, .entry',
          titulo: 'h1, h2, h3, h4, h5, .title, strong, b, .nombre, .entry-title',
          autor: '.author, .autor, .writer, .by, .creador, .creator',
          disponibilidad: '.status, .disponible, .available, .estado, .disponibilidad, .location',
          enlace: 'a[href*="bncatalogo"], a[href*="disponibilidad"], a[title*="disponibilidad"]'
        },
        {
          container: 'div, article, section, li, .content',
          titulo: 'h1, h2, h3, h4, .title, .book-title, strong, .main-title',
          autor: '.author, .autor, .by, .creator',
          disponibilidad: '.status, .disponibilidad, .disponible, .library',
          enlace: 'a[href*="bncatalogo"], a[href*="F?func="]'
        },
        // Nueva estructura más amplia para capturar contenido que se nos escape
        {
          container: '*',
          titulo: 'h1, h2, h3, h4, h5, h6, strong, b, .title',
          autor: '.author, .autor, .by, .creator, .writer',
          disponibilidad: '.status, .disponibilidad, .disponible, .library, .location',
          enlace: 'a[href*="bncatalogo"], a[href*="F?func="]'
        }
      ];

      // Intentar con cada estructura
      for (const estructura of estructurasValdivia) {
        const containers = $(estructura.container);
        
        console.log(`Probando estructura: ${estructura.container} - Encontrados: ${containers.length}`);
        
        if (containers.length > 0) {
          containers.each((index, container) => {
            const $container = $(container);
            const textoCompleto = $container.text();
            
            // Filtrar contenedores que parezcan contener información de libros
            if (textoCompleto.length < 15 || textoCompleto.length > 3000) {
              return; // Skip containers muy pequeños o muy grandes
            }
            
            const titulo = $container.find(estructura.titulo).first().text().trim();
            
            // Validar que el título sea válido
            if (!titulo || titulo.length < 2 || titulo.length > 400) {
              return;
            }
            
            // Filtrar títulos que claramente no son libros
            const titulosExcluir = ['menú', 'navegación', 'header', 'footer', 'inicio', 'buscar', 'contacto'];
            if (titulosExcluir.some(excluir => titulo.toLowerCase().includes(excluir))) {
              return;
            }
            
            // Evitar duplicados obvios
            if (librosEncontrados.some(libro => 
              libro.titulo.toLowerCase() === titulo.toLowerCase()
            )) {
              return;
            }
            
            const autor = $container.find(estructura.autor).first().text().trim();
            const disponibilidad = $container.find(estructura.disponibilidad).first().text().trim();
            
            // Buscar específicamente enlaces de disponibilidad
            const enlaceElement = $container.find(estructura.enlace).first();
            let enlace = enlaceElement.attr('href') || '';
            
            // Si no encontramos enlace específico, buscar cualquier enlace que vaya a bncatalogo
            if (!enlace) {
              const todoLosEnlaces = $container.find('a');
              todoLosEnlaces.each((i, el) => {
                const href = $(el).attr('href') || '';
                if (href.includes('bncatalogo') || href.includes('F?func=') || href.toLowerCase().includes('disponibilidad')) {
                  enlace = href;
                  return false; // Break the loop
                }
              });
            }
            
            // Extraer información adicional del texto completo
            const isbn = extraerISBN(textoCompleto);
            const año = extraerAño(textoCompleto);
            const editorial = this.extraerEditorial($container, textoCompleto);
            
            // Determinar biblioteca específica
            const biblioteca = this.determinarBibliotecaValdivia(textoCompleto, enlace);
            
            // FILTRO IMPORTANTE: Solo incluir libros que están en Valdivia
            const esLibroDeValdivia = this.esDeValdivia(textoCompleto, disponibilidad, enlace);
            
            if (!esLibroDeValdivia && !biblioteca) {
              console.log(`Libro descartado - no es de Valdivia: ${titulo.substring(0, 50)}...`);
              return; // Skip libros que no son de Valdivia
            }
            
            const libro: Libro = {
              titulo,
              autor: autor || 'Autor no especificado',
              isbn,
              editorial,
              año,
              disponibilidad: disponibilidad || 'Estado no especificado',
              urlDisponibilidad: this.construirURLCompleta(enlace),
              biblioteca: biblioteca || 'Biblioteca Pública de Valdivia',
              htmlOriginal: $container.html()?.substring(0, 500) || ''
            };
            
            librosEncontrados.push(libro);
          });
          
          if (librosEncontrados.length > 0) {
            console.log(`Éxito con estructura: ${estructura.container}`);
            break;
          }
        }
      }

      // Si no encontramos nada con estructuras específicas, análisis general
      if (librosEncontrados.length === 0) {
        console.log('Realizando análisis general de HTML para Valdivia...');
        const analisisGeneral = this.analisisGeneralValdiviaHTML($);
        librosEncontrados.push(...analisisGeneral);
      }

      // Filtrar resultados finales para asegurar que solo sean de Valdivia
      const librosSoloValdivia = librosEncontrados.filter(libro => {
        const textoCompleto = `${libro.titulo} ${libro.disponibilidad} ${libro.urlDisponibilidad}`;
        return this.esDeValdivia(textoCompleto, libro.disponibilidad, libro.urlDisponibilidad);
      });

      // Limpiar y validar resultados
      const librosLimpios = this.limpiarResultadosValdivia(librosSoloValdivia);
      
      this.librosData.push(...librosLimpios);
      console.log(`Total libros extraídos de Valdivia: ${librosLimpios.length} (filtrados de ${librosEncontrados.length} totales)`);
      
      return librosLimpios;
      
    } catch (error) {
      console.error('Error extrayendo libros de Valdivia:', error);
      throw new Error('No se pudieron extraer los libros de las bibliotecas de Valdivia');
    }
  }

  private extraerEditorial($container: any, texto: string): string {
    // Buscar editorial en elementos específicos
    const editorialElement = $container.find('.editorial, .publisher, .edit, [class*="editorial"]').first();
    if (editorialElement.length > 0) {
      return editorialElement.text().trim();
    }
    
    // Buscar en el texto con patrones
    const patronesEditorial = [
      /Editorial[:\s]+([^,\n]+)/i,
      /Publicado por[:\s]+([^,\n]+)/i,
      /Ed\.[:\s]+([^,\n]+)/i
    ];
    
    for (const patron of patronesEditorial) {
      const match = texto.match(patron);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return '';
  }

  private determinarBibliotecaValdivia(texto: string, enlace: string): string {
    // Bibliotecas específicas de Valdivia que podrían aparecer
    const bibliotecasValdivia = [
      'Biblioteca Municipal de Valdivia',
      'Biblioteca Pública de Valdivia', 
      'Biblioteca Regional de Valdivia',
      'BiblioRed Valdivia',
      'Biblioteca Central Valdivia',
      'BP. Valdivia',
      'B.P. Valdivia',
      'Bib. Valdivia',
      'Valdivia'
    ];
    
    const textoLower = texto.toLowerCase();
    const enlaceLower = enlace.toLowerCase();
    
    // Verificar si menciona específicamente Valdivia
    for (const biblioteca of bibliotecasValdivia) {
      if (textoLower.includes(biblioteca.toLowerCase()) || 
          enlaceLower.includes(biblioteca.toLowerCase())) {
        return biblioteca;
      }
    }
    
    return ''; // Devolver vacío si no es de Valdivia
  }

  // Nueva función para verificar si un libro está en Valdivia
  private esDeValdivia(textoCompleto: string, disponibilidad: string, enlace: string): boolean {
    const textoTotal = `${textoCompleto} ${disponibilidad} ${enlace}`.toLowerCase();
    
    // Palabras clave que indican que es de Valdivia
    const indicadoresValdivia = [
      'valdivia',
      'bp. valdivia',
      'b.p. valdivia',
      'biblioteca valdivia',
      'municipal valdivia',
      'regional valdivia'
    ];
    
    // Verificar si contiene algún indicador de Valdivia
    const tieneValdivia = indicadoresValdivia.some(indicador => 
      textoTotal.includes(indicador)
    );
    
    // Palabras que indican que NO es de Valdivia
    const indicadoresOtrasComunas = [
      'lago ranco',
      'panguipulli',
      'corral',
      'lanco',
      'los lagos',
      'paillaco',
      'máfil',
      'mariquina',
      'futrono'
    ];
    
    // Verificar si es de otra comuna
    const esDeOtraComuna = indicadoresOtrasComunas.some(indicador => 
      textoTotal.includes(indicador)
    );
    
    // Solo es de Valdivia si tiene indicadores de Valdivia Y NO es de otra comuna
    return tieneValdivia && !esDeOtraComuna;
  }

  private construirURLCompleta(enlace: string): string {
    if (!enlace) return '';
    
    // Si ya es una URL completa, devolverla tal como está
    if (enlace.startsWith('http')) {
      return enlace;
    }
    
    // Si es una URL de bncatalogo, agregar el dominio correcto
    if (enlace.includes('bncatalogo') || enlace.includes('F?func=')) {
      return enlace.startsWith('/') ? `http://www.bncatalogo.cl${enlace}` : `http://www.bncatalogo.cl/${enlace}`;
    }
    
    // Para otros enlaces, usar el dominio de bibliotecaspublicas
    if (enlace.startsWith('/')) {
      return `https://www.bibliotecaspublicas.gob.cl${enlace}`;
    }
    
    return `https://www.bibliotecaspublicas.gob.cl/${enlace}`;
  }

  // FUNCIÓN CORREGIDA
  private analisisGeneralValdiviaHTML($: any): Libro[] {
    const libros: Libro[] = [];
    
    // Buscar elementos que podrían contener libros de Valdivia
    const elementos = $('div, article, section, li');
    
    elementos.each((index: number, element: any) => {
      const $element = $(element);
      const texto = $element.text().trim();
      
      // Criterios para identificar posibles libros
      const tieneIsbn = /ISBN|isbn|\d{13}|\d{10}/.test(texto);
      const tieneTituloLargo = texto.length > 30 && texto.length < 500;
      const tieneAutor = /autor|author|escrito por|by|obra de/i.test(texto);
      const tieneAño = /(19|20)\d{2}/.test(texto);
      
      // Verificar si es contenido relevante de libro
      const esLibro = (tieneIsbn || (tieneAutor && tieneAño)) && tieneTituloLargo;
      
      if (esLibro) {
        const titulo = $element.find('h1, h2, h3, h4, h5, strong, b').first().text().trim() || 
                      texto.split('\n')[0].trim().substring(0, 200);
        
        if (titulo && titulo.length > 5 && titulo.length < 300) {
          libros.push({
            titulo: titulo,
            autor: 'Autor no especificado',
            isbn: extraerISBN(texto),
            editorial: '',
            año: extraerAño(texto),
            disponibilidad: 'Consultar disponibilidad',
            urlDisponibilidad: '',
            biblioteca: 'Biblioteca Pública de Valdivia',
            htmlOriginal: texto.substring(0, 300)
          });
        }
      }
    });
    
    return libros.slice(0, 50); // Limitar resultados del análisis general
  }

  private limpiarResultadosValdivia(libros: Libro[]): Libro[] {
    // Eliminar duplicados y limpiar datos
    const librosUnicos = new Map<string, Libro>();
    
    for (const libro of libros) {
      const clave = libro.titulo.toLowerCase().trim();
      
      // Solo agregar si no existe o si este tiene más información
      if (!librosUnicos.has(clave) || 
          (librosUnicos.get(clave)!.autor === 'Autor no especificado' && libro.autor !== 'Autor no especificado')) {
        
        // Limpiar y validar datos
        const libroLimpio: Libro = {
          titulo: libro.titulo.trim(),
          autor: libro.autor.trim() || 'Autor no especificado',
          isbn: libro.isbn.trim(),
          editorial: libro.editorial.trim(),
          año: libro.año.trim(),
          disponibilidad: libro.disponibilidad.trim() || 'Consultar disponibilidad',
          urlDisponibilidad: libro.urlDisponibilidad.trim(),
          biblioteca: libro.biblioteca || 'Biblioteca Pública de Valdivia'
        };
        
        librosUnicos.set(clave, libroLimpio);
      }
    }
    
    return Array.from(librosUnicos.values());
  }

  async buscarPorTermino(termino: string): Promise<Libro[]> {
    try {
      console.log(`Buscando en Valdivia: "${termino}"`);
      
      await this.navegarAValdivia(termino);
      await this.esperarContenidoDinamico();
      const libros = await this.extraerLibrosValdivia();
      
      return libros;
    } catch (error) {
      console.error('Error en búsqueda por término en Valdivia:', error);
      throw error;
    }
  }

  async buscarMultiplesTerminos(terminos: string[]): Promise<Libro[]> {
    const todosLosLibros: Libro[] = [];
    
    for (const termino of terminos.slice(0, 5)) { // Máximo 5 términos
      try {
        console.log(`Procesando término: ${termino}`);
        const libros = await this.buscarPorTermino(termino);
        todosLosLibros.push(...libros);
        
        // Pausa entre búsquedas para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`Error buscando término "${termino}":`, error);
        // Continuar con el siguiente término
      }
    }
    
    // Eliminar duplicados finales
    return this.limpiarResultadosValdivia(todosLosLibros);
  }

  // FUNCIÓN DE DEBUG MEJORADA
  async debugHTML() {
    try {
      const html = await this.page.content();
      const $ = cheerio.load(html);
      
      // Información más detallada
      const debugInfo = {
        titulo: $('title').text() || 'No encontrado',
        url: this.page.url(),
        totalElementos: {
          divs: $('div').length,
          articles: $('article').length,
          sections: $('section').length,
          links: $('a').length,
          headings: $('h1, h2, h3, h4, h5, h6').length
        },
        clasesRelevantes: this.encontrarClasesRelevantes($),
        estructuraBasica: this.analizarEstructura($),
        // NUEVO: Buscar texto que contenga palabras clave
        textoConLibros: this.buscarTextoRelevante($),
        // NUEVO: Enlaces que van a bncatalogo
        enlacesBncatalogo: this.encontrarEnlacesBncatalogo($),
        // NUEVO: Muestra de HTML para análisis
        muestraHTML: $('body').html()?.substring(0, 1000) || 'No HTML encontrado'
      };
      
      return debugInfo;
    } catch (error) {
      console.error('Error en debug HTML:', error);
      return { error: 'No se pudo obtener información de debug' };
    }
  }

  // Nuevas funciones auxiliares para debug
  private buscarTextoRelevante($: any): string[] {
    const textosRelevantes: string[] = [];
    const palabrasClave = ['libro', 'autor', 'título', 'disponible', 'biblioteca', 'valdivia'];
    
    $('*').each((index: number, element: any) => {
      const texto = $(element).text().trim();
      if (texto.length > 20 && texto.length < 200) {
        const tieneRelevancia = palabrasClave.some(palabra => 
          texto.toLowerCase().includes(palabra)
        );
        if (tieneRelevancia) {
          textosRelevantes.push(texto.substring(0, 150));
        }
      }
    });
    
    return textosRelevantes.slice(0, 10); // Primeros 10 textos relevantes
  }

  private encontrarEnlacesBncatalogo($: any): string[] {
    const enlaces: string[] = [];
    
    $('a[href]').each((index: number, element: any) => {
      const href = $(element).attr('href') || '';
      if (href.includes('bncatalogo') || href.includes('F?func=')) {
        enlaces.push(href);
      }
    });
    
    return enlaces.slice(0, 5); // Primeros 5 enlaces
  }

  // FUNCIÓN CORREGIDA
  private encontrarClasesRelevantes($: any): string[] {
    const clasesRelevantes = new Set<string>();
    const palabrasClave = ['libro', 'book', 'item', 'result', 'card', 'titulo', 'author'];
    
    const elementos = $('[class]');
    
    elementos.each((index: number, element: any) => {
      const clases = $(element).attr('class')?.split(' ') || [];
      clases.forEach((clase: string) => {
        const tieneClaveRelevante = palabrasClave.some(keyword => 
          clase.toLowerCase().includes(keyword)
        );
        if (tieneClaveRelevante) {
          clasesRelevantes.add(clase);
        }
      });
    });
    
    return Array.from(clasesRelevantes).slice(0, 20);
  }

  private analizarEstructura($: any) {
    return {
      headings: {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        h4: $('h4').length
      },
      contenedores: {
        divs: $('div').length,
        articles: $('article').length,
        sections: $('section').length,
        lists: $('ul, ol').length
      },
      formularios: $('form, input, select').length
    };
  }

  async cerrar() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser de Valdivia cerrado');
    }
  }
}

// Handler principal de la API
export default async function handler(req: NextApiRequest, res: NextApiResponse<ScrapingResponse>) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      exito: false,
      error: 'Método no permitido. Use POST.',
      biblioteca: 'Valdivia'
    });
  }

  const scraper = new ValdiviaScraperService();
  
  try {
    const {
      accion = 'buscar_general',
      terminoBusqueda = '',
      terminos = []
    }: ScrapingRequest = req.body;

    // Validar entrada
    if (!accion || !['buscar_general', 'buscar_termino', 'buscar_multiples', 'debug'].includes(accion)) {
      throw new Error('Acción no válida');
    }

    console.log(`Iniciando scraping para Valdivia - Acción: ${accion}`);
    
    await scraper.initBrowser();

    let resultado: ScrapingResponse;

    switch (accion) {
      case 'buscar_general':
        await scraper.navegarAValdivia();
        await scraper.esperarContenidoDinamico();
        const librosGenerales = await scraper.extraerLibrosValdivia();
        
        resultado = {
          exito: true,
          libros: librosGenerales,
          total: librosGenerales.length,
          biblioteca: 'Valdivia'
        };
        break;

      case 'buscar_termino':
        if (!terminoBusqueda?.trim()) {
          throw new Error('Se requiere término de búsqueda para Valdivia');
        }
        
        const librosTermino = await scraper.buscarPorTermino(terminoBusqueda);
        
        resultado = {
          exito: true,
          termino: terminoBusqueda,
          libros: librosTermino,
          total: librosTermino.length,
          biblioteca: 'Valdivia'
        };
        break;

      case 'buscar_multiples':
        if (!Array.isArray(terminos) || terminos.length === 0) {
          throw new Error('Se requiere array de términos de búsqueda para Valdivia');
        }
        
        const todosLosLibros = await scraper.buscarMultiplesTerminos(terminos);
        
        resultado = {
          exito: true,
          terminos: terminos,
          libros: todosLosLibros,
          total: todosLosLibros.length,
          biblioteca: 'Valdivia'
        };
        break;

      case 'debug':
        await scraper.navegarAValdivia();
        await scraper.esperarContenidoDinamico();
        const debugInfo = await scraper.debugHTML();
        
        resultado = {
          exito: true,
          debug: debugInfo,
          biblioteca: 'Valdivia'
        };
        break;

      default:
        throw new Error('Acción no reconocida para Valdivia');
    }

    // Log de éxito
    console.log(`Scraping de Valdivia completado exitosamente. Libros encontrados: ${resultado.total || 0}`);
    
    res.status(200).json(resultado);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en Valdivia';
    console.error('Error en scraping de Valdivia:', error);
    
    res.status(500).json({
      exito: false,
      error: errorMessage,
      biblioteca: 'Valdivia',
      debug: process.env.NODE_ENV === 'development' ? {
        stack: error instanceof Error ? error.stack : undefined,
        config: VALDIVIA_CONFIG
      } : undefined
    });
  } finally {
    await scraper.cerrar();
  }
}

// Configuración para Next.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    maxDuration: 120, // 2 minutos timeout para Valdivia
  },
};