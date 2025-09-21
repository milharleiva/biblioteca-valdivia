'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  ArrowBack,
  People
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
  is_active: boolean;
  created_at: string;
}

export default function AdminWorkshopsPage() {
  const { profile } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; workshop: Workshop | null }>({
    open: false,
    workshop: null
  });
  const [error, setError] = useState('');

  const supabase = createClient();

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Error al cargar los talleres');
        console.error('Error fetching workshops:', error);
      } else {
        setWorkshops(data || []);
      }
    } catch (error) {
      setError('Error inesperado al cargar los talleres');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.workshop) return;

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', deleteDialog.workshop.id);

      if (error) {
        setError('Error al eliminar el taller');
        console.error('Error deleting workshop:', error);
      } else {
        fetchWorkshops(); // Refresh the list
        setDeleteDialog({ open: false, workshop: null });
      }
    } catch (error) {
      setError('Error inesperado al eliminar el taller');
      console.error('Error:', error);
    }
  };

  const toggleWorkshopStatus = async (workshop: Workshop) => {
    try {
      const { error } = await supabase
        .from('workshops')
        .update({ is_active: !workshop.is_active })
        .eq('id', workshop.id);

      if (error) {
        setError('Error al actualizar el estado del taller');
        console.error('Error updating workshop:', error);
      } else {
        fetchWorkshops(); // Refresh the list
      }
    } catch (error) {
      setError('Error inesperado al actualizar el taller');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchWorkshops();
    }
  }, [profile]);

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
        <Typography>Cargando talleres...</Typography>
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
              href="/dashboard/admin"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Panel Admin
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Gestión de Talleres
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Administra todos los talleres del sistema
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/dashboard/admin/workshops/new"
                variant="contained"
                startIcon={<Add />}
                size="large"
              >
                Crear Nuevo Taller
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Workshops Table */}
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Taller</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Instructor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Participantes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fechas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workshops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No hay talleres creados aún
                        </Typography>
                        <Button
                          component={Link}
                          href="/dashboard/admin/workshops/new"
                          variant="contained"
                          startIcon={<Add />}
                          sx={{ mt: 2 }}
                        >
                          Crear Primer Taller
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    workshops.map((workshop) => (
                      <TableRow key={workshop.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {workshop.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {workshop.location}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{workshop.instructor}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People fontSize="small" color="action" />
                            {workshop.current_participants}/{workshop.max_participants}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {new Date(workshop.start_date).toLocaleDateString('es-ES')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {workshop.schedule}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={workshop.is_active ? 'Activo' : 'Inactivo'}
                            color={workshop.is_active ? 'success' : 'default'}
                            size="small"
                            onClick={() => toggleWorkshopStatus(workshop)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              component={Link}
                              href={`/dashboard/admin/workshops/${workshop.id}`}
                              size="small"
                              color="info"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              component={Link}
                              href={`/dashboard/admin/workshops/${workshop.id}/edit`}
                              size="small"
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, workshop })}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </MotionDiv>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, workshop: null })}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar el taller &quot;{deleteDialog.workshop?.title}&quot;?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, workshop: null })}>
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}