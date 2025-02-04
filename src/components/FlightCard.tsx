import React, { useState } from 'react';
import { Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Paper,
  Box,
  Typography,
  Button,
  Collapse,
  Divider,
  Grid,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';

interface Props {
  flight: any;
  darkMode: boolean;
}

export const FlightCard: React.FC<Props> = ({ flight, darkMode }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const firstLeg = flight.legs[0];
  const marketingCarrier = firstLeg.carriers.marketing[0];
  
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      time: format(date, 'HH:mm'),
      date: format(date, 'MMM dd, yyyy')
    };
  };

  const departure = formatDateTime(firstLeg.departure);
  const arrival = formatDateTime(firstLeg.arrival);

  return (
    <Paper 
      sx={{ 
        p: 3,
        bgcolor: darkMode ? 'grey.900' : 'background.paper',
        color: darkMode ? 'common.white' : 'text.primary',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* Airline Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Avatar src={marketingCarrier.logoUrl} alt={marketingCarrier.name}>
            {marketingCarrier.name[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color={darkMode ? 'common.white' : 'text.primary'}>
              {marketingCarrier.name}
            </Typography>
            <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'}>
              Flight #{firstLeg.segments[0].flightNumber}
            </Typography>
          </Box>
        </Box>

        {/* Flight Times */}
        <Box sx={{ flex: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={5}>
              <Box>
                <Typography variant="h6" color={darkMode ? 'common.white' : 'text.primary'}>
                  {departure.time}
                </Typography>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  {firstLeg.origin.city} ({firstLeg.origin.displayCode})
                </Typography>
                <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  {departure.date}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  {Math.floor(firstLeg.durationInMinutes / 60)}h {firstLeg.durationInMinutes % 60}m
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: darkMode ? 'grey.700' : 'grey.300' }} />
                  <ArrowRight className="mx-2" color={darkMode ? theme.palette.grey[400] : theme.palette.grey[600]} />
                  <Box sx={{ flex: 1, height: '1px', bgcolor: darkMode ? 'grey.700' : 'grey.300' }} />
                </Box>
                <Chip 
                  size="small" 
                  label={`${firstLeg.stopCount} stop${firstLeg.stopCount !== 1 ? 's' : ''}`}
                  color={firstLeg.stopCount === 0 ? 'success' : 'default'}
                  sx={{
                    bgcolor: darkMode ? 'grey.800' : undefined,
                    color: darkMode ? 'common.white' : undefined
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                <Typography variant="h6" color={darkMode ? 'common.white' : 'text.primary'}>
                  {arrival.time}
                </Typography>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  {firstLeg.destination.city} ({firstLeg.destination.displayCode})
                </Typography>
                <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  {arrival.date}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Price and Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'stretch', md: 'flex-end' }, gap: 1, flex: 1 }}>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {flight.price.formatted}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '24px' }}
          >
            Select
          </Button>
          <Button
            variant="text"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            sx={{ color: darkMode ? 'grey.400' : 'text.secondary' }}
          >
            {expanded ? 'Hide details' : 'Show details'}
          </Button>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Divider sx={{ my: 2, borderColor: darkMode ? 'grey.800' : 'grey.200' }} />
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom color={darkMode ? 'common.white' : 'text.primary'}>
            Flight Details
          </Typography>
          
          {firstLeg.segments.map((segment: any, index: number) => (
            <Box key={segment.id} sx={{ mb: 3 }}>
              {index > 0 && (
                <Box sx={{ 
                  my: 2, 
                  px: 2, 
                  py: 1, 
                  bgcolor: darkMode ? 'grey.800' : 'grey.100',
                  borderRadius: 1 
                }}>
                  <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                    Layover in {segment.origin.parent.name}: {format(new Date(segment.departure), 'HH:mm')} - {format(new Date(firstLeg.segments[index - 1].arrival), 'HH:mm')}
                  </Typography>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={marketingCarrier.logoUrl} 
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                      {segment.marketingCarrier.name} {segment.flightNumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                        {format(new Date(segment.departure), 'HH:mm')}
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                        {segment.origin.parent.name} ({segment.origin.displayCode})
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                        {format(new Date(segment.arrival), 'HH:mm')}
                      </Typography>
                      <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                        {segment.destination.parent.name} ({segment.destination.displayCode})
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color={darkMode ? 'common.white' : 'text.primary'}>
              Fare Conditions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  Changes
                </Typography>
                <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                  {flight.farePolicy.isChangeAllowed ? 'Allowed' : 'Not allowed'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  Cancellation
                </Typography>
                <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                  {flight.farePolicy.isCancellationAllowed ? 'Allowed' : 'Not allowed'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  Cabin
                </Typography>
                <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'} sx={{ textTransform: 'capitalize' }}>
                  Economy
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color={darkMode ? 'grey.400' : 'text.secondary'}>
                  Baggage
                </Typography>
                <Typography variant="body2" color={darkMode ? 'common.white' : 'text.primary'}>
                  Check airline
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};