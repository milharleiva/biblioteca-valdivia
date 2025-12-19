import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function Servicios() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nuestros Servicios
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">
                Una amplia gama de servicios para toda la comunidad valdiviana
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Principales */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Préstamo Bibliográfico */}
              <div className="bg-blue-50 p-8 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Préstamo Bibliográfico</h3>
                <p className="text-gray-600 mb-6">
                  Servicios de préstamo de libros en sala y domicilio.
                  Contamos con más de 14,500 libros en nuestra colección.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Colección:</strong> 14,500+ libros</p>
                  <p><strong>Modalidad:</strong> En sala y domicilio</p>
                  <p><strong>Registro:</strong> Solo necesitas cédula de identidad</p>
                </div>
              </div>

              {/* Capacitación en Computación */}
              <div className="bg-green-50 p-8 rounded-xl text-center hover:bg-green-100 transition-colors">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Capacitación en Computación</h3>
                <p className="text-gray-600 mb-6">
                  Programa BiblioRedes que permite capacitar a la comunidad
                  en el uso de computadores y herramientas digitales.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Programa:</strong> BiblioRedes</p>
                  <p><strong>WiFi:</strong> Acceso gratuito</p>
                  <p><strong>Dirigido a:</strong> Toda la comunidad</p>
                </div>
              </div>

              {/* Actividades Culturales */}
              <div className="bg-purple-50 p-8 rounded-xl text-center hover:bg-purple-100 transition-colors">
                <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0h-2M5 4h2m0 0V3a1 1 0 011-1h8a1 1 0 011 1v1M5 8h14l-1 8a2 2 0 01-2 2H8a2 2 0 01-2-2L5 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Actividades Culturales</h3>
                <p className="text-gray-600 mb-6">
                  Programación regular de actividades culturales y educativas
                  para todas las edades.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>La Hora del Cuento:</strong> En colegios y biblioteca</p>
                  <p><strong>Cine Video:</strong> Proyecciones culturales</p>
                  <p><strong>Eventos:</strong> Ferias de libros y presentaciones</p>
                </div>
                <Link href="/workshops" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Ver Actividades
                </Link>
              </div>

              {/* Sala Museográfica */}
              <div className="bg-yellow-50 p-8 rounded-xl text-center hover:bg-yellow-100 transition-colors">
                <div className="bg-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sala Museográfica "Mira Valdivia"</h3>
                <p className="text-gray-600 mb-6">
                  Desde 2007, exhibe la historia y cultura local de Valdivia
                  en el altillo de la casona histórica.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Inaugurada:</strong> 2007</p>
                  <p><strong>Temática:</strong> Historia local valdiviana</p>
                  <p><strong>Visitas:</strong> Guiadas disponibles</p>
                </div>
              </div>

              {/* Literatura Inglesa */}
              <div className="bg-indigo-50 p-8 rounded-xl text-center hover:bg-indigo-100 transition-colors">
                <div className="bg-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Rincón de Literatura Inglesa</h3>
                <p className="text-gray-600 mb-6">
                  Sección especializada con colección de literatura
                  en idioma inglés para estudiantes y lectores.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Idioma:</strong> Inglés</p>
                  <p><strong>Contenido:</strong> Literatura clásica y contemporánea</p>
                  <p><strong>Público:</strong> Estudiantes y lectores en inglés</p>
                </div>
              </div>

              {/* Lectura Digital */}
              <div className="bg-orange-50 p-8 rounded-xl text-center hover:bg-orange-100 transition-colors">
                <div className="bg-orange-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Lectura en Tablet</h3>
                <p className="text-gray-600 mb-6">
                  Servicio de lectura digital para personas que prefieren
                  la tecnología moderna para acceder a libros.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Dispositivos:</strong> Tablets disponibles</p>
                  <p><strong>Contenido:</strong> Libros digitales</p>
                  <p><strong>Público:</strong> Amantes de la tecnología</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Especiales */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Servicios Especiales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    TeleBiblioteca
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Servicio de entrega a domicilio para adultos mayores y personas con problemas de movilidad.
                  Eliminando barreras y llevando la lectura directamente a tu hogar.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Entrega gratuita a domicilio
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Servicio para adultos mayores
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Apoyo a personas con movilidad reducida
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Contacto:</strong> +56 9 35732611 (WhatsApp)<br/>
                    <strong>Email:</strong> telebibliocci@gmail.com<br/>
                    <strong>Web:</strong> www.ccm-valdivia.cl
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Bibliomóvil
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Biblioteca móvil que lleva libros y actividades culturales a escuelas rurales
                  y sectores alejados de Valdivia desde 2003.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Visitas a 13 escuelas rurales
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actividades cada 2 semanas
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cuentacuentos y actividades lúdicas
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Coordinador:</strong> Reinaldo Reinoso<br/>
                    <strong>Email:</strong> bmvaldivia@gmail.com<br/>
                    <strong>Teléfono:</strong> 974035703
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Bebeteca
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Sala especialmente diseñada para niños de 0 a 4 años, inaugurada en agosto 2016.
                  Promueve la lectura temprana y fortalece el vínculo entre padres e hijos.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-pink-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Para niños de 0 a 4 años
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-pink-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actividades programadas regulares
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-pink-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Participación directa de padres y madres
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Inaugurada:</strong> Agosto 2016<br/>
                    <strong>Objetivo:</strong> Fomentar la lectura temprana
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Información de Acceso */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Información de Acceso
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Acceso Libre a Servicios Básicos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Puedes acceder libremente a nuestras instalaciones y servicios básicos:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Consulta de libros y materiales
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Uso de salas de lectura
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      WiFi gratuito
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Participación en eventos públicos
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Para Servicios Completos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Para acceder a todos nuestros servicios, regístrate como usuario:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Inscripción en talleres
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Reserva de salas de estudio
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Acceso completo a computadores
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Servicios personalizados
                    </li>
                  </ul>

                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Registro gratuito:</strong> Solo necesitas tu cédula de identidad.
                    </p>
                    <Link href="/contacto" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Más Información
                    </Link>
                  </div>
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