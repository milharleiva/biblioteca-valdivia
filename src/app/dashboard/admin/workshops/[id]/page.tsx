'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Person,
  LocationOn,
  Schedule,
  Groups,
  CalendarMonth,
  Phone,
  Delete,
  CheckCircle
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

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
  created_at: string;
}

interface Participant {
  id: string;
  userId: string;
  workshopId: string;
  status: string;
  enrollmentDate: string;
  user: {
    id: string;
    name: string;
    phone?: string;
    email: string;
  };
}

export default function WorkshopDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const workshopId = params?.id as string;

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; participant: Participant | null }>({
    open: false,
    participant: null
  });


  const fetchWorkshopDetails = async () => {
    try {
      const response = await fetch(`/api/workshops?id=${workshopId}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Map Prisma fields to the expected interface
        const workshopData = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          instructor: result.data.instructor,
          max_participants: result.data.maxParticipants,
          current_participants: result.data.currentParticipants || 0,
          start_date: result.data.startDate,
          end_date: result.data.endDate,
          schedule: result.data.schedule || '',
          location: result.data.location,
          image_url: result.data.imageUrl,
          requirements: result.data.requirements,
          is_active: result.data.isActive,
          created_at: result.data.createdAt
        };
        setWorkshop(workshopData);
      } else {
        setError('Error al cargar el taller');
        console.error('Error fetching workshop:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al cargar el taller');
      console.error('Error:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/enrollments`);
      const result = await response.json();

      if (result.success) {
        // Use the API response directly with Prisma structure
        setParticipants(result.data);
      } else {
        setError('Error al cargar los participantes');
        console.error('Error fetching participants:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al cargar los participantes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async () => {
    if (!removeDialog.participant) return;

    try {
      const response = await fetch(`/api/workshops/${workshopId}/enrollments?enrollmentId=${removeDialog.participant.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        fetchParticipants(); // Refresh the list
        fetchWorkshopDetails(); // Refresh workshop to update participant count
        setRemoveDialog({ open: false, participant: null });
      } else {
        setError('Error al remover participante');
        console.error('Error removing participant:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al remover participante');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (workshopId && profile?.role === 'admin') {
      fetchWorkshopDetails();
      fetchParticipants();
    }
  }, [workshopId, profile]);

  // Redirect if not admin
  if (profile?.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Acceso denegado. Esta página es solo para administradores.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando detalles del taller...</Typography>
      </Box>
    );
  }

  if (!workshop) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Taller no encontrado</Typography>
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
              href="/dashboard/admin/workshops"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver a Talleres
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {workshop.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={workshop.is_active ? 'Activo' : 'Inactivo'}
                    color={workshop.is_active ? 'success' : 'default'}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {participants.length}/{workshop.max_participants} participantes
                  </Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href={`/dashboard/admin/workshops/${workshop.id}/edit`}
                variant="contained"
                startIcon={<Edit />}
              >
                Editar Taller
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '5fr 7fr' },
              gap: 4
            }}
          >
            {/* Workshop Details */}
            <Box>
              <Card elevation={2}>
                {workshop.image_url && (
                  <Box
                    sx={{
                      height: 250,
                      backgroundImage: `url(${workshop.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Información del Taller
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Instructor:</strong> {workshop.instructor}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Fechas:</strong> {new Date(workshop.start_date).toLocaleDateString('es-ES')} - {new Date(workshop.end_date).toLocaleDateString('es-ES')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Horario:</strong> {workshop.schedule}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Ubicación:</strong> {workshop.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Groups fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Capacidad:</strong> {workshop.max_participants} participantes
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                    <strong>Descripción:</strong><br />
                    {workshop.description}
                  </Typography>

                  {workshop.requirements && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                        Requisitos:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {workshop.requirements}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Participants List */}
            <Box>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Participantes Inscritos ({participants.length})
                  </Typography>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${participants.length}/${workshop.max_participants}`}
                    color={participants.length >= workshop.max_participants ? 'error' : 'success'}
                    variant="outlined"
                  />
                </Box>

                {participants.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Groups sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No hay participantes inscritos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Los usuarios inscritos aparecerán aquí
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Participante</TableCell>
                          <TableCell>Contacto</TableCell>
                          <TableCell>Fecha de Inscripción</TableCell>
                          <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                                >
                                  {participant.user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="subtitle2">
                                  {participant.user.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {participant.user.phone && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      {participant.user.phone}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(participant.enrollmentDate).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => setRemoveDialog({ open: true, participant })}
                              >
                                Remover
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Box>
          </Box>
        </MotionDiv>

        {/* Remove Participant Dialog */}
        <Dialog
          open={removeDialog.open}
          onClose={() => setRemoveDialog({ open: false, participant: null })}
        >
          <DialogTitle>Confirmar Remoción</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres remover a {removeDialog.participant?.user.name} del taller?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoveDialog({ open: false, participant: null })}>
              Cancelar
            </Button>
            <Button onClick={handleRemoveParticipant} color="error" variant="contained">
              Remover
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}