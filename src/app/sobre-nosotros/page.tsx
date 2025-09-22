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
                Un siglo preservando la cultura y el conocimiento de Los Ríos
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
                    La Biblioteca Municipal de Valdivia ha sido durante décadas un pilar
                    fundamental en la promoción de la cultura, educación y el acceso
                    libre al conocimiento en la Región de Los Ríos.
                  </p>
                  <p>
                    Ubicada en el corazón de Valdivia, en <strong>Av. Ramón Picarte 2102</strong>,
                    nuestra biblioteca no solo conserva el patrimonio cultural regional, sino que
                    también se proyecta hacia el futuro con servicios innovadores y actividades
                    culturales que enriquecen nuestra comunidad.
                  </p>
                  <p>
                    Durante años, hemos sido testigos y protagonistas de la evolución cultural
                    de Valdivia, adaptándonos constantemente a las necesidades de nuestra comunidad
                    y manteniéndonos como un espacio de encuentro, aprendizaje y crecimiento personal.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Datos Destacados</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">Centro</div>
                    <div className="text-sm text-gray-600">Cultural de Valdivia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">Comunidad</div>
                    <div className="text-sm text-gray-600">Conectada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Talleres</div>
                    <div className="text-sm text-gray-600">Culturales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">Acceso</div>
                    <div className="text-sm text-gray-600">Libre y Gratuito</div>
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
                  espacios de encuentro, talleres culturales, y promoviendo el desarrollo
                  intelectual y social de toda la comunidad valdiviana a través de actividades
                  culturales y educativas inclusivas.
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
                  Consolidarnos como el principal centro cultural de la Región de Los Ríos,
                  integrando tradición e innovación, y siendo un espacio inclusivo que inspire
                  la creatividad, el aprendizaje y el desarrollo cultural de las futuras
                  generaciones valdivianas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Nuestros Valores
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Inclusión</h3>
                  <p className="text-gray-600">
                    Creemos en un espacio abierto para todas las personas, sin distinción de edad,
                    origen o condición social.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Conocimiento</h3>
                  <p className="text-gray-600">
                    Promovemos el acceso libre al conocimiento y la información como derecho
                    fundamental de toda persona.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Comunidad</h3>
                  <p className="text-gray-600">
                    Fortalecemos los lazos comunitarios a través de la cultura, el arte y
                    las actividades colaborativas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ubicación Actualizada */}
        <section className="py-16 bg-gray-50">
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
                        <p className="text-gray-600">Av. Ramón Picarte 2102, 5100402 Valdivia, Los Ríos</p>
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
                          <p>Teléfono: (63) 221 7351</p>
                          <p>Email: biblioteca@valdivia.cl</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.6789!2d-73.2333!3d-39.8102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9615eee7be0c75a7%3A0x5b4e89d635c3b3b3!2sAv.%20Ram%C3%B3n%20Picarte%202102%2C%20Valdivia%2C%20Los%20R%C3%ADos%2C%20Chile!5e0!3m2!1ses!2scl!4v1694798765432!5m2!1ses!2scl"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Biblioteca Municipal Valdivia"
                  ></iframe>
                  <p className="text-center text-gray-500 text-sm p-4">
                    Fácil acceso en transporte público y estacionamiento disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Nuestro Compromiso
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
                Contamos con un equipo dedicado de profesionales comprometidos con el desarrollo
                cultural de Valdivia. Trabajamos día a día para ofrecer servicios de calidad y
                crear experiencias enriquecedoras para toda nuestra comunidad.
              </p>

              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Te invitamos a ser parte de nuestra comunidad
                </h3>
                <p className="text-gray-600 mb-6">
                  Descubre todo lo que tenemos para ofrecerte: talleres, eventos, espacios de estudio
                  y mucho más. ¡Tu participación enriquece nuestra biblioteca!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/workshops" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Ver Talleres
                  </a>
                  <a href="/contacto" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Contáctanos
                  </a>
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