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
  docNumber?: string; // Número de documento para el catálogo
  subLibrary?: string; // Sub-biblioteca específica
  htmlOriginal?: string;
  
  // Campos adicionales del catálogo detallado
  traductor?: string; // Traductor del libro
  lugarPublicacion?: string; // Ciudad de publicación
  paginas?: string; // Número de páginas
  tamaño?: string; // Tamaño físico (ej: "20 cm")
  clasificacion?: string; // Clasificación bibliotecaria (ej: "823/ROW/ha")
  codigoBarras?: string; // Código de barras
  coleccion?: string; // Colección a la que pertenece
  fechaEntrega?: string; // Fecha de entrega del préstamo
  tipoPresta?: string; // Tipo de préstamo (Domicilio, Sala, etc.)
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