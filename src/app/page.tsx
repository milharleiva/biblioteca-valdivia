import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Biblioteca Municipal de Valdivia
                </h1>
                <p className="text-xl md:text-2xl text-green-100 mb-8">
                  Un espacio de cultura, conocimiento y comunidad en el corazón de Los Ríos
                </p>
                <p className="text-lg text-green-100 mb-8">
                  Desde 1925 sirviendo a la comunidad valdiviana, promoviendo la lectura, la educación y el acceso libre al conocimiento para todos.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/buscar-libros" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Buscar Libros</span>
                  </a>
                  <a href="#servicios" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors">
                    Ver Servicios
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold">15,000+</div>
                      <div className="text-green-200">Libros disponibles</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">2,500+</div>
                      <div className="text-green-200">Usuarios activos</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">98</div>
                      <div className="text-green-200">Años de historia</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">365</div>
                      <div className="text-green-200">Días al año</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ofrecemos una amplia gama de servicios para satisfacer las necesidades de nuestra comunidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Préstamo de Libros</h3>
                <p className="text-gray-600 mb-4">
                  Acceso gratuito a más de 15,000 títulos con sistema de reservas en línea y renovaciones automáticas.
                </p>
                <a href="/buscar-libros" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Buscar en catálogo →
                </a>
              </div>

              <div className="bg-green-50 p-8 rounded-xl text-center hover:bg-green-100 transition-colors">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Salas de Estudio</h3>
                <p className="text-gray-600 mb-4">
                  Espacios silenciosos y cómodos para estudio individual y grupal, con WiFi gratuito y recursos digitales.
                </p>
                <a href="#" className="text-green-600 font-medium hover:text-green-800 transition-colors">
                  Reservar sala →
                </a>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl text-center hover:bg-purple-100 transition-colors">
                <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Talleres Culturales</h3>
                <p className="text-gray-600 mb-4">
                  Actividades para todas las edades: club de lectura, talleres de escritura, cuentacuentos infantiles.
                </p>
                <a href="#" className="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                  Ver actividades →
                </a>
              </div>

              <div className="bg-yellow-50 p-8 rounded-xl text-center hover:bg-yellow-100 transition-colors">
                <div className="bg-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Consulta y Referencia</h3>
                <p className="text-gray-600 mb-4">
                  Asesoría especializada para investigaciones, trabajos académicos y consultas bibliográficas.
                </p>
                <a href="#" className="text-yellow-600 font-medium hover:text-yellow-800 transition-colors">
                  Solicitar ayuda →
                </a>
              </div>

              <div className="bg-red-50 p-8 rounded-xl text-center hover:bg-red-100 transition-colors">
                <div className="bg-red-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Archivo Histórico</h3>
                <p className="text-gray-600 mb-4">
                  Conservación y acceso a documentos históricos, fotografías y memoria local de Valdivia.
                </p>
                <a href="#" className="text-red-600 font-medium hover:text-red-800 transition-colors">
                  Explorar archivo →
                </a>
              </div>

              <div className="bg-indigo-50 p-8 rounded-xl text-center hover:bg-indigo-100 transition-colors">
                <div className="bg-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recursos Digitales</h3>
                <p className="text-gray-600 mb-4">
                  Acceso a bases de datos, revistas digitales, e-books y plataformas de aprendizaje en línea.
                </p>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Acceder en línea →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Nuestra Historia
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Fundada en 1925, la Biblioteca Municipal de Valdivia ha sido un pilar fundamental en la promoción de la cultura y educación en nuestra ciudad. Durante casi un siglo, hemos evolucionado para adaptarnos a las necesidades cambiantes de nuestra comunidad.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Ubicada en el corazón histórico de Valdivia, nuestra biblioteca no solo conserva el patrimonio literario de la región, sino que también se proyecta hacia el futuro con tecnologías modernas y servicios innovadores.
                </p>
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">98</div>
                    <div className="text-sm text-gray-500">Años de servicio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">15K+</div>
                    <div className="text-sm text-gray-500">Libros en colección</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2.5K+</div>
                    <div className="text-sm text-gray-500">Usuarios registrados</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Horarios de Atención</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lunes a Viernes</span>
                    <span className="font-semibold text-gray-800">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sábados</span>
                    <span className="font-semibold text-gray-800">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Domingos</span>
                    <span className="font-semibold text-red-600">Cerrado</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Información de Contacto</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">Av. Picarte 1785, Valdivia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">(63) 221-1234</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">biblioteca@valdivia.cl</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Listo para explorar nuestro catálogo?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Descubre miles de libros, reserva salas de estudio y participa en nuestras actividades culturales.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/buscar-libros" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar Libros</span>
              </a>
              <a href="#" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Hacerse Socio
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}