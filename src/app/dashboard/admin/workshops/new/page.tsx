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
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  School,
  Category,
  AttachMoney
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
    instructorBio: '',
    category: 'GENERAL',
    maxParticipants: 20,
    startDate: '',
    endDate: '',
    location: '',
    imageFile: null as File | null,
    requirements: '',
    materials: '',
    targetAudience: '',
    difficultyLevel: 'BEGINNER',
    price: 0,
    isActive: true
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

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = field === 'maxParticipants' || field === 'price' ? parseFloat(target.value) || 0 :
                  field === 'isActive' ? target.checked :
                  target.value;

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

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La fecha de inicio debe ser anterior a la fecha de finalización.');
      setLoading(false);
      return;
    }

    try {
      // Upload image if provided
      let imageUrl = '';
      if (formData.imageFile) {
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
        instructor_bio: formData.instructorBio,
        category: formData.category,
        max_participants: formData.maxParticipants,
        start_date: formData.startDate,
        end_date: formData.endDate,
        location: formData.location,
        image_url: imageUrl,
        requirements: formData.requirements,
        materials: formData.materials,
        target_audience: formData.targetAudience,
        difficulty_level: formData.difficultyLevel,
        price: formData.price,
        is_active: formData.isActive,
        created_by: user?.id
      };

      const { error } = await supabase
        .from('workshops')
        .insert(workshopData);

      if (error) {
        setError('Error al crear el taller. Por favor intenta nuevamente.');
        console.error('Error creating workshop:', error);
      } else {
        setSuccess('¡Taller creado exitosamente!');
        setTimeout(() => {
          router.push('/dashboard/admin/workshops');
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
              href="/dashboard/admin/workshops"
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
                    value={formData.maxParticipants}
                    onChange={handleChange('maxParticipants')}
                    required
                    InputProps={{
                      startAdornment: <Groups sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Biografía del Instructor (opcional)"
                  value={formData.instructorBio}
                  onChange={handleChange('instructorBio')}
                  multiline
                  rows={2}
                  placeholder="Breve descripción del instructor..."
                />

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleSelectChange('category')}
                      startAdornment={<Category sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="GENERAL">General</MenuItem>
                      <MenuItem value="TECHNOLOGY">Tecnología</MenuItem>
                      <MenuItem value="ART">Arte</MenuItem>
                      <MenuItem value="LITERATURE">Literatura</MenuItem>
                      <MenuItem value="EDUCATION">Educación</MenuItem>
                      <MenuItem value="CULTURE">Cultura</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Nivel de Dificultad</InputLabel>
                    <Select
                      value={formData.difficultyLevel}
                      onChange={handleSelectChange('difficultyLevel')}
                      startAdornment={<School sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="BEGINNER">Principiante</MenuItem>
                      <MenuItem value="INTERMEDIATE">Intermedio</MenuItem>
                      <MenuItem value="ADVANCED">Avanzado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Fecha y Hora de Inicio"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange('startDate')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Fecha y Hora de Finalización"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange('endDate')}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
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

                  <TextField
                    fullWidth
                    label="Precio (opcional)"
                    type="number"
                    value={formData.price}
                    onChange={handleChange('price')}
                    inputProps={{ step: '0.01', min: '0' }}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ mr: 1, color: 'action.active' }} />
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

                <TextField
                  fullWidth
                  label="Requisitos (opcional)"
                  value={formData.requirements}
                  onChange={handleChange('requirements')}
                  multiline
                  rows={2}
                  placeholder="Ej: Conocimientos básicos de..."
                />

                <TextField
                  fullWidth
                  label="Materiales (opcional)"
                  value={formData.materials}
                  onChange={handleChange('materials')}
                  multiline
                  rows={2}
                  placeholder="Ej: Cuaderno, lápiz, laptop..."
                />

                <TextField
                  fullWidth
                  label="Público Objetivo (opcional)"
                  value={formData.targetAudience}
                  onChange={handleChange('targetAudience')}
                  placeholder="Ej: Estudiantes, adultos mayores, profesionales..."
                />

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
                  {loading ? 'Creando...' : 'Crear Taller'}
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