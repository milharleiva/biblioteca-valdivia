'use client';

import { useState, useEffect } from 'react';
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
  Divider,
  Skeleton
} from '@mui/material';
import {
  Search,
  MenuBook,
  Computer,
  Groups,
  Event,
  ArrowForward,
  LocationOn,
  Phone,
  Email,
  Schedule,
  AutoStories,
  People,
  Person,
  CalendarMonth,
  Announcement,
  PriorityHigh,
  Info,
  Warning
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  schedule?: string;
  location: string;
  imageUrl?: string;
  requirements?: string;
  isActive: boolean;
  _count?: {
    enrollments: number;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: string;
  priority: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

interface Statistics {
  userCount: number;
  workshopCount: number;
  totalWorkshopsThisYear: number;
  activeAnnouncements: number;
}

export default function HomeContent() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ userCount: 0, workshopCount: 0, totalWorkshopsThisYear: 0, activeAnnouncements: 0 });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchStatistics();
    fetchFeaturedWorkshops();
    fetchAnnouncements();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const result = await response.json();

      if (result.success) {
        setStatistics(result.data);
      } else {
        console.error('Error fetching statistics:', result.error);
        setStatistics({ userCount: 0, workshopCount: 0, totalWorkshopsThisYear: 0, activeAnnouncements: 0 });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({ userCount: 0, workshopCount: 0, totalWorkshopsThisYear: 0, activeAnnouncements: 0 });
    }
  };

  const fetchFeaturedWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops?featured=true&limit=3');
      const result = await response.json();

      if (result.success) {
        setWorkshops(result.data || []);
      } else {
        console.error('Error fetching workshops:', result.error);
        setWorkshops([]);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const result = await response.json();

      if (result.success) {
        // Filter only active announcements that should be shown now
        const now = new Date();
        const activeAnnouncements = (result.data || []).filter((announcement: Announcement) => {
          const startDate = new Date(announcement.startDate);
          const endDate = announcement.endDate ? new Date(announcement.endDate) : null;

          return announcement.isActive &&
                 startDate <= now &&
                 (!endDate || endDate >= now);
        });

        setAnnouncements(activeAnnouncements.slice(0, 3)); // Show only first 3
      } else {
        console.error('Error fetching announcements:', result.error);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
            background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)',
            color: 'white',
            py: { xs: 8, md: 12 }
          }}
        >
          <Container maxWidth="xl">
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6, alignItems: 'center' }}>
                {/* Left Content */}
                <Box sx={{ flex: 1 }}>
                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                      }}
                    >
                      Biblioteca Municipal de Valdivia
                    </Typography>
                  </MotionDiv>

                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 4,
                        opacity: 0.9,
                        fontSize: { xs: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      Tu centro de conocimiento, cultura y aprendizaje en el corazón de Valdivia
                    </Typography>
                  </MotionDiv>

                  <MotionDiv variants={itemVariants}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        href="/buscar-libros"
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'grey.100' },
                          px: 4,
                          py: 1.5
                        }}
                        startIcon={<Search />}
                      >
                        Buscar Libros
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        href="/workshops"
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                          px: 4,
                          py: 1.5
                        }}
                        startIcon={<Event />}
                      >
                        Ver Talleres
                      </Button>
                    </Box>
                  </MotionDiv>
                </Box>

                {/* Right Content - Stats */}
                <Box sx={{ flex: { lg: 0.4 } }}>
                  <MotionDiv variants={itemVariants}>
                    <Paper
                      elevation={8}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                        Estadísticas en Vivo
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {[
                          { icon: <People />, label: 'Usuarios Registrados', value: statistics.userCount, color: '#1976d2' },
                          { icon: <Event />, label: 'Talleres Activos', value: statistics.workshopCount, color: '#2e7d32' },
                          { icon: <CalendarMonth />, label: 'Talleres Este Año', value: statistics.totalWorkshopsThisYear, color: '#ed6c02' }
                        ].map((stat, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: stat.color + '20',
                              color: stat.color,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              {stat.icon}
                            </Box>
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                                {loading ? <Skeleton width={40} /> : stat.value}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {stat.label}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </MotionDiv>
                </Box>
              </Box>
            </MotionDiv>
          </Container>
        </Box>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <Container maxWidth="xl" sx={{ py: 6 }}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                Anuncios Importantes
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {announcements.slice(0, 3).map((announcement, index) => {
                  const getAnnouncementConfig = (type: string) => {
                    switch (type) {
                      case 'important': return { icon: <PriorityHigh />, color: 'error' };
                      case 'emergency': return { icon: <Warning />, color: 'error' };
                      case 'event': return { icon: <Event />, color: 'info' };
                      default: return { icon: <Info />, color: 'info' };
                    }
                  };

                  const config = getAnnouncementConfig(announcement.type);

                  return (
                    <MotionDiv
                      key={announcement.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderLeft: `4px solid`,
                          borderLeftColor: `${config.color}.main`,
                          '&:hover': {
                            elevation: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ color: `${config.color}.main`, mt: 0.5 }}>
                            {config.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {announcement.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {announcement.excerpt || announcement.content.substring(0, 150) + '...'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </MotionDiv>
                  );
                })}
              </Box>
            </MotionDiv>
          </Container>
        )}

        {/* Featured Workshops Section */}
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
              Próximos Talleres
            </Typography>

            {loading ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {[1, 2, 3].map((item) => (
                  <Card key={item} elevation={2}>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
                      <Skeleton variant="rectangular" width="100%" height={80} sx={{ mt: 2 }} />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : workshops.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(350px, 1fr))' }, gap: 3 }}>
                {workshops.map((workshop, index) => (
                  <MotionDiv
                    key={workshop.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: '100%',
                        '&:hover': {
                          elevation: 8,
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          {workshop.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {workshop.instructor}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Event fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(workshop.startDate).toLocaleDateString('es-CL')}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {workshop.location}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Groups fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {workshop._count?.enrollments || 0}/{workshop.maxParticipants} participantes
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3 }}>
                          {workshop.description.length > 100
                            ? workshop.description.substring(0, 100) + '...'
                            : workshop.description
                          }
                        </Typography>

                        <Button
                          variant="contained"
                          fullWidth
                          href="/workshops"
                          endIcon={<ArrowForward />}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No hay talleres próximos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ¡Pronto tendremos nuevos talleres disponibles!
                </Typography>
              </Box>
            )}

            {workshops.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/workshops"
                    endIcon={<ArrowForward />}
                  >
                    Ver Todos los Talleres
                  </Button>
                </Box>
              </MotionDiv>
            )}
          </MotionDiv>
        </Container>

        {/* Services Section */}
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="xl">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
                Nuestros Servicios
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
                {[
                  {
                    icon: <MenuBook />,
                    title: 'Préstamo de Libros',
                    description: 'Amplio catálogo de libros disponibles para préstamo domiciliario',
                    action: 'Buscar libros',
                    link: '/buscar-libros',
                    color: 'primary'
                  },
                  {
                    icon: <Computer />,
                    title: 'Acceso a Internet',
                    description: 'Computadores y WiFi gratuito para estudiantes y visitantes',
                    action: 'Conocer más',
                    link: '/servicios',
                    color: 'info'
                  },
                  {
                    icon: <Groups />,
                    title: 'Talleres y Eventos',
                    description: 'Actividades culturales y educativas para todas las edades',
                    action: 'Ver calendario',
                    link: '/workshops',
                    color: 'secondary'
                  },
                  {
                    icon: <AutoStories />,
                    title: 'Consulta Especializada',
                    description: 'Asesoría para investigaciones académicas',
                    action: 'Solicitar ayuda',
                    link: '/contacto',
                    color: 'warning'
                  }
                ].map((service, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                        '&:hover': {
                          elevation: 8,
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <Box sx={{
                        mb: 3,
                        color: `${service.color}.main`,
                        fontSize: 48
                      }}>
                        {service.icon}
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {service.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {service.description}
                      </Typography>

                      <Button
                        variant="contained"
                        color={service.color as any}
                        href={service.link}
                        endIcon={<ArrowForward />}
                      >
                        {service.action}
                      </Button>
                    </Card>
                  </MotionDiv>
                ))}
              </Box>
            </MotionDiv>
          </Container>
        </Box>

        {/* Contact Section */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
              Información y Contacto
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 6 }}>
              {/* Contact Info */}
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Contáctanos
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Estamos aquí para ayudarte con cualquier consulta o necesidad relacionada con nuestros servicios.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[
                      { icon: <LocationOn />, text: 'Av. Picarte 1785, Valdivia' },
                      { icon: <Phone />, text: '(63) 221-1234' },
                      { icon: <Email />, text: 'biblioteca@valdivia.cl' }
                    ].map((contact, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {contact.icon}
                        </Box>
                        <Typography variant="body1">
                          {contact.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      href="/contacto"
                      endIcon={<ArrowForward />}
                    >
                      Enviar Mensaje
                    </Button>
                  </Box>
                </Paper>
              </MotionDiv>

              {/* Hours */}
              <MotionDiv
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                    <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Horarios de Atención
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    Contacto
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { icon: <LocationOn fontSize="small" />, text: 'Av. Picarte 1785, Valdivia' },
                      { icon: <Phone fontSize="small" />, text: '(63) 221-1234' },
                      { icon: <Email fontSize="small" />, text: 'biblioteca@valdivia.cl' }
                    ].map((contact, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: 'text.secondary' }}>
                          {contact.icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </MotionDiv>
            </Box>
          </MotionDiv>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}