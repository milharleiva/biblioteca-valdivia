'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Event,
  Person,
  LocationOn,
  Schedule,
  Groups,
  CalendarMonth,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

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
  isActive: boolean;
  _count?: {
    enrollments: number;
  };
}

interface Enrollment {
  workshop_id: string;
  status: string;
}

export default function WorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [enrollDialog, setEnrollDialog] = useState<{ open: boolean; workshop: Workshop | null }>({
    open: false,
    workshop: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    fetchWorkshops();
    if (user) {
      fetchUserEnrollments();
    }
  }, [user]);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops');
      const result = await response.json();

      if (result.success) {
        // Filtrar talleres que aún no han terminado
        const currentDate = new Date();
        const activeWorkshops = result.data.filter((workshop: Record<string, unknown>) =>
          new Date(workshop.endDate as string) >= currentDate
        );

        setWorkshops(activeWorkshops);
      } else {
        setError('Error al cargar los talleres');
        console.error('Error fetching workshops:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al cargar los talleres');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    if (!user) {
      setEnrollmentsLoading(false);
      return;
    }

    setEnrollmentsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/enrollments`);
      const result = await response.json();

      if (result.success) {
        setEnrollments(result.data || []);
      } else {
        console.error('Error fetching enrollments:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const isEnrolled = (workshopId: string) => {
    return enrollments.some(enrollment =>
      enrollment.workshop_id === workshopId && enrollment.status === 'enrolled'
    );
  };

  const canEnroll = (workshop: Workshop) => {
    // Don't allow enrollment if enrollments are still loading to prevent race conditions
    if (enrollmentsLoading) return false;
    return (workshop._count?.enrollments || 0) < workshop.maxParticipants && !isEnrolled(workshop.id);
  };

  const handleEnroll = async () => {
    if (!enrollDialog.workshop || !user) return;

    // Double-check enrollment status before making API call
    if (isEnrolled(enrollDialog.workshop.id)) {
      setError('Ya estás inscrito en este taller');
      setEnrollDialog({ open: false, workshop: null });
      return;
    }

    try {
      const response = await fetch(`/api/workshops/${enrollDialog.workshop.id}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Error al inscribirse al taller');
        // Only log to console if it's not a user validation error
        if (result.error !== 'Ya estás inscrito en este taller' && result.error !== 'Este taller ya está lleno') {
          console.error('Error enrolling:', result.error);
        }
      } else {
        setSuccess('¡Te has inscrito exitosamente al taller!');
        fetchWorkshops(); // Refresh to update participant count
        fetchUserEnrollments(); // Refresh enrollments
        setEnrollDialog({ open: false, workshop: null });
      }
    } catch (error) {
      setError('Error inesperado al inscribirse');
      console.error('Error:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Talleres Disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Inicia sesión para ver los talleres disponibles e inscribirte
            </Typography>
            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              size="large"
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 3,
          p: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              border: '3px solid',
              borderColor: 'primary.main',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Cargando talleres...
          </Typography>
        </Box>
      </Box>
    );
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
              href="/"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Inicio
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Talleres Disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Descubre y únete a nuestros talleres culturales
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Workshops Grid */}
          {workshops.length === 0 ? (
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 4
              }}
            >
              {workshops.map((workshop, index) => (
                  <MotionDiv
                    key={workshop.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': { elevation: 4 }
                      }}
                    >
                      {workshop.imageUrl && (
                        <Box
                          sx={{
                            height: 200,
                            backgroundImage: `url(${workshop.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      )}

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {workshop.title}
                          </Typography>
                          {isEnrolled(workshop.id) && (
                            <Chip
                              label="Inscrito"
                              color="success"
                              size="small"
                              icon={<CheckCircle />}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                          {workshop.description}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="body2">
                              Instructor: {workshop.instructor}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonth fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(workshop.startDate).toLocaleDateString('es-ES')} - {' '}
                              {new Date(workshop.endDate).toLocaleDateString('es-ES')}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2">
                              {workshop.schedule}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">
                              {workshop.location}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Groups fontSize="small" color="action" />
                            <Typography variant="body2">
                              {workshop._count?.enrollments || 0}/{workshop.maxParticipants} participantes
                            </Typography>
                          </Box>
                        </Box>

                        {workshop.requirements && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                              Requisitos:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {workshop.requirements}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        {isEnrolled(workshop.id) ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            color="success"
                            startIcon={<CheckCircle />}
                            disabled
                          >
                            Ya estás inscrito
                          </Button>
                        ) : canEnroll(workshop) ? (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setEnrollDialog({ open: true, workshop })}
                          >
                            Inscribirse
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                          >
                            Cupos agotados
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </MotionDiv>
              ))}
            </Box>
          )}
        </MotionDiv>

        {/* Enrollment Confirmation Dialog */}
        <Dialog
          open={enrollDialog.open}
          onClose={() => setEnrollDialog({ open: false, workshop: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirmar Inscripción</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              ¿Estás seguro de que quieres inscribirte al taller &quot;{enrollDialog.workshop?.title}&quot;?
            </Typography>

            {enrollDialog.workshop && (
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Instructor:</strong> {enrollDialog.workshop.instructor}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Horario:</strong> {enrollDialog.workshop.schedule}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Ubicación:</strong> {enrollDialog.workshop.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Fechas:</strong> {new Date(enrollDialog.workshop.startDate).toLocaleDateString('es-ES')} - {new Date(enrollDialog.workshop.endDate).toLocaleDateString('es-ES')}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEnrollDialog({ open: false, workshop: null })}>
              Cancelar
            </Button>
            <Button onClick={handleEnroll} variant="contained">
              Confirmar Inscripción
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}