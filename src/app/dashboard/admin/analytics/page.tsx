'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  TrendingUp,
  People,
  Event,
  Search,
  Category,
  Analytics,
  Timeline,
  PieChart,
  BarChart,
  Assessment,
  PersonAdd,
  PushPin
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

interface AnalyticsData {
  userCount: number;
  workshopCount: number;
  totalWorkshopsThisYear: number;
  activeAnnouncements: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  attendanceRate: number;
  activeUsersLastMonth: number;
  newUsersThisMonth: number;
  workshopsByCategory: Array<{category: string, _count: {category: number}}>;
  pinnedAnnouncements: number;
}

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAnalytics();
      // Actualizar cada minuto
      const interval = setInterval(fetchAnalytics, 60000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const result = await response.json();

      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!profile || profile.role !== 'admin') {
    return <LoadingScreen message="Verificando permisos de administrador" />;
  }

  if (loading) {
    return <LoadingScreen message="Cargando analíticas" />;
  }

  // Helper function to get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'GENERAL': 'General',
      'TECHNOLOGY': 'Tecnología',
      'ART': 'Arte',
      'LITERATURE': 'Literatura',
      'EDUCATION': 'Educación',
      'CULTURE': 'Cultura'
    };
    return categoryMap[category] || category;
  };

  // Calculate percentages for categories
  const totalWorkshops = analytics?.workshopsByCategory.reduce((sum, cat) => sum + cat._count.category, 0) || 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4, display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: { xs: 'left', sm: 'center' } }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
              <Button
                component={Link}
                href="/dashboard/admin"
                startIcon={<ArrowBack />}
                sx={{ mb: 2 }}
              >
                Volver al Panel de Admin
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
              <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Analíticas y Reportes
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
              Visualización avanzada de datos y métricas del sistema
            </Typography>
          </Box>

          {/* Responsive Bento Grid Layout */}
          <Box sx={{
            display: 'grid',
            gridTemplateRows: 'auto',
            gap: { xs: 2, sm: 2.5, md: 3 },
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
              xl: 'repeat(8, 1fr)'
            },
            gridTemplateAreas: {
              xs: `
                "stats1"
                "stats2"
                "stats3"
                "stats4"
                "categories"
                "system"
                "activity"
              `,
              sm: `
                "stats1 stats2"
                "stats3 stats4"
                "categories categories"
                "system system"
                "activity activity"
              `,
              md: `
                "stats1 stats2 stats3 stats4"
                "categories categories system system"
                "activity activity activity activity"
              `,
              lg: `
                "stats1 stats2 stats3 stats4 system system"
                "categories categories categories categories system system"
                "activity activity activity activity activity activity"
              `,
              xl: `
                "stats1 stats2 stats3 stats4 system system system ."
                "categories categories categories categories categories system system activity"
                "activity activity activity activity activity activity activity activity"
              `
            }
          }}>

            {/* Key Metrics - Responsive Cards */}
            <Card elevation={3} sx={{
              gridArea: 'stats1',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: { xs: 1.5, sm: 2, md: 2 },
              minHeight: { xs: 120, sm: 140, md: 160 }
            }}>
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <People sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, mb: { xs: 0.5, sm: 1 }, opacity: 0.9 }} />
                <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analytics?.userCount || 0}
                </Typography>
                <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Usuarios Registrados
                </Typography>
                {analytics?.newUsersThisMonth ? (
                  <Chip
                    label={`+${analytics.newUsersThisMonth}`}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  />
                ) : null}
              </Box>
            </Card>

            <Card elevation={3} sx={{
              gridArea: 'stats2',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              p: { xs: 1.5, sm: 2, md: 2 },
              minHeight: { xs: 120, sm: 140, md: 160 }
            }}>
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Event sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, mb: { xs: 0.5, sm: 1 }, opacity: 0.9 }} />
                <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analytics?.workshopCount || 0}
                </Typography>
                <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Talleres Activos
                </Typography>
                <Chip
                  label={`${analytics?.totalWorkshopsThisYear || 0} este año`}
                  size="small"
                  sx={{ mt: 0.5, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                />
              </Box>
            </Card>

            <Card elevation={3} sx={{
              gridArea: 'stats3',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              p: { xs: 1.5, sm: 2, md: 2 },
              minHeight: { xs: 120, sm: 140, md: 160 }
            }}>
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TrendingUp sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, mb: { xs: 0.5, sm: 1 }, opacity: 0.9 }} />
                <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analytics?.attendanceRate || 0}%
                </Typography>
                <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Tasa de Asistencia
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {analytics?.completedEnrollments || 0} completados
                </Typography>
              </Box>
            </Card>

            <Card elevation={3} sx={{
              gridArea: 'stats4',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              p: { xs: 1.5, sm: 2, md: 2 },
              minHeight: { xs: 120, sm: 140, md: 160 }
            }}>
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <PersonAdd sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, mb: { xs: 0.5, sm: 1 }, opacity: 0.9 }} />
                <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analytics?.activeUsersLastMonth || 0}
                </Typography>
                <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Activos (30d)
                </Typography>
              </Box>
            </Card>

            {/* Categories - Responsive Large tile */}
            <Paper elevation={3} sx={{
              gridArea: 'categories',
              p: { xs: 2, sm: 2.5, md: 3 },
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              minHeight: { xs: 250, sm: 300, md: 350 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                <PieChart sx={{ mr: { xs: 1, sm: 2 }, color: 'primary.main', fontSize: { xs: 24, sm: 28, md: 32 } }} />
                <Typography variant={{ xs: 'body1', sm: 'h6' }} sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Talleres por Categoría
                </Typography>
              </Box>

              {analytics?.workshopsByCategory && analytics.workshopsByCategory.length > 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, sm: 2 },
                  maxHeight: { xs: '200px', sm: '250px', md: '300px' },
                  overflow: 'auto'
                }}>
                  {analytics.workshopsByCategory.map((category, index) => {
                    const percentage = totalWorkshops > 0 ? Math.round((category._count.category / totalWorkshops) * 100) : 0;
                    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1'];

                    return (
                      <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 },
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${colors[index % colors.length]}10, ${colors[index % colors.length]}20)`
                      }}>
                        <Avatar sx={{
                          bgcolor: colors[index % colors.length],
                          width: { xs: 32, sm: 40, md: 44 },
                          height: { xs: 32, sm: 40, md: 44 }
                        }}>
                          <Category sx={{ fontSize: { xs: 16, sm: 20, md: 22 } }} />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant={{ xs: 'body2', sm: 'body1' }} sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {getCategoryDisplayName(category.category)}
                          </Typography>
                          <Typography variant={{ xs: 'caption', sm: 'body2' }} color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {category._count.category} talleres
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: { xs: 60, sm: 80 }, textAlign: 'right' }}>
                          <Typography variant={{ xs: 'body2', sm: 'h6' }} sx={{ fontWeight: 'bold', color: colors[index % colors.length], fontSize: { xs: '0.875rem', sm: '1.25rem' } }}>
                            {percentage}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: { xs: 4, sm: 6 },
                              borderRadius: 3,
                              backgroundColor: 'grey.200',
                              mt: 0.5,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: colors[index % colors.length]
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                  <PieChart sx={{ fontSize: { xs: 48, sm: 60 }, color: 'text.secondary', mb: { xs: 1, sm: 2 }, opacity: 0.5 }} />
                  <Typography variant={{ xs: 'body2', sm: 'body1' }} color="text.secondary">
                    No hay categorías disponibles
                  </Typography>
                </Box>
              )}
            </Paper>


            {/* System Status - Responsive */}
            <Paper elevation={3} sx={{
              gridArea: 'system',
              p: { xs: 2, sm: 2.5, md: 3 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                <Assessment sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 24, sm: 28 } }} />
                <Typography variant={{ xs: 'body1', sm: 'h6' }} sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Estado del Sistema
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {[
                  {
                    label: 'Talleres Activos',
                    value: analytics?.workshopCount || 0,
                    icon: <Event />,
                    good: (analytics?.workshopCount || 0) > 0
                  },
                  {
                    label: 'Usuarios Nuevos',
                    value: analytics?.newUsersThisMonth || 0,
                    icon: <PersonAdd />,
                    good: (analytics?.newUsersThisMonth || 0) > 0
                  },
                  {
                    label: 'Tasa Finalización',
                    value: `${analytics?.attendanceRate || 0}%`,
                    icon: <TrendingUp />,
                    good: (analytics?.attendanceRate || 0) >= 50
                  }
                ].map((metric, index) => (
                  <Box key={index} sx={{
                    p: { xs: 1.5, sm: 2 },
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 }
                  }}>
                    <Avatar sx={{
                      bgcolor: metric.good ? 'success.main' : 'warning.main',
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 }
                    }}>
                      {metric.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {metric.label}
                      </Typography>
                      <Typography variant={{ xs: 'body1', sm: 'h6' }} sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {metric.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Activity Summary - Responsive */}
            <Paper elevation={3} sx={{
              gridArea: 'activity',
              p: { xs: 2, sm: 2.5, md: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                <Timeline sx={{ mr: { xs: 1, sm: 2 }, color: 'info.main', fontSize: { xs: 24, sm: 28 } }} />
                <Typography variant={{ xs: 'body1', sm: 'h6' }} sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Resumen de Actividad Global
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {[
                  {
                    title: 'Total Inscripciones',
                    value: analytics?.totalEnrollments || 0,
                    subtitle: `${analytics?.activeEnrollments || 0} activas`,
                    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
                  },
                  {
                    title: 'Completadas',
                    value: analytics?.completedEnrollments || 0,
                    subtitle: `${analytics?.attendanceRate || 0}% tasa éxito`,
                    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
                  },
                  {
                    title: 'Anuncios Activos',
                    value: analytics?.activeAnnouncements || 0,
                    subtitle: `${analytics?.pinnedAnnouncements || 0} importantes`,
                    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
                  },
                  {
                    title: 'Anuncios Fijados',
                    value: analytics?.pinnedAnnouncements || 0,
                    subtitle: `${analytics?.activeAnnouncements || 0} total`,
                    gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
                  }
                ].map((item, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Card elevation={1} sx={{
                      p: { xs: 1.5, sm: 2 },
                      textAlign: 'center',
                      background: item.gradient,
                      color: 'white',
                      minHeight: { xs: 100, sm: 120 }
                    }}>
                      <Typography variant={{ xs: 'h6', sm: 'h4' }} sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.25rem', sm: '2.125rem' } }}>
                        {item.value}
                      </Typography>
                      <Typography variant={{ xs: 'caption', sm: 'body2' }} sx={{ opacity: 0.9, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        {item.subtitle}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

          </Box>
        </MotionDiv>
      </Container>
    </Box>
  );
}