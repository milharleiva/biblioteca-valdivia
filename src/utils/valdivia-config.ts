// src/utils/valdivia-config.ts

// Configuración específica para Valdivia
export const VALDIVIA_CONFIG = {
  regionId: 14,        // Región de Los Ríos
  communeId: 320,      // Comuna de Valdivia
  regionName: 'Región de Los Ríos',
  communeName: 'Valdivia'
};

// URL base del sistema de bibliotecas
export const BASE_URL = 'https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal';

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