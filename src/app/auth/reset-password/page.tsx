'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import Link from 'next/link';
import { MotionDiv } from '@/components/MotionWrapper';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Verificar si hay una sesión de recuperación válida
    const checkSession = async () => {
      try {
        // Primero, verificar si hay tokens de recuperación en la URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        // Si hay tokens en la URL, establecer la sesión
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('🔄 Estableciendo sesión desde tokens de URL...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Error estableciendo sesión:', error);
            setValidSession(false);
            return;
          }

          if (data.session) {
            console.log('✅ Sesión de recuperación establecida exitosamente');
            setValidSession(true);
            // Limpiar la URL de los parámetros para mejor UX
            window.history.replaceState({}, document.title, '/auth/reset-password');
            return;
          }
        }

        // Si no hay tokens en la URL, verificar sesión existente
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.log('❌ No hay sesión válida');
          setValidSession(false);
          return;
        }

        console.log('✅ Sesión existente válida');
        setValidSession(true);
      } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        setValidSession(false);
      }
    };

    checkSession();
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError('Ocurrió un error al actualizar la contraseña. Por favor intenta nuevamente.');
      } else {
        setSuccess(true);
        // Redirigir al login después de unos segundos
        setTimeout(() => {
          router.push('/auth/login?message=password-updated');
        }, 3000);
      }
    } catch {
      setError('Ocurrió un error inesperado. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras verificamos la sesión
  if (validSession === null) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Verificando sesión...
        </Typography>
      </Box>
    );
  }

  // Si no hay sesión válida, mostrar error
  if (!validSession) {
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
            <Paper elevation={8} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', mb: 2 }}>
                Enlace Inválido
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                El enlace de recuperación de contraseña ha expirado o no es válido.
                Por favor solicita un nuevo enlace.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/forgot-password')}
                sx={{ mr: 2 }}
              >
                Solicitar Nuevo Enlace
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/auth/login')}
              >
                Ir al Login
              </Button>
            </Paper>
          </MotionDiv>
        </Container>
      </Box>
    );
  }

  // Si se actualizó exitosamente
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
                ¡Contraseña Actualizada!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Tu contraseña ha sido actualizada exitosamente.
                Serás redirigido al login en unos segundos.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/login')}
              >
                Ir al Login Ahora
              </Button>
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
                Nueva Contraseña
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ingresa tu nueva contraseña
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
                label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
                {loading ? 'Actualizando contraseña...' : 'Actualizar Contraseña'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Cargando...
        </Typography>
      </Box>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}