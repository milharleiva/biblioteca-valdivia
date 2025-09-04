// src/utils/valdivia-config.ts

// Configuración específica para Valdivia
export const VALDIVIA_CONFIG = {
  regionId: 14,        // Región de Los Ríos
  communeId: 310,      // Comuna de Valdivia (corregido de 320 a 310)
  regionName: 'Región de Los Ríos',
  communeName: 'Valdivia'
};

// URLs del sistema de bibliotecas
export const BASE_URL = 'https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal';
export const CATALOG_BASE_URL = 'http://www.bncatalogo.cl/F?func=item-global&doc_library=SBP01&doc_number=';

// Construir URL específica para Valdivia
export const buildValdiviaURL = (query: string = '') => {
  const params = new URLSearchParams({
    region_id: VALDIVIA_CONFIG.regionId.toString(),
    'commune_id[]': VALDIVIA_CONFIG.communeId.toString(),
    'geolocation_center[coordinates][lat]': '',
    'geolocation_center[coordinates][lng]': '',
    query: query
  });
  
  return `${BASE_URL}?${params.toString()}`;
};

// Construir URL de disponibilidad en catálogo
export const buildCatalogURL = (docNumber: string, subLibrary: string = 'D207') => {
  return `${CATALOG_BASE_URL}${docNumber}&sub_library=${subLibrary}`;
};

// Términos de búsqueda predefinidos para Valdivia
export const TERMINOS_POPULARES = [
  'novela',
  'historia de Chile',
  'literatura chilena',
  'ciencia ficción',
  'biografía',
  'poesía',
  'ensayo',
  'cultura valdiviana',
  'Gabriel García Márquez',
  'Pablo Neruda',
  'Isabel Allende'
];

// Selectores específicos para el sistema de bibliotecas
export const SELECTORS = {
  resultContainer: '.resultado-libro, .libro-resultado, .item-libro, .card-libro',
  titulo: '.titulo-libro, .title, h3, h4, .book-title',
  autor: '.autor-libro, .author, .autor',
  disponibilidad: '.disponibilidad, .availability, .estado',
  enlace: 'a[href*="bncatalogo"], .ver-disponibilidad, .link-catalogo',
  docNumber: '[data-doc-number], .doc-number',
  biblioteca: '.biblioteca, .library-name'
};