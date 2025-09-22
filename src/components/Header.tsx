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
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
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
  AccessTime,
  Menu as MenuIcon,
  Close,
  Home,
  Search,
  Build,
  Info
} from '@mui/icons-material';
import { MotionHeader, MotionDiv } from './MotionWrapper';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: '/', label: 'Inicio', icon: <Home /> },
    { href: '/workshops', label: 'Talleres', icon: <Event /> },
    { href: '/buscar-libros', label: 'Buscar Libros', icon: <Search /> },
    { href: '/servicios', label: 'Servicios', icon: <Build /> },
    { href: '/sobre-nosotros', label: 'Nosotros', icon: <Info /> }
  ];

  return (
    <MotionHeader
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar position="static" sx={{
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: 2,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        {/* Top info bar */}
        <Box sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
            <Box sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: 'center',
              py: { xs: 0.5, md: 1 },
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 1, md: 0 }
            }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">(63) 221 7351</Typography>
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                  textAlign: 'center'
                }}
              >
                Gobierno de Chile - Municipalidad de Valdivia
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Main header */}
        <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100vw', px: { xs: 2, sm: 3 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 2, px: { xs: 1, sm: 2 } }}>
            {/* Logo and title */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                {/* Icon - Always visible */}
                <IconButton
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: { xs: 36, md: 48 },
                    height: { xs: 36, md: 48 }
                  }}
                  size="medium"
                >
                  <MenuBook sx={{ fontSize: { xs: 20, md: 32 } }} />
                </IconButton>
                {/* Title - Always visible */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      lineHeight: 1.2,
                      fontSize: { xs: '0.9rem', sm: '1.3rem', md: '1.5rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Biblioteca Municipal de Valdivia
                  </Typography>
                </Box>
              </Box>
            </Link>

            {/* Navigation Links - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navigationItems.map((item) => (
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

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'primary.50' },
                  p: 1.5
                }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            {/* Auth buttons / User menu */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1
            }}>
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
                    {profile?.role === 'admin' && [
                      <Divider key="admin-divider" />,
                      <MenuItem key="admin-panel" component={Link} href="/dashboard/admin" onClick={handleMenuClose}>
                        <AdminPanelSettings sx={{ mr: 2 }} />
                        Panel Admin
                      </MenuItem>
                    ]}
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

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: { width: 280, mx: 2 }
        }}
      >
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBook />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Biblioteca Municipal de Valdivia
              </Typography>
            </Box>
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ pt: 0, px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleMobileMenuClose}
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'primary.50'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 'medium'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Auth Section in Mobile Menu */}
          {!user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/auth/login"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <Login />
                  </ListItemIcon>
                  <ListItemText primary="Iniciar Sesión" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/auth/register"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary="Registrarse" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {profile?.name?.charAt(0).toUpperCase() || <AccountCircle />}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {profile?.name || 'Usuario'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  {profile?.role === 'admin' && (
                    <Chip
                      label="Admin"
                      color="warning"
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/dashboard"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Mi Cuenta" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/profile"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Mi Perfil" />
                </ListItemButton>
              </ListItem>
              {profile?.role === 'admin' && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/dashboard/admin"
                    onClick={handleMobileMenuClose}
                    sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ color: 'warning.main', minWidth: 40 }}>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText primary="Panel Admin" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleSignOut();
                    handleMobileMenuClose();
                  }}
                  sx={{ py: 2, px: 2, borderRadius: 1, mb: 0.5, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </MotionHeader>
  );
}