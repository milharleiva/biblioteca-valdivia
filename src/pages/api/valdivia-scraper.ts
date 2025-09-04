// src/pages/api/valdivia-scraper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { VALDIVIA_CONFIG, buildValdiviaURL, buildCatalogURL } from '@/utils/valdivia-config';
import { extraerISBN, extraerAño } from '@/utils/scraper-helpers';
import type { Libro, ScrapingRequest, ScrapingResponse } from '@/types/biblioteca';

class ValdiviaScraperService {

  async buscarLibrosDirecto(termino: string): Promise<Libro[]> {
    try {
      console.log(`🎯 Buscando libros directamente: "${termino}"`);
      
      // Intentar diferentes endpoints de API que la página podría usar
      const posiblesAPIs = [
        // Posibles endpoints basados en la estructura típica de bibliotecas
        `https://www.bibliotecaspublicas.gob.cl/wp-admin/admin-ajax.php`,
        `https://www.bibliotecaspublicas.gob.cl/api/buscar`,
        `https://www.bibliotecaspublicas.gob.cl/ajax/search`,
        `https://api.bibliotecas.cl/search`,
        `https://www.bibliotecaspublicas.gob.cl/wp-json/wp/v2/books`
      ];
      
      for (const baseUrl of posiblesAPIs) {
        const libros = await this.intentarAPI(baseUrl, termino);
        if (libros.length > 0) {
          console.log(`✅ Éxito con API: ${baseUrl}`);
          return libros;
        }
      }
      
      // Si las APIs no funcionan, usar método de parsing directo del HTML
      console.log('🔄 APIs no funcionaron, intentando parsing directo...');
      return await this.parsearHTMLDirecto(termino);
      
    } catch (error) {
      console.error('Error en búsqueda directa:', error);
      throw error;
    }
  }
  
  async intentarAPI(baseUrl: string, termino: string): Promise<Libro[]> {
    try {
      const libros: Libro[] = [];
      
      // Diferentes formatos de parámetros que podría usar la API
      const parametros = [
        {
          action: 'search_books',
          query: termino,
          region_id: VALDIVIA_CONFIG.regionId,
          commune_id: VALDIVIA_CONFIG.communeId
        },
        {
          q: termino,
          region: VALDIVIA_CONFIG.regionId,
          comuna: VALDIVIA_CONFIG.communeId,
          format: 'json'
        },
        {
          search: termino,
          location: 'valdivia',
          type: 'books'
        }
      ];
      
      for (const params of parametros) {
        try {
          // Intentar POST
          const responsePost = await fetch(baseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json, text/html, */*',
              'Referer': 'https://www.bibliotecaspublicas.gob.cl/'
            },
            body: new URLSearchParams(Object.fromEntries(
              Object.entries(params).map(([key, value]) => [key, String(value)])
            )).toString()
          });
          
          if (responsePost.ok) {
            const datos = await responsePost.json();
            const librosDeAPI = this.procesarRespuestaAPI(datos);
            if (librosDeAPI.length > 0) {
              libros.push(...librosDeAPI);
              console.log(`📚 POST exitoso: ${librosDeAPI.length} libros de ${baseUrl}`);
            }
          }
          
          // Intentar GET
          const queryString = new URLSearchParams(Object.fromEntries(
            Object.entries(params).map(([key, value]) => [key, String(value)])
          )).toString();
          const responseGet = await fetch(`${baseUrl}?${queryString}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json, text/html, */*',
              'Referer': 'https://www.bibliotecaspublicas.gob.cl/'
            }
          });
          
          if (responseGet.ok) {
            const datos = await responseGet.json();
            const librosDeAPI = this.procesarRespuestaAPI(datos);
            if (librosDeAPI.length > 0) {
              libros.push(...librosDeAPI);
              console.log(`📚 GET exitoso: ${librosDeAPI.length} libros de ${baseUrl}`);
            }
          }
          
        } catch (apiError) {
          // Continuar con el siguiente conjunto de parámetros
          continue;
        }
      }
      
      return libros;
      
    } catch (error) {
      console.log(`❌ Error con API ${baseUrl}:`, error);
      return [];
    }
  }
  
  private procesarRespuestaAPI(datos: any): Libro[] {
    const libros: Libro[] = [];
    
    try {
      let items = datos;
      
      // Buscar en diferentes estructuras de respuesta
      if (datos.results) items = datos.results;
      if (datos.data) items = datos.data;
      if (datos.books) items = datos.books;
      if (datos.libros) items = datos.libros;
      if (datos.items) items = datos.items;
      
      if (Array.isArray(items)) {
        for (const item of items) {
          if (this.esLibroValido(item)) {
            const libro = this.crearLibroDesdeAPI(item);
            if (libro) {
              libros.push(libro);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error procesando respuesta API:', error);
    }
    
    return libros;
  }
  
  private esLibroValido(item: any): boolean {
    return item && 
           typeof item === 'object' && 
           (item.title || item.titulo || item.name) &&
           (item.title || item.titulo || item.name).length > 2;
  }
  
  private crearLibroDesdeAPI(item: any): Libro | null {
    try {
      const titulo = item.title || item.titulo || item.name || '';
      const autor = item.author || item.autor || item.writer || '';
      const docNumber = item.doc_number || item.document_id || item.id || '';
      
      return {
        titulo: titulo.trim(),
        autor: autor.trim() || 'Autor no especificado',
        isbn: item.isbn || '',
        editorial: item.publisher || item.editorial || '',
        año: item.year || item.año || item.date || '',
        disponibilidad: item.availability || 'Disponible en biblioteca',
        urlDisponibilidad: docNumber ? buildCatalogURL(docNumber.toString().padStart(9, '0')) : '',
        biblioteca: 'Biblioteca Pública de Valdivia',
        docNumber: docNumber ? docNumber.toString().padStart(9, '0') : '',
        subLibrary: 'D207'
      };
    } catch (error) {
      console.error('Error creando libro desde API:', error);
      return null;
    }
  }
  
  async parsearHTMLDirecto(termino: string): Promise<Libro[]> {
    try {
      console.log(`🌐 Parseando HTML directamente para: "${termino}"`);
      
      const url = buildValdiviaURL(termino);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log(`📄 HTML recibido: ${html.length} caracteres`);
      
      return this.extraerLibrosDeHTML(html);
      
    } catch (error) {
      console.error('Error parseando HTML directo:', error);
      throw error;
    }
  }
  
  private extraerLibrosDeHTML(html: string): Libro[] {
    const libros: Libro[] = [];
    
    try {
      // Buscar patrones específicos en el HTML
      const patronLibro = /([^\.]+?)\s*Autor:\s*([^\.]+?)\s*(?:El ejemplar se encuentra|ISBN|Editorial)/gi;
      
      let match;
      let contador = 0;
      
      while ((match = patronLibro.exec(html)) !== null && contador < 50) {
        const titulo = this.limpiarTexto(match[1]);
        const autor = this.limpiarTexto(match[2]);
        
        if (this.esTituloValido(titulo)) {
          contador++;
          
          // Buscar números de documento cerca de este match
          const contexto = html.substring(Math.max(0, match.index - 500), match.index + 500);
          const docNumber = this.buscarDocNumberEnContexto(contexto);
          
          const libro: Libro = {
            titulo,
            autor: autor || 'Autor no especificado',
            isbn: '',
            editorial: '',
            año: '',
            disponibilidad: 'Disponible en biblioteca',
            urlDisponibilidad: docNumber ? buildCatalogURL(docNumber) : '',
            biblioteca: 'Biblioteca Pública de Valdivia',
            docNumber: docNumber || '',
            subLibrary: 'D207'
          };
          
          libros.push(libro);
          console.log(`📖 Libro extraído: ${titulo} ${docNumber ? `-> ${docNumber}` : '(sin enlace)'}`);
        }
      }
      
      // Si no encontramos libros con el patrón, intentar otros métodos
      if (libros.length === 0) {
        console.log('🔍 Intentando patrones alternativos...');
        return this.extraerConPatronesAlternativos(html);
      }
      
    } catch (error) {
      console.error('Error extrayendo libros de HTML:', error);
    }
    
    return libros;
  }
  
  private buscarDocNumberEnContexto(contexto: string): string {
    // Buscar diferentes patrones de números de documento
    const patrones = [
      /Doc:\s*(\d{9})/i,
      /doc_number[=:](\d{6,9})/i,
      /\b(000\d{6})\b/,
      /\b(\d{9})\b/,
      /catalog[^"]*?(\d{8,9})/i,
      /#\s*Doc:\s*(\d{9})/i
    ];
    
    for (const patron of patrones) {
      const match = contexto.match(patron);
      if (match) {
        console.log(`🔢 Número encontrado con patrón ${patron.source}: ${match[1]}`);
        return match[1].padStart(9, '0');
      }
    }
    
    return '';
  }
  
  private extraerConPatronesAlternativos(html: string): Libro[] {
    const libros: Libro[] = [];
    
    // Buscar enlaces directos al catálogo
    const patronEnlaces = /href="[^"]*bncatalogo\.cl[^"]*doc_number=(\d+)[^"]*"[^>]*>([^<]+)/gi;
    
    let match;
    while ((match = patronEnlaces.exec(html)) !== null) {
      const docNumber = match[1].padStart(9, '0');
      const textoEnlace = this.limpiarTexto(match[2]);
      
      if (textoEnlace && textoEnlace.length > 3) {
        libros.push({
          titulo: textoEnlace,
          autor: 'Autor no especificado',
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
    
    return libros;
  }
  
  private limpiarTexto(texto: string): string {
    return texto
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim()
      .replace(/^[^\w\s]+|[^\w\s]+$/g, '');
  }
  
  private esTituloValido(titulo: string): boolean {
    if (!titulo || titulo.length < 3 || titulo.length > 200) {
      return false;
    }
    
    const exclusiones = ['menú', 'navegación', 'buscar', 'contacto', 'header', 'footer'];
    const tituloLower = titulo.toLowerCase();
    
    return !exclusiones.some(ex => tituloLower.includes(ex));
  }

  async buscarPorTermino(termino: string): Promise<Libro[]> {
    return await this.buscarLibrosDirecto(termino);
  }

  async buscarMultiplesTerminos(terminos: string[]): Promise<Libro[]> {
    const todosLosLibros: Libro[] = [];
    
    for (const termino of terminos.slice(0, 3)) {
      try {
        console.log(`Procesando término: ${termino}`);
        const libros = await this.buscarPorTermino(termino);
        todosLosLibros.push(...libros);
        
        // Pausa entre búsquedas
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error buscando término "${termino}":`, error);
      }
    }
    
    return this.eliminarDuplicados(todosLosLibros);
  }
  
  private eliminarDuplicados(libros: Libro[]): Libro[] {
    const librosUnicos = new Map<string, Libro>();
    
    for (const libro of libros) {
      const clave = libro.titulo.toLowerCase().trim();
      if (!librosUnicos.has(clave)) {
        librosUnicos.set(clave, libro);
      }
    }
    
    return Array.from(librosUnicos.values());
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

    console.log(`🚀 Iniciando búsqueda directa - Acción: ${accion}`);

    let resultado: ScrapingResponse;

    switch (accion) {
      case 'buscar_general':
        const librosGenerales = await scraper.buscarPorTermino('literatura');
        
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

    console.log(`✅ Búsqueda completada. Libros encontrados: ${resultado.total || 0}`);
    
    res.status(200).json(resultado);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error en búsqueda:', error);
    
    res.status(500).json({
      exito: false,
      error: errorMessage,
      biblioteca: 'Valdivia'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    maxDuration: 60,
  },
};