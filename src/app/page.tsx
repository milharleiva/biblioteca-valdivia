'use client';

import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { Header } from '@/components/Header';

const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    </Box>
  )
});

export default function Home() {
  return <HomeContent />;
}