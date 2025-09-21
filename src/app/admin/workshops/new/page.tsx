'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Event,
  Person,
  LocationOn,
  Schedule,
  Description,
  Groups
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

export default function NewWorkshopPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    max_participants: 20,
    start_date: '',
    end_date: '',
    schedule: '',
    location: '',
    image_url: '',
    requirements: '',
    is_active: true
  });

  const supabase = createClient();

  // Redirect if not admin
  if (profile?.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Acceso denegado. Esta página es solo para administradores.</Typography>
      </Box>
    );
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'max_participants' ? parseInt(e.target.value) || 0 :
                  field === 'is_active' ? e.target.checked :
                  e.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validations
    if (!formData.title || !formData.description || !formData.instructor) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('La fecha de inicio debe ser anterior a la fecha de finalización.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('workshops')
        .insert({
          ...formData,
          created_by: user?.id
        });

      if (error) {
        setError('Error al crear el taller. Por favor intenta nuevamente.');
        console.error('Error creating workshop:', error);
      } else {
        setSuccess('¡Taller creado exitosamente!');
        setTimeout(() => {
          router.push('/admin/workshops');
        }, 2000);
      }
    } catch (error) {
      setError('Error inesperado al crear el taller.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
              href="/admin/workshops"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver a Talleres
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Crear Nuevo Taller
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completa la información del taller
            </Typography>
          </Box>

          {/* Form */}
          <Paper elevation={2} sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Título del Taller"
                  value={formData.title}
                  onChange={handleChange('title')}
                  required
                  InputProps={{
                    startAdornment: <Event sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={handleChange('description')}
                  required
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, color: 'action.active', mt: 1 }} />
                  }}
                />

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Instructor"
                    value={formData.instructor}
                    onChange={handleChange('instructor')}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Máximo de Participantes"
                    type="number"
                    value={formData.max_participants}
                    onChange={handleChange('max_participants')}
                    required
                    InputProps={{
                      startAdornment: <Groups sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Fecha de Inicio"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={handleChange('start_date')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Fecha de Finalización"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={handleChange('end_date')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Horario"
                    value={formData.schedule}
                    onChange={handleChange('schedule')}
                    placeholder="Ej: Lunes y Miércoles 16:00-18:00"
                    required
                    InputProps={{
                      startAdornment: <Schedule sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Ubicación"
                    value={formData.location}
                    onChange={handleChange('location')}
                    required
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="URL de Imagen (opcional)"
                  value={formData.image_url}
                  onChange={handleChange('image_url')}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />

                <TextField
                  fullWidth
                  label="Requisitos (opcional)"
                  value={formData.requirements}
                  onChange={handleChange('requirements')}
                  multiline
                  rows={3}
                  placeholder="Ej: Traer cuaderno y lápiz, conocimientos básicos..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleChange('is_active')}
                      color="primary"
                    />
                  }
                  label="Taller activo (visible para usuarios)"
                />
              </Box>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Creando...' : 'Crear Taller'}
                </Button>
                <Button
                  component={Link}
                  href="/admin/workshops"
                  variant="outlined"
                  sx={{ px: 4 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Paper>
        </MotionDiv>
      </Container>
    </Box>
  );
}