// src/pages/api/valdivia-scraper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { VALDIVIA_CONFIG, buildValdiviaURL, buildCatalogURL } from '@/utils/valdivia-config';
import { extraerISBN, extraerAño } from '@/utils/scraper-helpers';
import type { Libro, ScrapingRequest, ScrapingResponse } from '@/types/biblioteca';

class ValdiviaScraperService {
  private browser: any = null;
  private page: any = null;

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
      
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      await this.page.setViewport({ width: 1366, height: 768 });
      
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
        waitUntil: 'networkidle0',
        timeout: 60000
      });

      console.log('Página de Valdivia cargada exitosamente');
    } catch (error) {
      console.error('Error navegando a Valdivia:', error);
      throw new Error('No se pudo cargar la página de bibliotecas de Valdivia');
    }
  }

  async esperarContenidoDinamico() {
    try {
      console.log('Esperando contenido dinámico de libros...');
      
      // Esperar a que aparezcan los resultados
      await this.page.waitForFunction(
        () => {
          const texto = document.body.textContent || '';
          return texto.includes('Harry Potter') || 
                 texto.includes('Autor:') || 
                 texto.includes('El ejemplar se encuentra') ||
                 texto.includes('Resultados de búsqueda') ||
                 document.querySelectorAll('*').length > 100;
        },
        { timeout: 30000 }
      );

      // Scroll para asegurar que todo el contenido se cargue
      await this.scrollParaCargarTodo();
      
      // Tiempo adicional para asegurar carga completa
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('Contenido dinámico cargado');
      
    } catch (error) {
      console.log('Timeout esperando contenido específico, continuando...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Esperar al menos 10 segundos
    }
  }

  async scrollParaCargarTodo() {
    try {
      await this.page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
            }
          }, 200);
        });
      });
      console.log('Scroll completado');
    } catch (error) {
      console.error('Error durante scroll:', error);
    }
  }

  async extraerLibrosValdivia(): Promise<Libro[]> {
    try {
      console.log('Extrayendo libros de las bibliotecas de Valdivia...');
      
      const html = await this.page.content();
      const $ = cheerio.load(html);
      
      console.log('HTML length:', html.length);
      console.log('Texto que contiene Harry Potter:', html.includes('Harry Potter'));
      
      const librosEncontrados: Libro[] = [];
      
      // Buscar el patrón específico que vemos en el contenido
      const textoCompleto = $.root().text();
      console.log('Texto completo length:', textoCompleto.length);
      
      // Dividir el contenido por los patrones de libros
      const patronLibro = /([^\.]+)\s*Autor:\s*([^\.]+)\s*El ejemplar se encuentra en las siguientes bibliotecas:/g;
      
      let match;
      let numeroLibro = 0;
      
      while ((match = patronLibro.exec(textoCompleto)) !== null && numeroLibro < 50) {
        const titulo = this.limpiarTexto(match[1]);
        const autor = this.limpiarTexto(match[2]);
        
        if (this.esTituloValido(titulo)) {
          numeroLibro++;
          
          // Generar un número de documento simulado (en un caso real, tendríamos que extraerlo)
          const docNumber = (1000000 + numeroLibro).toString().padStart(9, '0');
          
          const libro: Libro = {
            titulo,
            autor: autor || 'Autor no especificado',
            isbn: '',
            editorial: '',
            año: '',
            disponibilidad: 'Disponible en biblioteca',
            urlDisponibilidad: buildCatalogURL(docNumber),
            biblioteca: 'Biblioteca Pública de Valdivia',
            docNumber,
            subLibrary: 'D207'
          };
          
          librosEncontrados.push(libro);
        }
      }
      
      // Si no encontramos libros con el patrón, intentar búsqueda alternativa
      if (librosEncontrados.length === 0) {
        console.log('Intentando método alternativo de extracción...');
        const librosAlternativos = this.extraerLibrosMetodoAlternativo($);
        librosEncontrados.push(...librosAlternativos);
      }

      console.log(`Total libros extraídos: ${librosEncontrados.length}`);
      
      return this.limpiarResultados(librosEncontrados);
      
    } catch (error) {
      console.error('Error extrayendo libros:', error);
      throw new Error('No se pudieron extraer los libros');
    }
  }

  private extraerLibrosMetodoAlternativo($: any): Libro[] {
    const libros: Libro[] = [];
    
    // Buscar todos los elementos que contengan texto relacionado con libros
    const elementos = $('*').filter(function(this: any) {
      const texto = $(this).text();
      return texto.includes('Autor:') && texto.length > 50 && texto.length < 1000;
    });
    
    elementos.each((index: number, element: any) => {
      const $element = $(element);
      const textoElemento = $element.text();
      
      // Extraer información usando expresiones regulares
      const tituloMatch = textoElemento.match(/^([^A]+?)(?=Autor:)/);
      const autorMatch = textoElemento.match(/Autor:\s*([^E]+?)(?=El ejemplar|$)/);
      
      if (tituloMatch && autorMatch) {
        const titulo = this.limpiarTexto(tituloMatch[1]);
        const autor = this.limpiarTexto(autorMatch[1]);
        
        if (this.esTituloValido(titulo)) {
          const docNumber = (1000000 + index).toString().padStart(9, '0');
          
          libros.push({
            titulo,
            autor,
            isbn: '',
            editorial: '',
            año: '',
            disponibilidad: 'Disponible en biblioteca',
            urlDisponibilidad: buildCatalogURL(docNumber),
            biblioteca: 'Biblioteca Pública de Valdivia',
            docNumber,
            subLibrary: 'D207'
          });
        }
      }
    });
    
    return libros;
  }

  private limpiarTexto(texto: string): string {
    return texto
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .replace(/^[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+/, '')
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-\.\,\:\(\)]+$/, '');
  }

  private esTituloValido(titulo: string): boolean {
    if (!titulo || titulo.length < 3 || titulo.length > 200) {
      return false;
    }
    
    const titulosExcluir = [
      'puedes revisar',
      'menú', 'navegación', 'header', 'footer', 'inicio', 'buscar', 
      'contacto', 'biblioteca', 'catálogo', 'resultados',
      'el ejemplar se encuentra',
      'autor:',
      'no obstante'
    ];
    
    const tituloLower = titulo.toLowerCase();
    return !titulosExcluir.some(excluir => tituloLower.includes(excluir));
  }

  private limpiarResultados(libros: Libro[]): Libro[] {
    const librosUnicos = new Map<string, Libro>();
    
    for (const libro of libros) {
      const clave = libro.titulo.toLowerCase().trim();
      
      if (!librosUnicos.has(clave)) {
        const libroLimpio: Libro = {
          titulo: libro.titulo.trim(),
          autor: libro.autor.trim() || 'Autor no especificado',
          isbn: libro.isbn.trim(),
          editorial: libro.editorial.trim(),
          año: libro.año.trim(),
          disponibilidad: libro.disponibilidad.trim() || 'Consultar disponibilidad',
          urlDisponibilidad: libro.urlDisponibilidad.trim(),
          biblioteca: libro.biblioteca || 'Biblioteca Pública de Valdivia',
          docNumber: libro.docNumber,
          subLibrary: libro.subLibrary || 'D207'
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
      console.error('Error en búsqueda por término:', error);
      throw error;
    }
  }

  async buscarMultiplesTerminos(terminos: string[]): Promise<Libro[]> {
    const todosLosLibros: Libro[] = [];
    
    for (const termino of terminos.slice(0, 3)) {
      try {
        console.log(`Procesando término: ${termino}`);
        const libros = await this.buscarPorTermino(termino);
        todosLosLibros.push(...libros);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`Error buscando término "${termino}":`, error);
      }
    }
    
    return this.limpiarResultados(todosLosLibros);
  }

  async cerrar() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser cerrado');
    }
  }
}

// Handler principal de la API
export default async function handler(req: NextApiRequest, res: NextApiResponse<ScrapingResponse>) {
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

    if (!accion || !['buscar_general', 'buscar_termino', 'buscar_multiples'].includes(accion)) {
      throw new Error('Acción no válida');
    }

    console.log(`Iniciando scraping para Valdivia - Acción: ${accion}`);
    
    await scraper.initBrowser();

    let resultado: ScrapingResponse;

    switch (accion) {
      case 'buscar_general':
        await scraper.navegarAValdivia('literatura');
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
          throw new Error('Se requiere término de búsqueda');
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
          throw new Error('Se requiere array de términos de búsqueda');
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

      default:
        throw new Error('Acción no reconocida');
    }

    console.log(`Scraping completado. Libros encontrados: ${resultado.total || 0}`);
    
    res.status(200).json(resultado);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en scraping:', error);
    
    res.status(500).json({
      exito: false,
      error: errorMessage,
      biblioteca: 'Valdivia'
    });
  } finally {
    await scraper.cerrar();
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    maxDuration: 120,
  },
};