'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import {
  MenuBook,
  Login,
  PersonAdd,
  AccountCircle,
  Dashboard,
  Event,
  ExitToApp,
  AdminPanelSettings,
  Phone,
  Email,
  AccessTime
} from '@mui/icons-material';
import { MotionHeader, MotionDiv } from './MotionWrapper';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
  };

  return (
    <MotionHeader
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 2 }}>
        {/* Top info bar */}
        <Box sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">(63) 221-1234</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">biblioteca@valdivia.cl</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Lun-Vie 9:00-18:00</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Gobierno de Chile - Municipalidad de Valdivia
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Main header */}
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
            {/* Logo and title */}
            <MotionDiv
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    size="large"
                  >
                    <MenuBook sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Box>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.2 }}>
                      Biblioteca Municipal
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                      Valdivia
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </MotionDiv>

            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {[
                { href: '/', label: 'Inicio' },
                { href: '/workshops', label: 'Talleres' },
                { href: '/buscar-libros', label: 'Buscar Libros' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/sobre-nosotros', label: 'Nosotros' }
              ].map((item) => (
                <MotionDiv
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    href={item.href}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'primary.50'
                      },
                      px: 2,
                      py: 1
                    }}
                  >
                    {item.label}
                  </Button>
                </MotionDiv>
              ))}
            </Box>

            {/* Auth buttons / User menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!user ? (
                // Not logged in - show login/register buttons
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      href="/auth/login"
                      variant="outlined"
                      startIcon={<Login />}
                      size="small"
                      sx={{ px: 2 }}
                    >
                      Iniciar Sesión
                    </Button>
                  </MotionDiv>
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      href="/auth/register"
                      variant="contained"
                      startIcon={<PersonAdd />}
                      size="small"
                      sx={{ px: 2 }}
                    >
                      Registrarse
                    </Button>
                  </MotionDiv>
                </Box>
              ) : (
                // Logged in - show user menu
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {profile?.role === 'admin' && (
                    <Chip
                      label="Admin"
                      color="warning"
                      size="small"
                      icon={<AdminPanelSettings />}
                    />
                  )}
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{
                        p: 0.5,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'primary.main'
                        }}
                      >
                        {profile?.name?.charAt(0).toUpperCase() || <AccountCircle />}
                      </Avatar>
                    </IconButton>
                  </MotionDiv>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: { mt: 1, minWidth: 200 }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {profile?.name || 'Usuario'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem component={Link} href="/dashboard" onClick={handleMenuClose}>
                      <Dashboard sx={{ mr: 2 }} />
                      Mi Cuenta
                    </MenuItem>
                    <MenuItem component={Link} href="/profile" onClick={handleMenuClose}>
                      <AccountCircle sx={{ mr: 2 }} />
                      Mi Perfil
                    </MenuItem>
                    <MenuItem component={Link} href="/workshops" onClick={handleMenuClose}>
                      <Event sx={{ mr: 2 }} />
                      Mis Talleres
                    </MenuItem>
                    {profile?.role === 'admin' && (
                      <>
                        <Divider />
                        <MenuItem component={Link} href="/admin" onClick={handleMenuClose}>
                          <AdminPanelSettings sx={{ mr: 2 }} />
                          Panel Admin
                        </MenuItem>
                      </>
                    )}
                    <Divider />
                    <MenuItem onClick={handleSignOut}>
                      <ExitToApp sx={{ mr: 2 }} />
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </MotionHeader>
  );
}