'use client';

import { Book } from '@/app/page';

interface BookListProps {
  books: Book[];
  loading: boolean;
}

export function BookList({ books, loading }: BookListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Buscando libros...</span>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Realiza tu primera búsqueda
        </h3>
        <p className="text-gray-500">
          Ingresa el título de un libro o el nombre de un autor para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Resultados de búsqueda ({books.length} libro{books.length !== 1 ? 's' : ''})
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Libros disponibles en bibliotecas de Los Ríos, Valdivia
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {books.map((book, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex space-x-4">
              {/* Imagen del libro */}
              <div className="flex-shrink-0">
                {book.thumbnail ? (
                  <img 
                    src={book.thumbnail} 
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-16 h-20 bg-blue-100 rounded-lg flex items-center justify-center ${book.thumbnail ? 'hidden' : ''}`}>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              
              {/* Información del libro */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {book.title}
                </h3>
                
                <div className="space-y-1 mb-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Autor:</span> {book.author}
                  </p>
                  
                  {book.publisher && (
                    <p className="text-gray-600">
                      <span className="font-medium">Editorial:</span> {book.publisher}
                    </p>
                  )}
                  
                  {book.library && (
                    <p className="text-gray-600">
                      <span className="font-medium">Biblioteca:</span> {book.library}
                    </p>
                  )}
                  
                  <div className="flex space-x-4 text-sm text-gray-500">
                    {book.year && (
                      <span>Año: {book.year}</span>
                    )}
                    {book.isbn && (
                      <span>ISBN: {book.isbn}</span>
                    )}
                  </div>
                </div>
                
                {/* Estado de disponibilidad */}
                {book.availability && (
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      book.availability.includes('Disponible') 
                        ? 'bg-green-100 text-green-800' 
                        : book.availability.includes('Prestado')
                        ? 'bg-yellow-100 text-yellow-800'
                        : book.availability.includes('Reservado')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        book.availability.includes('Disponible') 
                          ? 'bg-green-500' 
                          : book.availability.includes('Prestado')
                          ? 'bg-yellow-500'
                          : book.availability.includes('Reservado')
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}></div>
                      {book.availability}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Botones de acción */}
              <div className="flex-shrink-0 flex flex-col space-y-2">
                {book.detailUrl && book.detailUrl.trim() !== '' ? (
                  <a
                    href={book.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors text-center flex items-center justify-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Ver en catálogo</span>
                  </a>
                ) : (
                  <button
                    className="bg-gray-400 text-white text-sm px-4 py-2 rounded-lg cursor-not-allowed"
                    disabled
                    title="Enlace al catálogo no disponible para este libro"
                  >
                    Catálogo no disponible
                  </button>
                )}
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Consultar en biblioteca</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 px-6 py-3 text-center">
        <p className="text-sm text-gray-500">
          Datos obtenidos • Los Ríos, Valdivia
        </p>
      </div>
    </div>
  );
}