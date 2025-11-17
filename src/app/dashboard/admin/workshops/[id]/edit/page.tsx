'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Switch,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Event,
  Person,
  LocationOn,
  Description,
  Groups,
  PhotoCamera,
  Category
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  max_participants: number;
  start_date: string;
  end_date: string;
  schedule: string;
  location: string;
  image_url?: string;
  requirements?: string;
  is_active: boolean;
}

export default function EditWorkshopPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workshopId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'general',
    maxParticipants: 20,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    location: '',
    imageFile: null as File | null,
    isActive: true
  });

  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Only create Supabase client on the client side
    if (typeof window !== 'undefined') {
      const client = createClient();
      setSupabase(client);
    }
  }, []);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops?id=${workshopId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        console.log('Workshop data from API:', data); // Debug log
        setWorkshop(data);

        // Extract date and time from datetime strings
        let startDate = '';
        let startTime = '09:00';
        let endDate = '';
        let endTime = '17:00';

        if (data.startDate) {
          const startDateTime = new Date(data.startDate);
          if (!isNaN(startDateTime.getTime())) {
            startDate = startDateTime.toISOString().split('T')[0];
            startTime = startDateTime.toTimeString().slice(0, 5);
          }
        }

        if (data.endDate) {
          const endDateTime = new Date(data.endDate);
          if (!isNaN(endDateTime.getTime())) {
            endDate = endDateTime.toISOString().split('T')[0];
            endTime = endDateTime.toTimeString().slice(0, 5);
          }
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          instructor: data.instructor || '',
          category: data.category || 'general',
          maxParticipants: data.maxParticipants || 20,
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          location: data.location || '',
          imageFile: null,
          isActive: data.isActive ?? true
        });
      } else {
        setError('Error al cargar el taller');
        console.error('Error fetching workshop:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al cargar el taller');
      console.error('Error:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    let value: any = target.value;

    if (field === 'maxParticipants') {
      // Solo permitir números y convertir a número
      const numericValue = target.value.replace(/[^0-9]/g, '');
      value = numericValue === '' ? '' : parseInt(numericValue) || '';
    } else if (field === 'isActive') {
      value = target.checked;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      imageFile: file
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validations
    if (!formData.title || !formData.description || !formData.instructor || !formData.location) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    // Validar número de participantes
    const maxParticipants = parseInt(formData.maxParticipants.toString()) || 0;
    if (maxParticipants < 1) {
      setError('El número máximo de participantes debe ser al menos 1.');
      setLoading(false);
      return;
    }

    // Combine date and time for validation
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      setError('La fecha y hora de inicio debe ser anterior a la fecha y hora de finalización.');
      setLoading(false);
      return;
    }

    try {
      // Upload image if provided
      let imageUrl = '';
      if (formData.imageFile && supabase) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `workshop-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('workshops')
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          const { data } = supabase.storage.from('workshops').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      const workshopData = {
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        category: formData.category,
        max_participants: maxParticipants,
        start_date: `${formData.startDate}T${formData.startTime}:00`,
        end_date: `${formData.endDate}T${formData.endTime}:00`,
        schedule: `${formData.startTime} - ${formData.endTime}`,
        location: formData.location,
        image_url: imageUrl,
        is_active: formData.isActive
      };

      const response = await fetch('/api/workshops', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: workshopId,
          ...workshopData
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('¡Taller actualizado exitosamente!');
        setTimeout(() => {
          router.push('/dashboard/admin/workshops');
        }, 2000);
      } else {
        setError('Error al actualizar el taller. Por favor intenta nuevamente.');
        console.error('Error updating workshop:', result.error);
      }
    } catch (error) {
      setError('Error inesperado al actualizar el taller.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workshopId && profile?.role === 'admin') {
      fetchWorkshop();
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

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando taller...</Typography>
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
              href="/dashboard/admin/workshops"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver a Talleres
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Editar Taller
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Modifica la información del taller
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
                    type="text"
                    value={formData.maxParticipants}
                    onChange={handleChange('maxParticipants')}
                    required
                    placeholder="Ej: 20"
                    helperText="Solo se permiten números (mínimo 1)"
                    InputProps={{
                      startAdornment: <Groups sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>


                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleSelectChange('category')}
                    startAdornment={<Category sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="tecnologia">Tecnología</MenuItem>
                    <MenuItem value="arte">Arte</MenuItem>
                    <MenuItem value="literatura">Literatura</MenuItem>
                    <MenuItem value="educacion">Educación</MenuItem>
                    <MenuItem value="cultura">Cultura</MenuItem>
                  </Select>
                </FormControl>

                {/* Fechas */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Fecha de Inicio"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange('startDate')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Selecciona la fecha de inicio del taller"
                  />

                  <TextField
                    fullWidth
                    label="Fecha de Finalización"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange('endDate')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Selecciona la fecha de finalización del taller"
                  />
                </Box>

                {/* Horarios */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Hora de Inicio"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange('startTime')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Hora de inicio del taller"
                  />

                  <TextField
                    fullWidth
                    label="Hora de Finalización"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange('endTime')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Hora de finalización del taller"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
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

                {/* Imagen Upload */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Imagen del Taller (opcional)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      sx={{ minWidth: 140 }}
                    >
                      Subir Imagen
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {formData.imageFile && (
                      <Typography variant="body2" color="success.main">
                        {formData.imageFile.name}
                      </Typography>
                    )}
                  </Box>
                </Box>


                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange('isActive')}
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
                  {loading ? 'Actualizando...' : 'Actualizar Taller'}
                </Button>
                <Button
                  component={Link}
                  href="/dashboard/admin/workshops"
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