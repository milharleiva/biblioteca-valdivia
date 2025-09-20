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

              {/* Préstamo de Libros */}
              <div className="bg-blue-50 p-8 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Préstamo de Libros</h3>
                <p className="text-gray-600 mb-6">
                  Acceso gratuito a más de 15,000 títulos. Sistema de reservas en línea
                  y renovaciones automáticas disponibles.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Duración:</strong> 15 días renovables</p>
                  <p><strong>Límite:</strong> 3 libros por usuario</p>
                  <p><strong>Renovaciones:</strong> 2 veces máximo</p>
                </div>
                <Link href="/buscar-libros" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Buscar Libros
                </Link>
              </div>

              {/* Salas de Estudio */}
              <div className="bg-green-50 p-8 rounded-xl text-center hover:bg-green-100 transition-colors">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Salas de Estudio</h3>
                <p className="text-gray-600 mb-6">
                  Espacios silenciosos y cómodos para estudio individual y grupal,
                  con WiFi gratuito y recursos digitales.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Capacidades:</strong> Individual y grupal (4-8 personas)</p>
                  <p><strong>Equipamiento:</strong> WiFi, enchufes, iluminación</p>
                  <p><strong>Reserva:</strong> Hasta 3 horas por día</p>
                </div>
              </div>

              {/* Talleres Culturales */}
              <div className="bg-purple-50 p-8 rounded-xl text-center hover:bg-purple-100 transition-colors">
                <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Talleres Culturales</h3>
                <p className="text-gray-600 mb-6">
                  Actividades para todas las edades: club de lectura, talleres de escritura,
                  cuentacuentos infantiles y más.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Club de Lectura:</strong> Jueves 18:00</p>
                  <p><strong>Cuentacuentos:</strong> Sábados 11:00</p>
                  <p><strong>Talleres:</strong> Según programación mensual</p>
                </div>
                <Link href="/actividades" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Ver Actividades
                </Link>
              </div>

              {/* Consulta y Referencia */}
              <div className="bg-yellow-50 p-8 rounded-xl text-center hover:bg-yellow-100 transition-colors">
                <div className="bg-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Consulta y Referencia</h3>
                <p className="text-gray-600 mb-6">
                  Asesoría especializada para investigaciones, trabajos académicos
                  y consultas bibliográficas.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Horario:</strong> Lunes a Viernes 9:00-17:00</p>
                  <p><strong>Servicios:</strong> Búsquedas especializadas</p>
                  <p><strong>Apoyo:</strong> Trabajos académicos y tesis</p>
                </div>
              </div>

              {/* Archivo Histórico */}
              <div className="bg-red-50 p-8 rounded-xl text-center hover:bg-red-100 transition-colors">
                <div className="bg-red-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Archivo Histórico</h3>
                <p className="text-gray-600 mb-6">
                  Conservación y acceso a documentos históricos, fotografías
                  y memoria local de Valdivia y Los Ríos.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Colección:</strong> Documentos desde 1850</p>
                  <p><strong>Fotografías:</strong> Archivo fotográfico regional</p>
                  <p><strong>Acceso:</strong> Con cita previa</p>
                </div>
              </div>

              {/* Recursos Digitales */}
              <div className="bg-indigo-50 p-8 rounded-xl text-center hover:bg-indigo-100 transition-colors">
                <div className="bg-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recursos Digitales</h3>
                <p className="text-gray-600 mb-6">
                  Acceso a bases de datos, revistas digitales, e-books
                  y plataformas de aprendizaje en línea.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>E-books:</strong> Biblioteca digital</p>
                  <p><strong>Bases de datos:</strong> Académicas y científicas</p>
                  <p><strong>Internet:</strong> Acceso gratuito en computadores</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Biblioteca Itinerante
                </h3>
                <p className="text-gray-600 mb-4">
                  Llevamos la biblioteca a sectores rurales y comunidades alejadas de Valdivia,
                  garantizando el acceso universal a la cultura y el conocimiento.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Visitas programadas semanalmente
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Colección móvil de 500+ títulos
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actividades culturales en terreno
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Inclusión y Accesibilidad
                </h3>
                <p className="text-gray-600 mb-4">
                  Servicios especializados para personas con discapacidad visual,
                  auditiva y motora, garantizando el acceso equitativo a todos nuestros recursos.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Libros en braille y macrotipo
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Audiolibros y lectura asistida
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Acceso adaptado y señalética
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo obtener tu carnet */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                ¿Cómo obtener tu carnet de biblioteca?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Documentación</h3>
                  <p className="text-gray-600">
                    Presenta tu cédula de identidad vigente y comprobante de domicilio.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Registro</h3>
                  <p className="text-gray-600">
                    Completa el formulario de inscripción en nuestro mesón de atención.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Listo!</h3>
                  <p className="text-gray-600">
                    Recibe tu carnet al instante y comienza a disfrutar todos nuestros servicios.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl mt-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ¡El carnet es completamente gratuito!
                </h3>
                <p className="text-gray-600">
                  No hay costo de inscripción ni mantención. Solo necesitas renovar tus datos cada 2 años.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}