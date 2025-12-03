'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  InputAdornment
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { MotionDiv } from '@/components/MotionWrapper';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError('Ocurrió un error al enviar el correo. Por favor verifica que el email sea correcto.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Ocurrió un error inesperado. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Container maxWidth="sm">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={8} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 2 }}>
                ¡Correo Enviado!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => router.push('/auth/login')}
                >
                  Volver al Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                >
                  Enviar Otro Correo
                </Button>
              </Box>
            </Paper>
          </MotionDiv>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                Recuperar Contraseña
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 3, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Enviando correo...' : 'Enviar Enlace de Recuperación'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Recordaste tu contraseña?{' '}
                  <Link href="/auth/login" passHref>
                    <MuiLink component="span" sx={{ fontWeight: 'medium' }}>
                      Inicia sesión aquí
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </MotionDiv>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link href="/" passHref>
            <MuiLink
              component="span"
              sx={{
                color: 'white',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ← Volver al inicio
            </MuiLink>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}