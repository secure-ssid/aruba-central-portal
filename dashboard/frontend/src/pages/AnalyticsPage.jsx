/**
 * Analytics Page
 * Network analytics and reports
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';

function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('1d');

  const timeframeLabel = {
    '1h': 'Last Hour',
    '1d': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics & Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Network usage analytics and performance metrics
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} label="Timeframe">
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="1d">Last Day</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255, 102, 0, 0.15)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(255, 102, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                  <TrendingUpIcon sx={{ color: '#FF6600', fontSize: 20 }} />
                </Box>
                <Typography variant="h6">Bandwidth Usage</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Aggregate bandwidth metrics for {timeframeLabel[timeframe] || 'selected timeframe'}
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: 'rgba(255, 102, 0, 0.04)', borderRadius: 2, border: '1px dashed rgba(255, 102, 0, 0.2)', textAlign: 'center' }}>
                <BarChartIcon sx={{ fontSize: 40, color: 'rgba(255, 102, 0, 0.25)', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Bandwidth data will populate when connected to Central monitoring endpoints
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255, 102, 0, 0.15)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                  <AssessmentIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                </Box>
                <Typography variant="h6">Client Trends</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connected client count over {timeframeLabel[timeframe] || 'selected timeframe'}
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: 'rgba(33, 150, 243, 0.04)', borderRadius: 2, border: '1px dashed rgba(33, 150, 243, 0.2)', textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 40, color: 'rgba(33, 150, 243, 0.25)', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Client trend data from the monitoring API will appear here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255, 102, 0, 0.15)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                  <SpeedIcon sx={{ color: '#22C55E', fontSize: 20 }} />
                </Box>
                <Typography variant="h6">AP Performance</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access Point performance metrics and health scores
              </Typography>
              <Box sx={{ mt: 2, p: 3, bgcolor: 'rgba(34, 197, 94, 0.04)', borderRadius: 2, border: '1px dashed rgba(34, 197, 94, 0.2)', textAlign: 'center' }}>
                <SpeedIcon sx={{ fontSize: 40, color: 'rgba(34, 197, 94, 0.25)', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  AP performance data will be displayed once monitoring is connected
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page displays network analytics data from Aruba Central monitoring APIs.
            Real-time charts and visualizations will populate when connected to Central monitoring endpoints.
            Use the timeframe selector above to adjust the data range.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AnalyticsPage;
