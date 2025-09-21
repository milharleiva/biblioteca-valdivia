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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowBack,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'important' | 'maintenance';
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementsPage() {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; announcement: Announcement | null }>({
    open: false,
    announcement: null
  });

  const supabase = createClient();

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAnnouncements();
    }
  }, [profile]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        // Only show error if it's not a "table doesn't exist" error
        if (error.code !== 'PGRST116') {
          setError('Error al cargar los anuncios');
        }
      } else {
        setAnnouncements(data || []);
      }
    } catch (error) {
      setError('Error inesperado al cargar los anuncios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnnouncementStatus = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);

      if (error) {
        setError('Error al actualizar el anuncio');
        console.error('Error updating announcement:', error);
      } else {
        fetchAnnouncements();
      }
    } catch (error) {
      setError('Error inesperado al actualizar el anuncio');
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.announcement) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', deleteDialog.announcement.id);

      if (error) {
        setError('Error al eliminar el anuncio');
        console.error('Error deleting announcement:', error);
      } else {
        fetchAnnouncements();
        setDeleteDialog({ open: false, announcement: null });
      }
    } catch (error) {
      setError('Error inesperado al eliminar el anuncio');
      console.error('Error:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important': return 'error';
      case 'event': return 'success';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'important': return 'Importante';
      case 'event': return 'Evento';
      case 'maintenance': return 'Mantenimiento';
      default: return 'General';
    }
  };

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
        <Typography>Cargando anuncios...</Typography>
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
              href="/admin"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Panel Admin
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Gestión de Anuncios
              </Typography>
              <Button
                component={Link}
                href="/admin/announcements/new"
                variant="contained"
                startIcon={<Add />}
                size="large"
              >
                Crear Anuncio
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Administra los anuncios e información importante para los usuarios
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Announcements Table */}
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Prioridad</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha Fin</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                          {announcement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {announcement.content.length > 100
                            ? `${announcement.content.substring(0, 100)}...`
                            : announcement.content
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(announcement.type)}
                          color={getTypeColor(announcement.type) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Prioridad ${announcement.priority}`}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={announcement.is_active ? 'Activo' : 'Inactivo'}
                          color={announcement.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(announcement.start_date), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell>
                        {announcement.end_date
                          ? format(new Date(announcement.end_date), 'dd/MM/yyyy HH:mm', { locale: es })
                          : 'Sin fecha fin'
                        }
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleAnnouncementStatus(announcement)}
                            color={announcement.is_active ? 'default' : 'success'}
                          >
                            {announcement.is_active ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                          <IconButton
                            component={Link}
                            href={`/admin/announcements/${announcement.id}/edit`}
                            size="small"
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, announcement })}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {announcements.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No hay anuncios creados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Crea tu primer anuncio para compartir información importante
                </Typography>
                <Button
                  component={Link}
                  href="/admin/announcements/new"
                  variant="contained"
                  startIcon={<Add />}
                >
                  Crear Primer Anuncio
                </Button>
              </Box>
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, announcement: null })}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que quieres eliminar el anuncio &quot;{deleteDialog.announcement?.title}&quot;?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Esta acción no se puede deshacer.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, announcement: null })}>
                Cancelar
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </MotionDiv>
      </Container>
    </Box>
  );
}