'use client';

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
  CardActions,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Person,
  AdminPanelSettings,
  Event,
  LibraryBooks,
  Settings,
  ExitToApp,
  Home,
  ArrowBack
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) {
    return <LoadingScreen message="Cargando tu dashboard" />;
  }

  const isAdmin = profile.role === 'admin';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container maxWidth="xl">
          {/* Botón Volver al Inicio */}
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Volver al Inicio
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.dark' }}>
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ¡Bienvenido, {profile.name}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Chip
                    label={isAdmin ? 'Administrador' : 'Usuario'}
                    color={isAdmin ? 'warning' : 'success'}
                    icon={isAdmin ? <AdminPanelSettings /> : <Person />}
                    variant="filled"
                    sx={{ color: 'white' }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={signOut}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Quick Actions */}
          <Box>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Acciones Rápidas
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Mi Perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actualiza tu información personal
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      component={Link}
                      href="/profile"
                      variant="contained"
                      size="small"
                      startIcon={<Settings />}
                    >
                      Gestionar
                    </Button>
                  </CardActions>
                </Card>

                <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Event sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Talleres
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explora y únete a talleres
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      component={Link}
                      href="/workshops"
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<Event />}
                    >
                      Ver Talleres
                    </Button>
                  </CardActions>
                </Card>

                <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <LibraryBooks sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Catálogo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Busca libros en nuestro catálogo
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      component={Link}
                      href="/buscar-libros"
                      variant="contained"
                      size="small"
                      color="info"
                      startIcon={<LibraryBooks />}
                    >
                      Buscar
                    </Button>
                  </CardActions>
                </Card>

                {isAdmin && (
                  <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <AdminPanelSettings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Admin
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Panel de administración
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button
                        component={Link}
                        href="/dashboard/admin"
                        variant="contained"
                        size="small"
                        color="warning"
                        startIcon={<AdminPanelSettings />}
                      >
                        Administrar
                      </Button>
                    </CardActions>
                  </Card>
                )}
              </Box>
            </MotionDiv>
          </Box>

          {/* Recent Activity and Profile Summary */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
            <Box>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Actividad Reciente
                </Typography>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay actividad reciente para mostrar.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Tus inscripciones a talleres y actividades aparecerán aquí.
                  </Typography>
                </Box>
              </Paper>
            </MotionDiv>
            </Box>

            {/* Profile Summary */}
            <Box>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Resumen del Perfil
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nombre
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile.name}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {user.email}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile.phone || 'No especificado'}
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  href="/profile"
                  variant="outlined"
                  fullWidth
                  startIcon={<Settings />}
                >
                  Editar Perfil
                </Button>
              </Paper>
            </MotionDiv>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}