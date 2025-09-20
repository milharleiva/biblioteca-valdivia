'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (63) 221-1234
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@bibliotecaslosrios.cl
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lun-Vie 9:00-18:00, Sáb 9:00-14:00
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-600 font-medium">Portal Ciudadano</span>
            <span>|</span>
            <span className="text-blue-600 font-medium">Gobierno Regional</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sistema de Bibliotecas Públicas
              </h1>
              <p className="text-blue-600 font-medium">Región de Los Ríos</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Gobierno de Chile</p>
              <p className="text-sm font-medium text-gray-800">Servicio Nacional del Patrimonio Cultural</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CHILE</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="flex space-x-8 py-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Inicio
            </Link>
            <a href="/buscar-libros" className="text-gray-600 hover:text-blue-600 transition-colors pb-1 hover:bg-blue-50 px-3 py-1 rounded">
              Buscador de Libros
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Catálogo General
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Servicios
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Reservas
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Mi Cuenta
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors pb-1">
              Contacto
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}