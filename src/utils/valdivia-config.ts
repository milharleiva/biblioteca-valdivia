// src/utils/valdivia-config.ts

// Configuración específica para Valdivia (CORREGIDA)
export const VALDIVIA_CONFIG = {
  regionId: 14,        // Región de Los Ríos
  communeId: 310,      // Comuna de Valdivia (CORREGIDO de 320 a 310)
  regionName: 'Región de Los Ríos',
  communeName: 'Valdivia'
};

// URL base del sistema de bibliotecas
export const BASE_URL = 'https://www.bibliotecaspublicas.gob.cl/buscador-libros-transversal';

// Construir URL específica para Valdivia (MÉTODO CORREGIDO)
export const buildValdiviaURL = (query: string = '') => {
  const params = new URLSearchParams();
  params.set('region_id', VALDIVIA_CONFIG.regionId.toString());
  params.set('commune_id[]', VALDIVIA_CONFIG.communeId.toString()); // Formato correcto con corchetes
  params.set('geolocation_center[coordinates][lat]', '');
  params.set('geolocation_center[coordinates][lng]', '');
  
  if (query.trim()) {
    params.set('query', query.trim());
  } else {
    params.set('query', ''); // Query vacía para búsqueda general
  }
  
  const url = `${BASE_URL}?${params.toString()}`;
  console.log('URL construida para Valdivia:', url); // Debug
  return url;
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