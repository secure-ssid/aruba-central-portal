/**
 * Firmware Management Page
 * View firmware compliance and schedule upgrades
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  SystemUpdate as SystemUpdateIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { firmwareAPI } from '../services/api';

/**
 * Determine compliance status color based on percentage
 */
const getComplianceColor = (percentage) => {
  if (percentage >= 90) return 'var(--color-success)';
  if (percentage >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

/**
 * Get compliance label
 */
const getComplianceLabel = (percentage) => {
  if (percentage >= 90) return 'Compliant';
  if (percentage >= 60) return 'Outdated';
  return 'Critical';
};

/**
 * Get MUI color name for chip
 */
const getComplianceChipColor = (percentage) => {
  if (percentage >= 90) return 'success';
  if (percentage >= 60) return 'warning';
  return 'error';
};

/**
 * Group firmware details data by device model
 */
const groupByModel = (details) => {
  if (!details) return [];

  const items = details.items || details.devices || details.data || [];
  if (!Array.isArray(items) || items.length === 0) return [];

  const groups = {};
  for (const device of items) {
    const model = device.model || device.deviceModel || device.platform || 'Unknown';
    if (!groups[model]) {
      groups[model] = {
        model,
        devices: [],
        firmwareVersions: new Set(),
        recommendedVersion: null,
        compliantCount: 0,
      };
    }
    groups[model].devices.push(device);

    const fw = device.firmwareVersion || device.firmware_version || device.version || 'N/A';
    groups[model].firmwareVersions.add(fw);

    const recommended = device.recommendedVersion || device.recommended_version
      || device.targetVersion || device.target_version || null;
    if (recommended) {
      groups[model].recommendedVersion = recommended;
    }

    const isCompliant = device.compliant === true
      || device.compliance === true
      || device.status === 'compliant'
      || device.firmwareCompliance === 'COMPLIANT'
      || (recommended && fw === recommended);
    if (isCompliant) {
      groups[model].compliantCount += 1;
    }
  }

  return Object.values(groups).map((g) => ({
    model: g.model,
    deviceCount: g.devices.length,
    firmwareVersions: Array.from(g.firmwareVersions).filter((v) => v !== 'N/A'),
    recommendedVersion: g.recommendedVersion || 'N/A',
    compliancePercentage: g.devices.length > 0
      ? Math.round((g.compliantCount / g.devices.length) * 100)
      : 0,
    compliantCount: g.compliantCount,
  })).sort((a, b) => a.compliancePercentage - b.compliancePercentage);
};

function FirmwarePage() {
  const {
    data: compliance,
    isLoading: complianceLoading,
    error: complianceError,
    refetch: refetchCompliance,
  } = useQuery({
    queryKey: ['firmware-compliance'],
    queryFn: () => firmwareAPI.getCompliance(),
    staleTime: 5 * 60_000,
  });

  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useQuery({
    queryKey: ['firmware-details'],
    queryFn: () => firmwareAPI.getDetails(),
    staleTime: 5 * 60_000,
  });

  const loading = complianceLoading || detailsLoading;
  const errorMsg = complianceError?.message || detailsError?.message || '';

  const modelGroups = useMemo(() => groupByModel(details), [details]);

  // Compute overall stats from model groups if available
  const overallStats = useMemo(() => {
    if (modelGroups.length === 0) return null;
    const totalDevices = modelGroups.reduce((sum, g) => sum + g.deviceCount, 0);
    const totalCompliant = modelGroups.reduce((sum, g) => sum + g.compliantCount, 0);
    return {
      totalDevices,
      totalCompliant,
      totalNonCompliant: totalDevices - totalCompliant,
      overallPercentage: totalDevices > 0 ? Math.round((totalCompliant / totalDevices) * 100) : 0,
    };
  }, [modelGroups]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" role="status" aria-live="polite">
        <CircularProgress aria-label="Loading firmware data" />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Firmware Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor device firmware compliance and schedule upgrades
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => refetchCompliance()}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {errorMsg && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Compliant Devices
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-success)' }}>
                    {overallStats?.totalCompliant ?? compliance?.compliant ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: 'var(--color-success)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Non-Compliant
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-warning)' }}>
                    {overallStats?.totalNonCompliant ?? compliance?.non_compliant ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WarningIcon sx={{ fontSize: 20, color: 'var(--color-warning)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Upgrades Scheduled
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {compliance?.scheduled || 0}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SystemUpdateIcon sx={{ fontSize: 20, color: 'var(--color-primary)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compliance Overview by Model */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid var(--border-subtle)' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Compliance Overview by Model
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Firmware compliance grouped by device model
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small" aria-label="Firmware compliance by device model">
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell sx={{ width: 100 }}>Devices</TableCell>
                  <TableCell>Current Version(s)</TableCell>
                  <TableCell>Recommended</TableCell>
                  <TableCell sx={{ width: 200 }}>Compliance</TableCell>
                  <TableCell sx={{ width: 120 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelGroups.length > 0 ? (
                  modelGroups.map((group) => (
                    <TableRow
                      key={group.model}
                      sx={{
                        bgcolor: group.compliancePercentage < 60 ? 'rgba(239,68,68,0.04)' : 'transparent',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MemoryIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {group.model}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{group.deviceCount}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {group.firmwareVersions.length > 0 ? (
                            group.firmwareVersions.slice(0, 3).map((v) => (
                              <Chip
                                key={v}
                                size="small"
                                label={v}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22, fontFamily: 'monospace' }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">N/A</Typography>
                          )}
                          {group.firmwareVersions.length > 3 && (
                            <Tooltip title={group.firmwareVersions.slice(3).join(', ')}>
                              <Chip
                                size="small"
                                label={`+${group.firmwareVersions.length - 3}`}
                                sx={{ fontSize: '0.7rem', height: 22 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-success)' }}
                        >
                          {group.recommendedVersion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={group.compliancePercentage}
                              aria-label={`${group.compliancePercentage}% compliance for ${group.model}`}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.06)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  bgcolor: getComplianceColor(group.compliancePercentage),
                                },
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              minWidth: 36,
                              textAlign: 'right',
                              color: getComplianceColor(group.compliancePercentage),
                            }}
                          >
                            {group.compliancePercentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={getComplianceLabel(group.compliancePercentage)}
                          color={getComplianceChipColor(group.compliancePercentage)}
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <SystemUpdateIcon sx={{ fontSize: 40, color: 'var(--border-default)', mb: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" display="block">
                        No firmware details available
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                        Firmware compliance data will appear here when device details are available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Firmware Management Tools */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Firmware Management Tools
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Use this page to:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" paragraph>
              Monitor firmware compliance across all devices
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              View available firmware versions for each device type
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Schedule firmware upgrades for devices or groups
            </Typography>
            <Typography component="li" variant="body2">
              Track upgrade progress and rollback if needed
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SystemUpdateIcon />}
            sx={{ mt: 2 }}
            onClick={() => refetchCompliance()}
          >
            Refresh Compliance
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FirmwarePage;
