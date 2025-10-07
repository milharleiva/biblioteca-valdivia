'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookSearch } from '@/components/BookSearch';
import { BookList } from '@/components/BookList';

export interface Book {
  title: string;
  author: string;
  availability?: string;
  publisher?: string;
  year?: string;
  pages?: number;
  thumbnail?: string;
  library?: string;
  detailUrl?: string;
  isbn?: string;
}

export default function BuscarLibros() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const startTime = Date.now();

      // Usar nueva API con caché
      const response = await fetch('/api/books/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Error al buscar libros');
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      // Log para depuración
      console.log('📊 Búsqueda completada:', {
        term: searchTerm,
        source: data.source,
        cacheHit: data.cacheHit,
        books: data.books?.length || 0,
        responseTime: data.cacheHit ? `${responseTime}ms (caché)` : data.responseTime
      });

      setBooks(data.books || []);
    } catch (err) {
      setError('Error al realizar la búsqueda. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Buscador de Libros
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-8">
              Encuentra y consulta libros disponibles en la Biblioteca Municipal de Valdivia
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Catálogo actualizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Búsqueda en tiempo real</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Disponibilidad inmediata</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Busca en nuestro catálogo
                </h2>
                <p className="text-gray-600">
                  Ingresa el título del libro, nombre del autor, o palabras clave para encontrar lo que buscas
                </p>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <BookSearch onSearch={handleSearch} loading={loading} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Quick Access */}
              {books.length === 0 && !loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
                  <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                    <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Novedades</h3>
                    <p className="text-sm text-gray-600">Descubre los últimos libros incorporados a nuestra colección</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                    <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Más Populares</h3>
                    <p className="text-sm text-gray-600">Los libros más solicitados por nuestra comunidad</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                    <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Recomendados</h3>
                    <p className="text-sm text-gray-600">Selección especial de nuestros bibliotecarios</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(books.length > 0 || loading) && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <BookList books={books} loading={loading} />
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}