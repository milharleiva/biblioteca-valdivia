import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Horarios() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Horarios de Atención
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8">
                Estamos aquí para servirte en los horarios que más te convengan
              </p>
            </div>
          </div>
        </section>

        {/* Horarios Principales */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Horarios Generales
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Horarios Regulares */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Horarios Regulares
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Lunes a Viernes</span>
                      <span className="text-blue-600 font-bold text-lg">9:00 - 18:00</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Sábados</span>
                      <span className="text-green-600 font-bold text-lg">9:00 - 14:00</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Domingos</span>
                      <span className="text-red-600 font-bold text-lg">Cerrado</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Nota:</strong> Los horarios pueden variar durante festividades nacionales
                      y períodos de vacaciones. Consulta nuestras redes sociales para actualizaciones.
                    </p>
                  </div>
                </div>

                {/* Horarios Especiales */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Horarios de Verano
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Enero - Febrero
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Lunes a Viernes</span>
                      <span className="text-purple-600 font-bold text-lg">9:00 - 17:00</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Sábados</span>
                      <span className="text-purple-600 font-bold text-lg">9:00 - 13:00</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="font-medium text-gray-800">Domingos</span>
                      <span className="text-red-600 font-bold text-lg">Cerrado</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                    <p className="text-purple-800 text-sm">
                      <strong>Período especial:</strong> Durante enero y febrero aplicamos
                      horarios reducidos debido al período estival.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Horarios por Servicio */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Horarios por Servicio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Préstamo de Libros */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Préstamo de Libros
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lun - Vie:</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span className="font-medium">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span className="text-red-600">Cerrado</span>
                  </div>
                </div>
              </div>

              {/* Salas de Estudio */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Salas de Estudio
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lun - Vie:</span>
                    <span className="font-medium">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span className="font-medium">8:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span className="text-red-600">Cerrado</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Reservas hasta 3 horas por día
                </p>
              </div>

              {/* Consulta y Referencia */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Consulta y Referencia
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lun - Vie:</span>
                    <span className="font-medium">9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span className="font-medium">9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span className="text-red-600">Cerrado</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Atención especializada con bibliotecario
                </p>
              </div>

              {/* Archivo Histórico */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Archivo Histórico
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mar - Jue:</span>
                    <span className="font-medium">14:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Otros días:</span>
                    <span className="text-red-600">Cerrado</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Solo con cita previa
                </p>
              </div>

              {/* Talleres Culturales */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Talleres Culturales
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Club Lectura:</span>
                    <span className="font-medium">Jue 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuentacuentos:</span>
                    <span className="font-medium">Sáb 11:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Otros talleres:</span>
                    <span className="font-medium">Variable</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Ver programación mensual
                </p>
              </div>

              {/* Biblioteca Itinerante */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  Biblioteca Itinerante
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Recorridos:</span>
                    <span className="font-medium">Mar - Jue</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horario:</span>
                    <span className="font-medium">9:00 - 16:00</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Consultar cronograma mensual
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Días Feriados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Días Feriados y Fechas Especiales
              </h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Fechas de Cierre 2024
                </h3>
                <p className="text-red-700 mb-4">
                  La biblioteca permanecerá cerrada en las siguientes fechas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Año Nuevo</span>
                      <span className="font-medium">1 de Enero</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Viernes Santo</span>
                      <span className="font-medium">29 de Marzo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Día del Trabajador</span>
                      <span className="font-medium">1 de Mayo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Glorias Navales</span>
                      <span className="font-medium">21 de Mayo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>San Pedro y San Pablo</span>
                      <span className="font-medium">29 de Junio</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Asunción de la Virgen</span>
                      <span className="font-medium">15 de Agosto</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Independencia Nacional</span>
                      <span className="font-medium">18 de Septiembre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Glorias del Ejército</span>
                      <span className="font-medium">19 de Septiembre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Día de la Raza</span>
                      <span className="font-medium">12 de Octubre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Día de Todos los Santos</span>
                      <span className="font-medium">1 de Noviembre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inmaculada Concepción</span>
                      <span className="font-medium">8 de Diciembre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Navidad</span>
                      <span className="font-medium">25 de Diciembre</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Horarios Especiales
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>31 de Diciembre:</strong> Abierto de 9:00 a 13:00
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Semana Santa:</strong> Horario reducido (consultar)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Fiestas Patrias:</strong> Cerrado del 18 al 20 de Septiembre
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Información de Contacto */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                ¿Necesitas más información?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Contáctanos para confirmar horarios especiales o coordinar servicios específicos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800 mb-2">Teléfono</h3>
                  <p className="text-gray-600">(63) 221-1234</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">info@bibliotecaslosrios.cl</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}