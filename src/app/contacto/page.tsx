import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contáctanos
              </h1>
              <p className="text-xl md:text-2xl text-teal-100 mb-8">
                Estamos aquí para ayudarte y responder todas tus consultas
              </p>
            </div>
          </div>
        </section>

        {/* Información de Contacto */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Información de Contacto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Dirección */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Dirección</h3>
                  <p className="text-gray-600">
                    Avenida Los Robles N°4<br />
                    Isla Teja, Valdivia<br />
                    Los Ríos, Chile
                  </p>
                </div>

                {/* Teléfono */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.3 11.27a11.054 11.054 0 005.43 5.43l1.838-3.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Teléfono</h3>
                  <p className="text-gray-600">
                    63 2217351<br />
                    <span className="text-sm">
                      Lun-Vie: 10:00-18:00
                    </span>
                  </p>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Email</h3>
                  <p className="text-gray-600">
                    bpmvaldivia@gmail.com<br />
                    <span className="text-sm">
                      Respuesta en 24-48 hrs
                    </span>
                  </p>
                </div>

                {/* Horarios */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                  <div className="bg-orange-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Horarios</h3>
                  <p className="text-gray-600">
                    Lun-Vie: 10:00-18:00<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Información Adicional */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Departamentos */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Departamentos Específicos
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800">Dirección</h4>
                      <p className="text-gray-600 text-sm">Victoria Vicencio</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Bibliomóvil</h4>
                      <p className="text-gray-600 text-sm">Iván Reinoso</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">TI</h4>
                      <p className="text-gray-600 text-sm">Camilo Cood Schröder</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Contacto General</h4>
                      <p className="text-gray-600 text-sm">bpmvaldivia@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Ayuda Inmediata */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      ¿Necesitas ayuda inmediata?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Para consultas urgentes sobre talleres, eventos o servicios:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Llamar directamente al 63 2217351
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Visitar la biblioteca en persona
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Consultar nuestras redes sociales
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Síguenos en Redes Sociales
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Mantente al día con nuestras actividades y novedades:
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.342-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Cómo Llegar
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mapa Interactivo */}
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.6789!2d-73.2333!3d-39.8102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9615eee7be0c75a7%3A0x5b4e89d635c3b3b3!2sAv.%20Ram%C3%B3n%20Picarte%202102%2C%20Valdivia%2C%20Los%20R%C3%ADos%2C%20Chile!5e0!3m2!1ses!2scl!4v1694798765432!5m2!1ses!2scl"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Biblioteca Municipal Valdivia"
                ></iframe>
              </div>

              {/* Instrucciones */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🚌 Transporte Público
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Líneas de micro: 1, 7, 12, 20</li>
                    <li>• Parada más cercana: &quot;Picarte con Independencia&quot;</li>
                    <li>• Distancia desde terminal: 1.2 km (15 min caminando)</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🚗 En Automóvil
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Estacionamiento gratuito en la calle</li>
                    <li>• Estacionamiento Subterráneo Mall Paseo Valdivia (200m)</li>
                    <li>• Zona de carga y descarga para personas con movilidad reducida</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🚶‍♂️ Puntos de Referencia
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Frente al Parque Saval</li>
                    <li>• A 2 cuadras de la Plaza de la República</li>
                    <li>• Cerca del Mercado Fluvial (400m)</li>
                    <li>• Al lado del Teatro Municipal</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    ♿ Accesibilidad
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Acceso para sillas de ruedas</li>
                    <li>• Ascensor a todos los pisos</li>
                    <li>• Baños adaptados</li>
                    <li>• Señalética en braille</li>
                  </ul>
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