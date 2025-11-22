'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <Header />

      <Box component="main" sx={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)',
            color: 'white',
            py: { xs: 6, sm: 8, md: 12 }
          }}
        >
          <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: { xs: 'center', lg: 'flex-start' },
                textAlign: { xs: 'center', lg: 'left' }
              }}>
                {/* Left Content */}
                <Box sx={{ flex: 1, width: '100%' }}>
                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 'bold',
                        mb: { xs: 2, md: 3 },
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                        lineHeight: { xs: 1.2, md: 1.1 }
                      }}
                    >
                      Biblioteca Municipal de Valdivia
                    </Typography>
                  </MotionDiv>

                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: { xs: 3, md: 4 },
                        opacity: 0.9,
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                        lineHeight: 1.4,
                        maxWidth: { xs: '100%', lg: '90%' }
                      }}
                    >
                      Tu centro de conocimiento, cultura y aprendizaje en el corazón de Valdivia
                    </Typography>
                  </MotionDiv>

                  <MotionDiv variants={itemVariants}>
                    <Box sx={{
                      display: 'flex',
                      gap: { xs: 2, sm: 3 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      justifyContent: { xs: 'center', lg: 'flex-start' },
                      width: '100%'
                    }}>
                      <Button
                        variant="contained"
                        size="large"
                        href="/buscar-libros"
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'grey.100' },
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1.5, sm: 1.5 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: { xs: '280px', sm: 'none' }
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
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1.5, sm: 1.5 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: { xs: '280px', sm: 'none' }
                        }}
                        startIcon={<Event />}
                      >
                        Ver Talleres
                      </Button>
                    </Box>
                  </MotionDiv>
                </Box>

                {/* Right Content - Stats */}
                <Box sx={{
                  flex: { lg: 0.4 },
                  width: { xs: '100%', lg: 'auto' },
                  maxWidth: { xs: '100%', sm: '500px', lg: 'none' }
                }}>
                  <MotionDiv variants={itemVariants}>
                    <Paper
                      elevation={8}
                      sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        width: '100%'
                      }}
                    >
                      <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}>
                        Estadísticas en Vivo
                      </Typography>

                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 2.5, sm: 3 }
                      }}>
                        {[
                          { icon: <People />, label: 'Usuarios Registrados', value: statistics.userCount, color: '#1976d2' },
                          { icon: <Event />, label: 'Talleres Activos', value: statistics.workshopCount, color: '#2e7d32' },
                          { icon: <CalendarMonth />, label: 'Talleres Este Año', value: statistics.totalWorkshopsThisYear, color: '#ed6c02' }
                        ].map((stat, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              p: { xs: 1, sm: 1.5 },
                              borderRadius: 2,
                              bgcolor: stat.color + '20',
                              color: stat.color,
                              display: 'flex',
                              alignItems: 'center',
                              flexShrink: 0
                            }}>
                              {stat.icon}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="h4"
                                sx={{
                                  fontWeight: 'bold',
                                  color: stat.color,
                                  fontSize: { xs: '1.8rem', sm: '2.125rem' }
                                }}
                              >
                                {loading ? <Skeleton width={40} /> : stat.value}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  lineHeight: 1.3
                                }}
                              >
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
          <Container maxWidth="xl" sx={{ py: 6, width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: 'text.primary' }}>
                Anuncios Importantes
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: { xs: 2, md: 3 }
              }}>
                {announcements.slice(0, 6).map((announcement, index) => {
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          height: '100%',
                          borderTop: `4px solid`,
                          borderTopColor: `${config.color}.main`,
                          '&:hover': {
                            elevation: 8,
                            transition: 'all 0.3s ease-in-out'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Box sx={{
                              color: `${config.color}.main`,
                              p: 1,
                              borderRadius: 2,
                              bgcolor: `${config.color}.50`,
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              {config.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                color: 'text.primary',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                lineHeight: 1.3
                              }}>
                                {announcement.title}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              flex: 1,
                              lineHeight: 1.5,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {announcement.excerpt || announcement.content.substring(0, 120) + '...'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </MotionDiv>
                  );
                })}
              </Box>

              {/* Botón Ver Todos los Anuncios si hay más de 6 */}
              {announcements.length > 6 && (
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
                      href="/anuncios"
                      endIcon={<ArrowForward />}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      Ver Todos los Anuncios
                    </Button>
                  </Box>
                </MotionDiv>
              )}
            </MotionDiv>
          </Container>
        )}

        {/* Gallery Section */}
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
          <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: 'text.primary' }}>
                Conoce Nuestro Espacio
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: { xs: 2, sm: 3, md: 4 },
                mb: 4
              }}>
                {[
                  { src: '/foto1.jpg', title: 'Fachada Principal' },
                  { src: '/foto2.jpg', title: 'Vista Lateral' },
                  { src: '/foto3.jpg', title: 'Vista General' }
                ].map((photo, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        overflow: 'hidden',
                        borderRadius: 3,
                        '&:hover': {
                          elevation: 12,
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: { xs: 200, sm: 250, md: 300 } }}>
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          fill
                          style={{
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            p: 3,
                            color: 'white'
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {photo.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </MotionDiv>
                ))}
              </Box>

              <MotionDiv
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      maxWidth: '600px',
                      mx: 'auto',
                      lineHeight: 1.6,
                      fontSize: { xs: '1rem', md: '1.1rem' }
                    }}
                  >
                    Un hermoso edificio histórico en el corazón de Valdivia que alberga nuestra biblioteca.
                    Su arquitectura tradicional refleja la rica historia cultural de nuestra ciudad.
                  </Typography>
                </Box>
              </MotionDiv>
            </MotionDiv>
          </Container>
        </Box>

        {/* Featured Workshops Section */}
        <Container maxWidth="xl" sx={{ py: 6, width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: 'text.primary' }}>
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
              <>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: { xs: 2, sm: 3 }
                }}>
                  {workshops.slice(0, 6).map((workshop, index) => (
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
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
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

                {/* Botón Ver Todos los Talleres si hay más de 6 */}
                {workshops.length > 6 && (
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
                        sx={{
                          borderColor: 'success.main',
                          color: 'success.main',
                          '&:hover': {
                            borderColor: 'success.dark',
                            bgcolor: 'success.50'
                          }
                        }}
                      >
                        Ver Todos los Talleres
                      </Button>
                    </Box>
                  </MotionDiv>
                )}
              </>
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

          </MotionDiv>
        </Container>

        {/* Services Section */}
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: 'text.primary' }}>
                Nuestros Servicios
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: { xs: 3, md: 4 }
              }}>
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

                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
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
        <Container maxWidth="xl" sx={{ py: 8, width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: 'text.primary' }}>
              Información y Contacto
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '2fr 1fr' },
              gap: { xs: 4, md: 6 }
            }}>
              {/* Contact Info */}
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
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
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
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

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
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