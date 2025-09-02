// src/types/biblioteca.ts
export interface Libro {
  titulo: string;
  autor: string;
  isbn: string;
  editorial: string;
  año: string;
  disponibilidad: string;
  urlDisponibilidad: string;
  biblioteca?: string; // Biblioteca específica en Valdivia
  htmlOriginal?: string;
}

export interface ScrapingRequest {
  accion: 'buscar_general' | 'buscar_termino' | 'buscar_multiples' | 'debug';
  terminoBusqueda?: string;
  terminos?: string[];
}

export interface ScrapingResponse {
  exito: boolean;
  libros?: Libro[];
  total?: number;
  termino?: string;
  terminos?: string[];
  biblioteca: string; // Siempre será "Valdivia"
  error?: string;
  debug?: any;
}

// Interfaz específica para bibliotecas de Valdivia
export interface BibliotecaValdivia {
  nombre: string;
  direccion: string;
  telefono?: string;
  horarios?: string;
}