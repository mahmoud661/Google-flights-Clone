import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import { X, MapPin } from 'lucide-react';

interface Location {
  entityName: string;
  entityId: string;
  hierarchy: string;
  location: string;
  score: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  hotels: Location[];
  isLoading: boolean;
  darkMode: boolean;
  destination: string;
}

export const HotelModal: React.FC<Props> = ({ 
  open, 
  onClose, 
  hotels, 
  isLoading,
  darkMode, 
  destination 
}) => {
  const formatLocation = (location: string) => {
    const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
    return `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? 'grey.900' : 'background.paper',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, color: darkMode ? 'common.white' : 'inherit' }}>
        Hotels in {destination}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: darkMode ? 'grey.500' : 'grey.700',
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: darkMode ? 'grey.900' : 'background.paper' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : hotels.length === 0 ? (
          <Typography color={darkMode ? 'grey.400' : 'text.secondary'}>
            No hotels found for this destination.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {hotels.map((hotel) => (
              <Grid item xs={12} key={hotel.entityId}>
                <Card 
                  sx={{ 
                    bgcolor: darkMode ? 'grey.800' : 'background.paper',
                    mb: 2
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      component="div"
                      color={darkMode ? 'common.white' : 'text.primary'}
                      gutterBottom
                    >
                      {hotel.entityName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={darkMode ? 'grey.400' : 'text.secondary'}
                      sx={{ mb: 2 }}
                    >
                      {hotel.hierarchy}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <MapPin size={16} />
                      <Typography 
                        variant="body2" 
                        color={darkMode ? 'grey.400' : 'text.secondary'}
                      >
                        {formatLocation(hotel.location)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ borderRadius: '24px' }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};