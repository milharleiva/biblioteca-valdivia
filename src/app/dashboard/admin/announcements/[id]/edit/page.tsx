'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';


export default function EditAnnouncementPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 1,
    is_active: true,
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Only create Supabase client on the client side
    if (typeof window !== 'undefined') {
      const client = createClient();
      setSupabase(client);
    }
  }, []);

  useEffect(() => {
    if (profile?.role === 'admin' && announcementId && supabase) {
      fetchAnnouncement();
    }
  }, [profile, announcementId, supabase]);

  const fetchAnnouncement = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', announcementId)
        .single();

      if (error) {
        setError('Error al cargar el anuncio');
        console.error('Error fetching announcement:', error);
      } else if (data) {
        setFormData({
          title: data.title,
          content: data.content,
          type: data.type,
          priority: data.priority,
          is_active: data.is_active,
          start_date: new Date(data.start_date).toISOString().slice(0, 10),
          end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 10) : ''
        });
      }
    } catch (error) {
      setError('Error inesperado al cargar el anuncio');
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('El título y contenido son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        ...formData,
        end_date: formData.end_date || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', announcementId);

      if (error) {
        setError('Error al actualizar el anuncio');
        console.error('Error updating announcement:', error);
      } else {
        router.push('/dashboard/admin/announcements');
      }
    } catch (error) {
      setError('Error inesperado al actualizar el anuncio');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (profile?.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Acceso denegado. Esta página es solo para administradores.</Typography>
      </Box>
    );
  }

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Cargando anuncio...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/dashboard/admin/announcements"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver a Anuncios
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Editar Anuncio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Modifica la información del anuncio
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Paper elevation={2} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Título del Anuncio"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Contenido"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    helperText="Describe el anuncio de manera clara y concisa"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Anuncio</InputLabel>
                      <Select
                        value={formData.type}
                        label="Tipo de Anuncio"
                        onChange={(e) => handleChange('type', e.target.value)}
                      >
                        <MenuItem value="general">General</MenuItem>
                        <MenuItem value="event">Evento</MenuItem>
                        <MenuItem value="important">Importante</MenuItem>
                        <MenuItem value="maintenance">Mantenimiento</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Prioridad</InputLabel>
                      <Select
                        value={formData.priority}
                        label="Prioridad"
                        onChange={(e) => handleChange('priority', e.target.value)}
                      >
                        <MenuItem value={1}>1 - Baja</MenuItem>
                        <MenuItem value={2}>2 - Normal</MenuItem>
                        <MenuItem value={3}>3 - Media</MenuItem>
                        <MenuItem value={4}>4 - Alta</MenuItem>
                        <MenuItem value={5}>5 - Crítica</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Fecha de Inicio"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Fecha de Fin (Opcional)"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="Déjalo vacío si no tiene fecha de expiración"
                    />
                  </Box>
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={(e) => handleChange('is_active', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Anuncio activo"
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      component={Link}
                      href="/dashboard/admin/announcements"
                      variant="outlined"
                      startIcon={<Cancel />}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Paper>
        </MotionDiv>
      </Container>
    </Box>
  );
}