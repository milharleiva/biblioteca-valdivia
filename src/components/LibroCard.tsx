// src/components/LibroCard.tsx
import { Book, User, Calendar, ExternalLink, MapPin, Hash, Globe, BookOpen, Ruler, BarChart3, Clock } from 'lucide-react';
import type { Libro } from '@/types/biblioteca';

interface LibroCardProps {
  libro: Libro;
}

export const LibroCard: React.FC<LibroCardProps> = ({ libro }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      {/* Header del libro */}
      <div className="flex items-start gap-3 mb-4">
        <Book className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800 leading-tight mb-2 line-clamp-2">
            {libro.titulo || 'Título no disponible'}
          </h3>
          
          {/* Biblioteca específica de Valdivia */}
          {libro.biblioteca && (
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{libro.biblioteca}</span>
            </div>
          )}
          
          {libro.autor && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{libro.autor}</span>
            </div>
          )}

          {/* Traductor */}
          {libro.traductor && (
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Trad: {libro.traductor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Información de publicación */}
      <div className="space-y-2 mb-4">
        {/* Editorial y lugar */}
        {(libro.editorial || libro.lugarPublicacion) && (
          <div className="text-sm text-gray-600">
            <strong>Editorial:</strong> 
            {libro.lugarPublicacion && ` ${libro.lugarPublicacion} : `}
            {libro.editorial}
          </div>
        )}
        
        {/* Año */}
        {libro.año && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{libro.año}</span>
          </div>
        )}

        {/* Páginas y tamaño */}
        {(libro.paginas || libro.tamaño) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>
              {libro.paginas}
              {libro.paginas && libro.tamaño && ' • '}
              {libro.tamaño}
            </span>
          </div>
        )}
        
        {/* ISBN */}
        {libro.isbn && (
          <div className="text-sm text-gray-600">
            <strong>ISBN:</strong> {libro.isbn}
          </div>
        )}

        {/* Clasificación */}
        {libro.clasificacion && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span>Clasificación: {libro.clasificacion}</span>
          </div>
        )}

        {/* Número de documento del catálogo */}
        {libro.docNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="h-4 w-4" />
            <span>Doc: {libro.docNumber}</span>
          </div>
        )}

        {/* Código de barras */}
        {libro.codigoBarras && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="h-4 w-4" />
            <span>Código: {libro.codigoBarras}</span>
          </div>
        )}
      </div>

      {/* Información de disponibilidad y préstamo */}
      <div className="space-y-3 mb-4">
        {/* Estado de disponibilidad */}
        {libro.disponibilidad && (
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              libro.disponibilidad.toLowerCase().includes('disponible') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : libro.disponibilidad.toLowerCase().includes('no disponible')
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              📍 {libro.disponibilidad}
            </div>
          </div>
        )}

        {/* Información de préstamo */}
        {(libro.tipoPresta || libro.fechaEntrega) && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-xs font-medium text-blue-800 mb-1">Información de Préstamo:</div>
            <div className="space-y-1">
              {libro.tipoPresta && (
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <span className="font-medium">Tipo:</span>
                  <span>{libro.tipoPresta}</span>
                </div>
              )}
              {libro.fechaEntrega && (
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">Entrega:</span>
                  <span>{libro.fechaEntrega}</span>
                </div>
              )}
              {libro.coleccion && (
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <span className="font-medium">Colección:</span>
                  <span>{libro.coleccion}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enlaces de disponibilidad */}
      <div className="pt-4 border-t border-gray-200">
        {libro.urlDisponibilidad ? (
          <a
            href={libro.urlDisponibilidad}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver disponibilidad completa en catálogo
          </a>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Enlace de disponibilidad no disponible
          </div>
        )}
      </div>
    </div>
  );
};