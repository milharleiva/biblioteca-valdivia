// src/utils/scraper-helpers.ts
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