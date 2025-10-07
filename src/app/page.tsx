'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { Header } from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <LoadingScreen message="Cargando contenido de la biblioteca" fullScreen={false} />
    </Box>
  )
});

export default function Home() {
  return <HomeContent />;
}