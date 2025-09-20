import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Biblioteca Municipal de Valdivia
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Casi un siglo preservando la cultura y el conocimiento de Los Ríos
              </p>
            </div>
          </div>
        </section>

        {/* Historia Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Nuestra Historia
                </h2>
                <div className="space-y-6 text-lg text-gray-600">
                  <p>
                    Fundada en <strong>1925</strong>, la Biblioteca Municipal de Valdivia ha sido durante
                    98 años un pilar fundamental en la promoción de la cultura, educación y el acceso
                    libre al conocimiento en la Región de Los Ríos.
                  </p>
                  <p>
                    Ubicada en el corazón histórico de Valdivia, en <strong>Avenida Picarte 1785</strong>,
                    nuestra biblioteca no solo conserva el patrimonio literario regional, sino que
                    también se proyecta hacia el futuro con tecnologías modernas y servicios innovadores.
                  </p>
                  <p>
                    Durante décadas, hemos sido testigos y protagonistas de la evolución cultural
                    de Valdivia, adaptándonos constantemente a las necesidades de nuestra comunidad
                    y manteniéndonos como un espacio de encuentro, aprendizaje y crecimiento personal.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Datos Destacados</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1925</div>
                    <div className="text-sm text-gray-600">Año de fundación</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">98</div>
                    <div className="text-sm text-gray-600">Años de servicio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
                    <div className="text-sm text-gray-600">Libros en colección</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">2.5K+</div>
                    <div className="text-sm text-gray-600">Usuarios activos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Misión</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Ser el centro cultural y educativo de referencia en Valdivia, proporcionando
                  acceso libre y gratuito al conocimiento, promoviendo la lectura, la investigación
                  y el desarrollo intelectual de toda la comunidad valdiviana.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Visión</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Consolidarnos como la biblioteca líder en la Región de Los Ríos,
                  integrando tecnologías modernas con el patrimonio cultural tradicional,
                  y siendo un espacio inclusivo que inspire el amor por el conocimiento
                  en las futuras generaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Nuestra Ubicación
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    En el Corazón de Valdivia
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-800">Dirección</h4>
                        <p className="text-gray-600">Avenida Picarte 1785, Valdivia, Región de Los Ríos</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-800">Horarios de Atención</h4>
                        <div className="text-gray-600">
                          <p>Lunes a Viernes: 9:00 - 18:00</p>
                          <p>Sábados: 9:00 - 14:00</p>
                          <p>Domingos: Cerrado</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-800">Contacto</h4>
                        <div className="text-gray-600">
                          <p>Teléfono: (63) 221-1234</p>
                          <p>Email: info@bibliotecaslosrios.cl</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-xl">
                  <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg font-medium">Mapa Interactivo</p>
                      <p className="text-sm">Av. Picarte 1785, Valdivia</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Fácil acceso en transporte público y estacionamiento disponible
                  </p>
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