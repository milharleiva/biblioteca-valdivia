// src/components/ValdiviaSearch.tsx
'use client';

import React, { useState } from 'react';
import { Search, Book, Download, MapPin, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { LibroCard } from './LibroCard';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { descargarCSV } from '@/utils/scraper-helpers';
import { TERMINOS_POPULARES } from '@/utils/valdivia-config';
import type { Libro, ScrapingRequest, ScrapingResponse } from '@/types/biblioteca';

export const ValdiviaSearch: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [tipoAccion, setTipoAccion] = useState<'buscar_general' | 'buscar_termino' | 'buscar_multiples'>('buscar_general');
  const [stats, setStats] = useState<{total: number, ultimaBusqueda: string}>({total: 0, ultimaBusqueda: ''});

  const realizarScraping = async () => {
    if (tipoAccion !== 'buscar_general' && !terminoBusqueda.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const request: ScrapingRequest = {
        accion: tipoAccion,
        terminoBusqueda: terminoBusqueda.trim()
      };

      const response = await fetch('/api/valdivia-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ScrapingResponse = await response.json();
      
      if (!data.exito) {
        throw new Error(data.error || 'Error en la búsqueda');
      }

      setLibros(data.libros || []);
      setStats({
        total: data.total || 0,
        ultimaBusqueda: data.termino || terminoBusqueda || 'Búsqueda general'
      });
      
      if ((data.libros?.length || 0) === 0) {
        setError('No se encontraron libros con los criterios especificados en las bibliotecas de Valdivia');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error: ${errorMessage}`);
      setLibros([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarMultiplesTerminos = async () => {
    const terminos = terminoBusqueda.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    if (terminos.length === 0) {
      setError('Por favor ingresa al menos un término separado por comas');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const request: ScrapingRequest = {
        accion: 'buscar_multiples',
        terminos: terminos.slice(0, 5) // Limitar a 5 términos
      };

      const response = await fetch('/api/valdivia-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ScrapingResponse = await response.json();
      
      if (!data.exito) {
        throw new Error(data.error || 'Error en la búsqueda múltiple');
      }

      setLibros(data.libros || []);
      setStats({
        total: data.total || 0,
        ultimaBusqueda: `Búsqueda múltiple: ${terminos.join(', ')}`
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error: ${errorMessage}`);
      setLibros([]);
    } finally {
      setLoading(false);
    }
  };

  const usarTerminoPopular = (termino: string) => {
    setTerminoBusqueda(termino);
    setTipoAccion('buscar_termino');
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setLibros([]);
    setError('');
    setStats({total: 0, ultimaBusqueda: ''});
    setTipoAccion('buscar_general');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con identidad de Valdivia */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Book className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Buscador de Libros - Valdivia
              </h1>
              <div className="flex items-center gap-2 text-blue-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Región de Los Ríos, Chile</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Busca y encuentra libros disponibles en las bibliotecas públicas de Valdivia. 
            Descubre títulos, autores y verifica su disponibilidad en tiempo real.
          </p>
        </div>

        {/* Panel de controles de búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            
            {/* Tipo de búsqueda */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de búsqueda
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setTipoAccion('buscar_general')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoAccion === 'buscar_general'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Búsqueda General</div>
                  <div className="text-xs text-gray-500">Explorar catálogo completo</div>
                </button>
                
                <button
                  onClick={() => setTipoAccion('buscar_termino')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoAccion === 'buscar_termino'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Búsqueda Específica</div>
                  <div className="text-xs text-gray-500">Por título, autor o tema</div>
                </button>
                
                <button
                  onClick={() => setTipoAccion('buscar_multiples')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoAccion === 'buscar_multiples'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Búsqueda Múltiple</div>
                  <div className="text-xs text-gray-500">Varios términos a la vez</div>
                </button>
              </div>
            </div>

            {/* Campo de búsqueda */}
            {tipoAccion !== 'buscar_general' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Search className="inline h-4 w-4 mr-2" />
                  Término(s) de búsqueda
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder={
                      tipoAccion === 'buscar_multiples' 
                        ? "Ejemplo: novela, García Márquez, historia de Chile"
                        : "Ejemplo: Gabriel García Márquez, Cien años de soledad, novela..."
                    }
                    className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && realizarScraping()}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Términos populares */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Sparkles className="inline h-4 w-4 mr-2" />
                Búsquedas populares
              </label>
              <div className="flex flex-wrap gap-2">
                {TERMINOS_POPULARES.map((termino) => (
                  <button
                    key={termino}
                    onClick={() => usarTerminoPopular(termino)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-full transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    {termino}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={tipoAccion === 'buscar_multiples' ? buscarMultiplesTerminos : realizarScraping}
                loading={loading}
                variant="primary"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Buscando en Valdivia...' : 'Buscar Libros'}
              </Button>

              {(libros.length > 0 || terminoBusqueda) && (
                <Button
                  onClick={limpiarBusqueda}
                  variant="secondary"
                  size="lg"
                >
                  Limpiar
                </Button>
              )}

              {libros.length > 0 && (
                <Button
                  onClick={() => descargarCSV(libros, `valdivia_libros`)}
                  variant="success"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar CSV
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Estados de carga y mensajes */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <LoadingSpinner size="lg" className="text-blue-600" />
              <div>
                <div className="text-blue-800 font-medium">
                  Extrayendo información de las bibliotecas de Valdivia...
                </div>
                <div className="text-blue-600 text-sm mt-1">
                  Esto puede tomar unos segundos mientras procesamos los datos
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <div className="text-red-800 font-medium">Error en la búsqueda</div>
                <div className="text-red-700 text-sm mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas de resultados */}
        {libros.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-green-800 font-medium">
                  Se encontraron {stats.total} libros disponibles en Valdivia
                </div>
                <div className="text-green-700 text-sm mt-1">
                  Búsqueda: {stats.ultimaBusqueda}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados - Grid de libros */}
        {libros.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Libros Encontrados ({libros.length})
              </h2>
              <div className="text-sm text-gray-500">
                📚 Bibliotecas públicas de Valdivia
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {libros.map((libro, index) => (
                <div key={`${libro.titulo}-${index}`} className="fade-in">
                  <LibroCard libro={libro} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío cuando no hay búsqueda */}
        {!loading && !error && libros.length === 0 && !terminoBusqueda && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Book className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Explora el catálogo de Valdivia
            </h3>
            <p className="text-gray-500 mb-6">
              Inicia una búsqueda para descubrir libros disponibles en las bibliotecas públicas
            </p>
            <Button 
              onClick={() => setTipoAccion('buscar_general')} 
              variant="primary"
              size="lg"
            >
              Comenzar Búsqueda General
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};