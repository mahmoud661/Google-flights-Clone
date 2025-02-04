import React from 'react';
import { FlightCard } from './FlightCard';
import { Globe, Loader2 } from 'lucide-react';
import { Typography, Box, Paper } from '@mui/material';

interface Props {
  flights: any[];
  loading: boolean;
  error: Error | null;
  darkMode: boolean;
}

export const FlightList: React.FC<Props> = ({ flights, loading, error, darkMode }) => {
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200} gap={2}>
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <Typography color="text.secondary">
          Searching for the best flights...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          bgcolor: (theme) => darkMode ? 'error.dark' : 'error.light',
          color: 'error.main'
        }}
      >
        <Typography>{error.message}</Typography>
      </Paper>
    );
  }

  if (!flights.length) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom color="text.primary">
          Popular Destinations
        </Typography>
        
        <Box display="flex" gap={2} sx={{ mb: 4 }}>
          <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            London
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            Dubai
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
            Istanbul
          </Paper>
        </Box>

        <Paper 
          sx={{ 
            position: 'relative',
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Globe className="absolute inset-0 w-full h-full text-gray-200" />
          <Typography
            variant="h6"
            sx={{
              position: 'relative',
              zIndex: 1,
              color: 'text.primary'
            }}
          >
            Explore destinations worldwide
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} darkMode={darkMode} />
      ))}
    </Box>
  );
};