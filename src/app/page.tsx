'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
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
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  schedule: string;
  location: string;
  image_url?: string;
  requirements?: string;
  is_active: boolean;
}

interface Statistics {
  userCount: number;
  workshopCount: number;
  totalWorkshopsThisYear: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'important' | 'maintenance';
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
}

export default function Home() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ userCount: 0, workshopCount: 0, totalWorkshopsThisYear: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    fetchStatistics();
    fetchFeaturedWorkshops();
    fetchAnnouncements();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get active workshop count
      const { count: workshopCount, error: workshopError } = await supabase
        .from('workshops')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get workshops created this year
      const currentYear = new Date().getFullYear();
      const { count: totalWorkshopsThisYear, error: yearlyError } = await supabase
        .from('workshops')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${currentYear}-01-01`);

      if (userError) console.error('Error fetching user count:', userError);
      if (workshopError) console.error('Error fetching workshop count:', workshopError);
      if (yearlyError) console.error('Error fetching yearly workshops:', yearlyError);

      setStatistics({
        userCount: userCount || 0,
        workshopCount: workshopCount || 0,
        totalWorkshopsThisYear: totalWorkshopsThisYear || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchFeaturedWorkshops = async () => {
    try {
      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', currentDate)
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) {
        // Check if this is a schema cache error (table doesn't exist)
        if (error.code === 'PGRST116' || error.code === 'PGRST205') {
          console.warn('Workshops table not found - skipping featured workshops:', {
            code: error.code,
            message: error.message
          });
          setWorkshops([]);
        } else {
          console.error('Error fetching workshops:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            full_error: error
          });
          setWorkshops([]);
        }
      } else {
        setWorkshops(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching featured workshops:', error);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', currentDate)
        .order('priority', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) {
        // Check if this is a schema cache error (table doesn't exist)
        if (error.code === 'PGRST116' || error.code === 'PGRST205') {
          console.warn('Announcements table not found - skipping announcements:', {
            code: error.code,
            message: error.message
          });
          setAnnouncements([]);
        } else {
          console.error('Error fetching announcements:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            full_error: error
          });
          setAnnouncements([]);
        }
      } else {
        // Filter announcements that haven't expired on the client side
        const activeAnnouncements = (data || []).filter(announcement =>
          !announcement.end_date || new Date(announcement.end_date) >= new Date()
        ).slice(0, 5);

        setAnnouncements(activeAnnouncements);
      }
    } catch (error) {
      console.error('Unexpected error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

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
                <Box sx={{ flex: 1, textAlign: { xs: 'center', lg: 'left' } }}>
                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                        fontWeight: 'bold',
                        mb: 3,
                        lineHeight: 1.2
                      }}
                    >
                      Biblioteca Municipal
                      <br />
                      <Box component="span" sx={{ color: '#ffeb3b' }}>
                        de Valdivia
                      </Box>
                    </Typography>
                  </MotionDiv>
                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: 4,
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        maxWidth: '600px',
                        mx: { xs: 'auto', lg: 0 }
                      }}
                    >
                      Tu centro cultural en el corazón de Los Ríos. Descubre, aprende y crece con nosotros.
                    </Typography>
                  </MotionDiv>
                  <MotionDiv variants={itemVariants}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 4,
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        mx: { xs: 'auto', lg: 0 }
                      }}
                    >
                      Desde 1925 promoviendo la cultura, la educación y el acceso libre al conocimiento para toda la comunidad valdiviana.
                    </Typography>
                  </MotionDiv>
                  <MotionDiv variants={itemVariants}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                      <MotionDiv
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          href="/workshops"
                          startIcon={<Event />}
                          sx={{
                            bgcolor: '#ffeb3b',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#fff59d' },
                            px: 4,
                            py: 1.5
                          }}
                        >
                          Ver Talleres
                        </Button>
                      </MotionDiv>
                      <MotionDiv
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outlined"
                          size="large"
                          href="/buscar-libros"
                          startIcon={<Search />}
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
                          Buscar Libros
                        </Button>
                      </MotionDiv>
                    </Box>
                  </MotionDiv>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <MotionDiv
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
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 3
                      }}>
                        {[
                          { number: '15,000+', label: 'Libros disponibles', icon: <MenuBook /> },
                          { number: loading ? '...' : `${statistics.userCount}+`, label: 'Usuarios registrados', icon: <People /> },
                          { number: '98', label: 'Años de historia', icon: <AutoStories /> },
                          { number: loading ? '...' : `${statistics.totalWorkshopsThisYear}+`, label: 'Talleres este año', icon: <Event /> }
                        ].map((stat, index) => (
                          <MotionDiv
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            style={{ textAlign: 'center' }}
                          >
                            <Box sx={{ mb: 1, color: '#ffeb3b' }}>
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="h3"
                              sx={{ fontWeight: 'bold', color: 'white', fontSize: { xs: '1.8rem', md: '2.2rem' } }}
                            >
                              {stat.number}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
                            >
                              {stat.label}
                            </Typography>
                          </MotionDiv>
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
          <Box sx={{ py: 6, bgcolor: '#f8f9fa' }}>
            <Container maxWidth="xl">
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, textAlign: 'center' }}>
                    Anuncios Importantes
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                    Mantente informado sobre las últimas noticias y eventos
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: 3
                }}>
                  {announcements.map((announcement, index) => {
                    const getTypeIcon = (type: string) => {
                      switch (type) {
                        case 'important': return <PriorityHigh />;
                        case 'event': return <Event />;
                        case 'maintenance': return <Warning />;
                        default: return <Info />;
                      }
                    };

                    const getTypeColor = (type: string) => {
                      switch (type) {
                        case 'important': return 'error';
                        case 'event': return 'success';
                        case 'maintenance': return 'warning';
                        default: return 'info';
                      }
                    };

                    return (
                      <MotionDiv
                        key={announcement.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        viewport={{ once: true }}
                      >
                        <Card
                          elevation={2}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            border: `2px solid`,
                            borderColor: `${getTypeColor(announcement.type)}.main`,
                            '&:hover': {
                              elevation: 4,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box
                                sx={{
                                  bgcolor: `${getTypeColor(announcement.type)}.main`,
                                  color: 'white',
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}
                              >
                                {getTypeIcon(announcement.type)}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                                  {announcement.title}
                                </Typography>
                                {announcement.priority >= 4 && (
                                  <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>
                                    ¡PRIORIDAD ALTA!
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                              {announcement.content.length > 150
                                ? `${announcement.content.substring(0, 150)}...`
                                : announcement.content
                              }
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(announcement.start_date).toLocaleDateString('es-ES')}
                              </Typography>
                              {announcement.end_date && (
                                <Typography variant="caption" color="warning.main">
                                  Hasta: {new Date(announcement.end_date).toLocaleDateString('es-ES')}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </MotionDiv>
                    );
                  })}
                </Box>
              </MotionDiv>
            </Container>
          </Box>
        )}

        {/* Talleres Destacados Section */}
        <Box sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="xl">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                  Talleres Culturales
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
                  Descubre nuestras actividades diseñadas para todas las edades y niveles
                </Typography>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href="/workshops"
                    endIcon={<ArrowForward />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Ver Todos los Talleres
                  </Button>
                </MotionDiv>
              </Box>

              {loading ? (
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: 4
                }}>
                  {[1, 2, 3].map((index) => (
                    <Card key={index} elevation={2} sx={{ height: '400px' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 3 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
                        <Skeleton variant="text" sx={{ mb: 1 }} />
                        <Skeleton variant="text" sx={{ mb: 3 }} />
                        <Skeleton variant="text" sx={{ mb: 1 }} />
                        <Skeleton variant="text" />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : workshops.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No hay talleres disponibles en este momento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pronto habrá nuevos talleres disponibles
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: 4
                }}>
                  {workshops.map((workshop, index) => (
                    <MotionDiv
                      key={workshop.id}
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
                            elevation: 6,
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        {workshop.image_url && (
                          <Box
                            sx={{
                              height: 180,
                              backgroundImage: `url(${workshop.image_url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {workshop.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                            {workshop.description.length > 100
                              ? `${workshop.description.substring(0, 100)}...`
                              : workshop.description
                            }
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Person fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {workshop.instructor}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Groups fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {workshop.current_participants}/{workshop.max_participants} participantes
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {workshop.schedule}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CalendarMonth fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(workshop.start_date).toLocaleDateString('es-ES')}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </MotionDiv>
                  ))}
                </Box>
              )}
            </MotionDiv>
          </Container>
        </Box>

        {/* Services Section */}
        <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
          <Container maxWidth="xl">
            <MotionDiv
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
                  Todo lo que necesitas para tu crecimiento personal y académico
                </Typography>
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 4
              }}>
                {[
                  {
                    icon: <MenuBook />,
                    title: 'Catálogo de Libros',
                    description: 'Más de 15,000 títulos disponibles para préstamo',
                    action: 'Buscar en catálogo',
                    link: '/buscar-libros',
                    color: 'primary'
                  },
                  {
                    icon: <Computer />,
                    title: 'Salas de Estudio',
                    description: 'Espacios cómodos con WiFi gratuito',
                    action: 'Ver disponibilidad',
                    link: '/servicios',
                    color: 'success'
                  },
                  {
                    icon: <Groups />,
                    title: 'Actividades Culturales',
                    description: 'Talleres, charlas y eventos comunitarios',
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
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: `${service.color}.main`,
                          color: 'white',
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {service.description}
                      </Typography>
                      <Button
                        href={service.link}
                        color={service.color as 'primary' | 'secondary' | 'success' | 'warning'}
                        size="small"
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

        {/* About & Contact Section */}
        <Box sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="xl">
            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                    Nuestra Historia
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Fundada en 1925, la Biblioteca Municipal de Valdivia ha sido un pilar fundamental en la promoción de la cultura y educación en nuestra querida ciudad.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Durante casi un siglo, hemos evolucionado para adaptarnos a las necesidades de nuestra comunidad, combinando la tradición bibliotecaria con tecnologías modernas y servicios innovadores.
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
                    {[
                      { number: '98', label: 'Años de servicio', color: 'primary' },
                      { number: '15K+', label: 'Libros', color: 'success' },
                      { number: loading ? '...' : `${statistics.userCount}+`, label: 'Usuarios', color: 'secondary' }
                    ].map((stat, index) => (
                      <MotionDiv
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
                      </MotionDiv>
                    ))}
                  </Box>

                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      href="/sobre-nosotros"
                      endIcon={<ArrowForward />}
                      sx={{ px: 4 }}
                    >
                      Conoce Más
                    </Button>
                  </MotionDiv>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <MotionDiv
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                        Visítanos
                      </Typography>

                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
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
                        Contacto
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                          { icon: <LocationOn fontSize="small" />, text: 'Av. Picarte 1785, Valdivia' },
                          { icon: <Phone fontSize="small" />, text: '(63) 221-1234' },
                          { icon: <Email fontSize="small" />, text: 'biblioteca@valdivia.cl' }
                        ].map((contact, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ color: 'primary.main' }}>{contact.icon}</Box>
                            <Typography variant="body2" color="text.secondary">{contact.text}</Typography>
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

        {/* CTA Section */}
        <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
          <Container maxWidth="lg">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                  ¿Listo para explorar?
                </Typography>
                <Typography variant="h6" sx={{ color: 'primary.100', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                  Únete a nuestra comunidad de lectores, participa en talleres y descubre todo lo que tenemos para ofrecerte.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                  <MotionDiv
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
                  </MotionDiv>
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      href="/workshops"
                      startIcon={<Event />}
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
                      Ver Talleres
                    </Button>
                  </MotionDiv>
                </Box>
              </Box>
            </MotionDiv>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}