// ==========================================
// src/utils/valdivia-config.ts
// ==========================================

// Configuración específica para Valdivia
export const VALDIVIA_CONFIG = {
  regionId: 14,        // Región de Los Ríos
  communeId: 310,      // Comuna de Valdivia
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

// ==========================================
// src/utils/scraper-helpers.ts
// ==========================================

import type { Libro } from '@/types/biblioteca';

export const extraerISBN = (texto: string): string => {
  const isbnPatterns = [
    /ISBN[:\s]*([0-9-]+)/i,
    /(\d{13}|\d{10})/
  ];
  
  for (const pattern of isbnPatterns) {
    const match = texto.match(pattern);
    if (match) return match[1];
  }
  return '';
};

export const extraerAño = (texto: string): string => {
  const añoMatch = texto.match(/(19|20)\d{2}/);
  return añoMatch ? añoMatch[0] : '';
};

export const descargarCSV = (libros: Libro[], filename: string = 'bibliotecas') => {
  if (libros.length === 0) return;

  const headers = ['Título', 'Autor', 'ISBN', 'Editorial', 'Año', 'Disponibilidad'];
  const csvContent = [
    headers.join(','),
    ...libros.map(libro => [
      `"${(libro.titulo || '').replace(/"/g, '""')}"`,
      `"${(libro.autor || '').replace(/"/g, '""')}"`,
      `"${(libro.isbn || '').replace(/"/g, '""')}"`,
      `"${(libro.editorial || '').replace(/"/g, '""')}"`,
      `"${(libro.año || '').replace(/"/g, '""')}"`,
      `"${(libro.disponibilidad || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};