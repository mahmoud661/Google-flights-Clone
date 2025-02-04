import React from 'react';
import { FlightCard } from './FlightCard';
import { Globe, Loader2 } from 'lucide-react';
import { Typography, Box, Paper } from '@mui/material';

interface Props {
  flights: any[];
  loading: boolean;
  error: Error | null;
  darkMode: boolean;
  searched: boolean;
}

export const FlightList: React.FC<Props> = ({ flights, loading, error, darkMode, searched }) => {
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
      <Box sx={{ py: 4 }} display="flex" justifyContent="center">
        <Typography variant="h6" color={darkMode ? "grey.300" : "text.primary"}>
          {!searched ? "Enter your destination to start." : "No flights found."}
        </Typography>
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