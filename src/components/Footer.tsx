'use client';

import { Box, Container, Typography, IconButton, Divider, Link } from '@mui/material';
import { MenuBook, Twitter, Facebook, Instagram, LocationOn, Phone, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function Footer() {
  const socialIcons = [
    { icon: <Twitter />, href: '#' },
    { icon: <Facebook />, href: '#' },
    { icon: <Instagram />, href: '#' }
  ];

  const quickLinks = [
    'Catálogo de Libros',
    'Renovar Préstamos',
    'Reservar Libros',
    'Actividades Culturales',
    'Servicios Digitales',
    'Talleres y Eventos'
  ];

  const contactInfo = [
    { icon: <LocationOn fontSize="small" />, text: 'Av. Picarte 1785\nValdivia, Los Ríos' },
    { icon: <Phone fontSize="small" />, text: '(63) 221-1234' },
    { icon: <Email fontSize="small" />, text: 'info@bibliotecaslosrios.cl' }
  ];

  const legalLinks = ['Política de Privacidad', 'Términos de Uso', 'Accesibilidad'];

  return (
    <Box component="footer" sx={{ bgcolor: 'grey.800', color: 'white', mt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4 }}>
          {/* Información institucional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <MenuBook />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Sistema de Bibliotecas Públicas
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.300' }}>
                  Región de Los Ríos
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 3, lineHeight: 1.6 }}>
              Promovemos el acceso libre y gratuito a la información, la cultura y el conocimiento
              a través de nuestras bibliotecas públicas, contribuyendo al desarrollo intelectual
              y social de nuestra comunidad.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    href={social.href}
                    sx={{
                      color: 'grey.300',
                      '&:hover': { color: 'white', bgcolor: 'primary.main' }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'grey.300',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.2s ease'
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </motion.div>

          {/* Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactInfo.map((contact, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ color: 'primary.light', mt: 0.5 }}>
                    {contact.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'grey.300',
                      whiteSpace: 'pre-line',
                      fontSize: '0.875rem'
                    }}
                  >
                    {contact.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Separador y derechos */}
        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              © 2024 Sistema de Bibliotecas Públicas - Región de Los Ríos. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'grey.300',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.2s ease'
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}