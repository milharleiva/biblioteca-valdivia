import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Actividades() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Actividades Culturales
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8">
                Programación permanente para toda la familia
              </p>
            </div>
          </div>
        </section>

        {/* Actividades Permanentes */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Actividades Permanentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Club de Lectura */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl shadow-lg">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  Club de Lectura Adultos
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="text-center">
                    Nos reunimos cada jueves para compartir y analizar las mejores obras
                    de la literatura nacional e internacional.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Día:</span>
                        <span>Jueves</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hora:</span>
                        <span>18:00 - 19:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Participantes:</span>
                        <span>15-20 personas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Costo:</span>
                        <span className="text-green-600 font-bold">Gratuito</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    Libro actual: "Cien años de soledad" - Gabriel García Márquez
                  </p>
                </div>
              </div>

              {/* Cuentacuentos Infantil */}
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-8 rounded-xl shadow-lg">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M7 4v16m10-16v16M7 20H5a2 2 0 01-2-2V8a2 2 0 012-2h2m10 0h2a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  Cuentacuentos Infantil
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="text-center">
                    Narración interactiva de cuentos tradicionales y modernos
                    para despertar la imaginación de los más pequeños.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Día:</span>
                        <span>Sábados</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hora:</span>
                        <span>11:00 - 12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Edades:</span>
                        <span>4 a 10 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Costo:</span>
                        <span className="text-green-600 font-bold">Gratuito</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    ¡Incluye actividades de dibujo y manualidades!
                  </p>
                </div>
              </div>

              {/* Taller de Escritura Creativa */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg">
                <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  Taller de Escritura Creativa
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="text-center">
                    Desarrollo de habilidades narrativas a través de ejercicios
                    creativos y técnicas de escritura literaria.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Día:</span>
                        <span>Martes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hora:</span>
                        <span>19:00 - 20:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Nivel:</span>
                        <span>Principiante</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cupos:</span>
                        <span>12 personas máx.</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    Próximo ciclo: Marzo 2024 (8 sesiones)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programación Mensual */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Programación Enero 2024
            </h2>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Eventos Destacados */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Eventos Destacados
                  </h3>

                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">Encuentro de Escritores Valdivianos</h4>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">15 Ene</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Mesa redonda con autores locales presentando sus últimas obras.
                      </p>
                      <p className="text-xs text-gray-500">18:00 hrs - Sala Principal</p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">Taller de Encuadernación Artesanal</h4>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">22 Ene</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Aprende técnicas tradicionales de encuadernación con materiales reciclados.
                      </p>
                      <p className="text-xs text-gray-500">15:00 hrs - Sala de Talleres (Cupos limitados)</p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">Noche de Poesía Abierta</h4>
                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">28 Ene</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Micrófono abierto para poetas amateur y profesionales.
                      </p>
                      <p className="text-xs text-gray-500">19:30 hrs - Auditorio</p>
                    </div>
                  </div>
                </div>

                {/* Talleres del Mes */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Talleres del Mes
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Introducción a la Genealogía</h4>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">📅 Sábados 10, 17, 24 y 31 de enero</p>
                        <p className="mb-1">🕐 14:00 - 16:00 hrs</p>
                        <p className="mb-1">👥 Máximo 15 participantes</p>
                        <p>📝 Inscripciones abiertas</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Iniciación a la Fotografía Digital</h4>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">📅 Miércoles 10, 17, 24 y 31 de enero</p>
                        <p className="mb-1">🕐 18:00 - 20:00 hrs</p>
                        <p className="mb-1">👥 Máximo 12 participantes</p>
                        <p>📝 Requiere cámara propia</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Club de Lectura Juvenil (13-17 años)</h4>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">📅 Viernes 12, 19 y 26 de enero</p>
                        <p className="mb-1">🕐 16:00 - 17:30 hrs</p>
                        <p className="mb-1">📖 Libro: "Eleanor & Park" - Rainbow Rowell</p>
                        <p>👥 Grupo abierto</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exposiciones */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Exposiciones Actuales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-xl">
                <div className="aspect-video bg-gray-300 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium">Exposición Fotográfica</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  "Valdivia: Ayer y Hoy"
                </h3>
                <p className="text-gray-600 mb-4">
                  Muestra fotográfica que contrasta imágenes históricas de Valdivia
                  con fotografías contemporáneas de los mismos lugares.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Período:</strong> Diciembre 2023 - Febrero 2024</p>
                  <p><strong>Ubicación:</strong> Hall Principal</p>
                  <p><strong>Curador:</strong> Archivo Histórico Municipal</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-purple-200 p-8 rounded-xl">
                <div className="aspect-video bg-blue-300 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-blue-700">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="font-medium">Muestra Literaria</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  "Primeras Ediciones Chilenas"
                </h3>
                <p className="text-gray-600 mb-4">
                  Exposición de primeras ediciones de autores chilenos clásicos,
                  incluyendo obras de Neruda, Mistral y de Rokha.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Período:</strong> Enero - Marzo 2024</p>
                  <p><strong>Ubicación:</strong> Sala de Patrimonio</p>
                  <p><strong>Colaboración:</strong> Biblioteca Nacional de Chile</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inscripciones */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                ¿Te interesa participar?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                La mayoría de nuestras actividades son gratuitas y abiertas a toda la comunidad
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-700 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Inscripciones Presenciales</h3>
                  <p className="text-blue-100 text-sm">
                    Visítanos en horario de atención en el mesón principal
                  </p>
                </div>

                <div className="bg-blue-700 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Por Teléfono</h3>
                  <p className="text-blue-100 text-sm">
                    Llama al (63) 221-1234 de lunes a viernes de 9:00 a 17:00
                  </p>
                </div>

                <div className="bg-blue-700 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Por Email</h3>
                  <p className="text-blue-100 text-sm">
                    Escríbenos a actividades@bibliotecaslosrios.cl
                  </p>
                </div>
              </div>

              <div className="bg-blue-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Información Importante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
                  <div>
                    <p className="mb-2">✓ Los talleres tienen cupos limitados</p>
                    <p className="mb-2">✓ Inscripciones por orden de llegada</p>
                  </div>
                  <div>
                    <p className="mb-2">✓ Certificado de participación disponible</p>
                    <p className="mb-2">✓ Materiales incluidos en talleres</p>
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