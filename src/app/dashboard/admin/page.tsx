'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton
} from '@mui/material';
import {
  Event,
  People,
  Add,
  Analytics,
  ArrowBack,
  Announcement
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

interface AdminStatistics {
  activeWorkshops: number;
  totalUsers: number;
  totalEnrollments: number;
  workshopsThisMonth: number;
}

export default function AdminPage() {
  const { profile } = useAuth();
  const [statistics, setStatistics] = useState<AdminStatistics>({
    activeWorkshops: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    workshopsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdminStatistics();

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchAdminStatistics(false); // Don't show loading on auto-refresh
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchAdminStatistics = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      // Fetch basic statistics from existing API
      const statsResponse = await fetch('/api/statistics');
      const statsResult = await statsResponse.json();

      // For now, we'll use the existing statistics and calculate additional ones
      if (statsResult.success) {
        const basicStats = statsResult.data;

        // Set statistics with available data
        setStatistics({
          activeWorkshops: basicStats.workshopCount || 0,
          totalUsers: basicStats.userCount || 0,
          totalEnrollments: 0, // This would need a separate API endpoint
          workshopsThisMonth: basicStats.totalWorkshopsThisYear || 0
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      // Keep default values on error
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Redirect if not admin
  if (!profile || profile.role !== 'admin') {
    return <LoadingScreen message="Verificando permisos de administrador" />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/dashboard"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Dashboard
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Panel de Administración
              </Typography>
              <Chip label="Administrador" color="warning" variant="filled" />
            </Box>
            <Typography variant="body1" color="text.primary">
              Gestiona talleres, usuarios y contenido del sistema
            </Typography>
            {lastUpdated && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Última actualización: {lastUpdated.toLocaleTimeString('es-CL')}
              </Typography>
            )}
          </Box>

          {/* Quick Stats */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Event sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {loading ? <Skeleton width={60} /> : statistics.activeWorkshops}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talleres Activos
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {loading ? <Skeleton width={60} /> : statistics.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Registrados
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Analytics sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {loading ? <Skeleton width={60} /> : statistics.totalEnrollments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inscripciones Totales
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Event sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {loading ? <Skeleton width={60} /> : statistics.workshopsThisMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talleres Este Año
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Management Sections */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 4
          }}>
            {/* Workshop Management */}
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Event sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Gestión de Talleres
                </Typography>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
                Crea, edita y gestiona los talleres disponibles para los usuarios
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/workshops/new"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ px: 3 }}
                >
                  Crear Taller
                </Button>
                <Button
                  component={Link}
                  href="/dashboard/admin/workshops"
                  variant="outlined"
                  sx={{ px: 3 }}
                >
                  Ver Todos
                </Button>
              </Box>
            </Paper>

            {/* User Management */}
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <People sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Gestión de Usuarios
                </Typography>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
                Administra usuarios, perfiles y permisos del sistema
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/users"
                  variant="contained"
                  color="success"
                  sx={{ px: 3 }}
                >
                  Gestionar Usuarios
                </Button>
              </Box>
            </Paper>

            {/* Announcements Management */}
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Announcement sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Gestión de Anuncios
                </Typography>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
                Crea y gestiona anuncios e información importante para los usuarios
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/announcements/new"
                  variant="contained"
                  color="info"
                  startIcon={<Add />}
                  sx={{ px: 3 }}
                >
                  Crear Anuncio
                </Button>
                <Button
                  component={Link}
                  href="/dashboard/admin/announcements"
                  variant="outlined"
                  color="info"
                  sx={{ px: 3 }}
                >
                  Ver Todos
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Analytics */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Analytics sx={{ mr: 2, color: 'info.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Estadísticas y Reportes
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
              Visualiza estadísticas de uso, inscripciones y actividad del sistema
            </Typography>
            <Button
              variant="outlined"
              color="info"
              sx={{ px: 3 }}
              disabled
            >
              Próximamente
            </Button>
          </Paper>
        </MotionDiv>
      </Container>
    </Box>
  );
}