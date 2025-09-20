'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Box, Typography, Container, Chip, IconButton } from '@mui/material';
import { Phone, Email, AccessTime, MenuBook } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 3, borderBottom: '4px solid #1976d2' }}>
        {/* Top bar */}
        <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">(63) 221-1234</Typography>
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">info@bibliotecaslosrios.cl</Typography>
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Lun-Vie 9:00-18:00, Sáb 9:00-14:00</Typography>
                  </Box>
                </motion.div>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Portal Ciudadano" color="primary" variant="outlined" size="small" />
                <Typography variant="body2" color="text.secondary">|</Typography>
                <Chip label="Gobierno Regional" color="primary" variant="outlined" size="small" />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main header */}
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 3 }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
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
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Sistema de Bibliotecas Públicas
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                    Región de Los Ríos
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Gobierno de Chile</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Servicio Nacional del Patrimonio Cultural
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #f44336 0%, #2196f3 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    CHILE
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Toolbar>
        </Container>

        {/* Navigation */}
        <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', gap: 4, py: 2 }}>
              {[
                { href: '/', label: 'Inicio' },
                { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/buscar-libros', label: 'Buscador de Libros' },
                { href: '/horarios', label: 'Horarios' },
                { href: '/actividades', label: 'Actividades' },
                { href: '/contacto', label: 'Contacto' }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href} passHref style={{ textDecoration: 'none' }}>
                    <Typography
                      component="span"
                      sx={{
                        color: 'text.secondary',
                        cursor: 'pointer',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </AppBar>
    </motion.header>
  );
}