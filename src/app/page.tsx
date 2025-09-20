import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Search,
  MenuBook,
  Computer,
  Groups,
  Quiz,
  Archive,
  Storage,
  Info,
  LocationOn,
  Phone,
  Email
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
  <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
    <Header />

    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
          color: 'white',
          py: 10
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      fontWeight: 'bold',
                      mb: 3,
                      lineHeight: 1.2
                    }}
                  >
                    Biblioteca Municipal de Valdivia
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      mb: 4,
                      fontSize: { xs: '1.2rem', md: '1.5rem' }
                    }}
                  >
                    Un espacio de cultura, conocimiento y comunidad en el corazón de Los Ríos
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      mb: 4,
                      lineHeight: 1.6
                    }}
                  >
                    Desde 1925 sirviendo a la comunidad valdiviana, promoviendo la lectura, la educación y el acceso libre al conocimiento para todos.
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        href="/sobre-nosotros"
                        startIcon={<Info />}
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'grey.100' },
                          px: 4,
                          py: 1.5
                        }}
                      >
                        Conoce Nuestra Historia
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        href="#servicios"
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'white',
                            color: 'primary.main'
                          },
                          px: 4,
                          py: 1.5
                        }}
                      >
                        Ver Servicios
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Box>
              <Box sx={{ flex: 1 }}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      p: 4,
                      borderRadius: 3
                    }}
                  >
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                      {[
                        { number: '15,000+', label: 'Libros disponibles' },
                        { number: '2,500+', label: 'Usuarios activos' },
                        { number: '98', label: 'Años de historia' },
                        { number: '365', label: 'Días al año' }
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          style={{ textAlign: 'center' }}
                        >
                          <Typography
                            variant="h3"
                            sx={{ fontWeight: 'bold', color: 'white' }}
                          >
                            {stat.number}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: 'rgba(255,255,255,0.8)' }}
                          >
                            {stat.label}
                          </Typography>
                        </motion.div>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Buscador Destacado */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                🔍 Busca en Nuestro Catálogo
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.100', mb: 4 }}>
                Más de 15,000 títulos disponibles para toda la comunidad
              </Typography>
            </Box>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por título, autor o tema..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1 }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      href="/buscar-libros"
                      startIcon={<Search />}
                      sx={{ px: 4, py: 2, whiteSpace: 'nowrap' }}
                    >
                      Buscar
                    </Button>
                  </motion.div>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Accede al buscador avanzado con filtros por biblioteca, autor, género y disponibilidad
                </Typography>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="servicios" sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                Nuestros Servicios
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Ofrecemos una amplia gama de servicios para satisfacer las necesidades de nuestra comunidad
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
              {[
                {
                  icon: <MenuBook />,
                  title: 'Préstamo de Libros',
                  description: 'Acceso gratuito a más de 15,000 títulos con sistema de reservas en línea y renovaciones automáticas.',
                  link: '/buscar-libros',
                  linkText: 'Buscar en catálogo →',
                  color: 'primary'
                },
                {
                  icon: <Computer />,
                  title: 'Salas de Estudio',
                  description: 'Espacios silenciosos y cómodos para estudio individual y grupal, con WiFi gratuito y recursos digitales.',
                  link: '/servicios',
                  linkText: 'Ver más servicios →',
                  color: 'success'
                },
                {
                  icon: <Groups />,
                  title: 'Talleres Culturales',
                  description: 'Actividades para todas las edades: club de lectura, talleres de escritura, cuentacuentos infantiles.',
                  link: '/actividades',
                  linkText: 'Ver actividades →',
                  color: 'secondary'
                },
                {
                  icon: <Quiz />,
                  title: 'Consulta y Referencia',
                  description: 'Asesoría especializada para investigaciones, trabajos académicos y consultas bibliográficas.',
                  link: '/contacto',
                  linkText: 'Solicitar ayuda →',
                  color: 'warning'
                },
                {
                  icon: <Archive />,
                  title: 'Archivo Histórico',
                  description: 'Conservación y acceso a documentos históricos, fotografías y memoria local de Valdivia.',
                  link: '/sobre-nosotros',
                  linkText: 'Conoce más →',
                  color: 'error'
                },
                {
                  icon: <Storage />,
                  title: 'Recursos Digitales',
                  description: 'Acceso a bases de datos, revistas digitales, e-books y plataformas de aprendizaje en línea.',
                  link: '/servicios',
                  linkText: 'Ver servicios →',
                  color: 'info'
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <Box
                        sx={{
                          bgcolor: `${service.color}.main`,
                          color: 'white',
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {service.description}
                      </Typography>
                      <Button
                        href={service.link}
                        color={service.color as 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'}
                        sx={{ fontWeight: 'medium' }}
                      >
                        {service.linkText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                  Nuestra Historia
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Fundada en 1925, la Biblioteca Municipal de Valdivia ha sido un pilar fundamental en la promoción de la cultura y educación en nuestra ciudad. Durante casi un siglo, hemos evolucionado para adaptarnos a las necesidades cambiantes de nuestra comunidad.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  Ubicada en el corazón histórico de Valdivia, nuestra biblioteca no solo conserva el patrimonio literario de la región, sino que también se proyecta hacia el futuro con tecnologías modernas y servicios innovadores.
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {[
                    { number: '98', label: 'Años de servicio', color: 'primary' },
                    { number: '15K+', label: 'Libros en colección', color: 'success' },
                    { number: '2.5K+', label: 'Usuarios registrados', color: 'secondary' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                      style={{ textAlign: 'center' }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${stat.color}.main` }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </motion.div>
                  ))}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Horarios de Atención
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      {[
                        { day: 'Lunes a Viernes', hours: '9:00 - 18:00', color: 'text.primary' },
                        { day: 'Sábados', hours: '9:00 - 14:00', color: 'text.primary' },
                        { day: 'Domingos', hours: 'Cerrado', color: 'error.main' }
                      ].map((schedule, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                          <Typography color="text.secondary">{schedule.day}</Typography>
                          <Typography sx={{ fontWeight: 'bold', color: schedule.color }}>{schedule.hours}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Información de Contacto
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { icon: <LocationOn fontSize="small" />, text: 'Av. Picarte 1785, Valdivia' },
                        { icon: <Phone fontSize="small" />, text: '(63) 221-1234' },
                        { icon: <Email fontSize="small" />, text: 'biblioteca@valdivia.cl' }
                      ].map((contact, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: 'text.secondary' }}>{contact.icon}</Box>
                          <Typography variant="body2" color="text.secondary">{contact.text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                ¿Listo para explorar nuestro catálogo?
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.100', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Descubre miles de libros, reserva salas de estudio y participa en nuestras actividades culturales.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href="/buscar-libros"
                    startIcon={<Search />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'primary.50' },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Buscar Libros
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    href="/servicios"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'white',
                        color: 'primary.main'
                      },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Ver Servicios
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>

    <Footer />
  </Box>
);
}