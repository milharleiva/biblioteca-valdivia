'use client';

import { Box, Typography, CircularProgress, Fade, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import { LibraryBooks } from '@mui/icons-material';

// Animación de pulsación para el ícono
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Animación de rotación suave
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'minimal' | 'centered';
}

export function LoadingScreen({
  message = 'Cargando...',
  fullScreen = true,
  variant = 'default'
}: LoadingScreenProps) {

  if (variant === 'minimal') {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        py: 2
      }}>
        <CircularProgress size={24} color="primary" />
        <Typography variant="body2" color="text.primary">
          {message}
        </Typography>
      </Box>
    );
  }

  if (variant === 'centered') {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        py: 8
      }}>
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'primary.main',
              animation: `${rotate} 1s linear infinite`
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <LibraryBooks
              sx={{
                fontSize: 28,
                color: 'primary.main',
                animation: `${pulse} 2s ease-in-out infinite`
              }}
            />
          </Box>
        </Box>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'medium' }}>
          {message}
        </Typography>
      </Box>
    );
  }

  // Default full screen variant
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: fullScreen ? '100vh' : '60vh',
          bgcolor: 'background.default',
          gap: 4,
          px: 2
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 6,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}
        >
          {/* Spinner animado con ícono */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <CircularProgress
              size={80}
              thickness={3}
              sx={{
                color: 'primary.main',
                animation: `${rotate} 1.5s linear infinite`
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <LibraryBooks
                sx={{
                  fontSize: 36,
                  color: 'primary.main',
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              />
            </Box>
          </Box>

          {/* Texto de carga */}
          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontWeight: 'medium',
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>

          {/* Texto secundario */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              maxWidth: 300
            }}
          >
            Por favor espera mientras preparamos todo para ti
          </Typography>

          {/* Indicador de progreso adicional */}
          <Box
            sx={{
              width: 200,
              height: 4,
              bgcolor: 'grey.200',
              borderRadius: 2,
              overflow: 'hidden',
              mt: 1
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 2,
                animation: `${keyframes`
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(0%); }
                  100% { transform: translateX(100%); }
                `} 2s ease-in-out infinite`
              }}
            />
          </Box>
        </Paper>

        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.7 }}>
          <LibraryBooks sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            Biblioteca Municipal de Valdivia
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

export default LoadingScreen;