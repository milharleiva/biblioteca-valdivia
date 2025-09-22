'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Person,
  Phone,
  Home,
  DateRange,
  ContactPhone,
  ContactEmergency
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    birth_date: profile?.birth_date || '',
    emergency_contact: profile?.emergency_contact || '',
    emergency_phone: profile?.emergency_phone || ''
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Perfil actualizado exitosamente');
    } catch {
      setError('Error al actualizar el perfil. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return <LoadingScreen message="Cargando tu perfil" />;
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
              href="/dashboard"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Dashboard
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Mi Perfil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Actualiza tu información personal
            </Typography>
          </Box>

          {/* Profile Form */}
          <Paper elevation={2} sx={{ p: 4 }}>
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: '2rem' }}>
                {formData.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Alerts */}
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

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* First Row - Name and Phone */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3
                }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      value={formData.name}
                      onChange={handleChange('name')}
                      required
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                </Box>

                {/* Second Row - Address (full width) */}
                <Box>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={formData.address}
                    onChange={handleChange('address')}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <Home sx={{ mr: 1, color: 'action.active', mt: 1 }} />
                    }}
                  />
                </Box>

                {/* Third Row - Birth Date and Emergency Contact */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3
                }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Fecha de Nacimiento"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleChange('birth_date')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: <DateRange sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Contacto de Emergencia"
                      value={formData.emergency_contact}
                      onChange={handleChange('emergency_contact')}
                      InputProps={{
                        startAdornment: <ContactEmergency sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                </Box>

                {/* Fourth Row - Emergency Phone */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3
                }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Teléfono de Emergencia"
                      value={formData.emergency_phone}
                      onChange={handleChange('emergency_phone')}
                      InputProps={{
                        startAdornment: <ContactPhone sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                    {/* Empty space for alignment on desktop */}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  component={Link}
                  href="/dashboard"
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