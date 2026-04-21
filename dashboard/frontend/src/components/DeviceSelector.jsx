/**
 * Device Selector Component
 * Reusable dropdown for selecting devices when serial is required
 * Displays device name but uses serial number in API calls
 */

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import useDeviceInventory from '../hooks/useDeviceInventory';

function DeviceSelector({
  value,
  onChange,
  onDeviceChange = null, // optional: receives full device object
  required = false,
  label = 'Device',
  helperText,
  disabled = false,
  error = false,
  fullWidth = true,
  deviceType = null, // 'AP', 'SWITCH', 'GATEWAY', or null for all
  sx = {},
}) {
  const { devices, loading, error: errorMsg } = useDeviceInventory({ deviceType });

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    // Find the device to get the serial (check both serial and serialNumber)
    const device = devices.find(d =>
      d.serial === selectedValue ||
      d.serialNumber === selectedValue ||
      (d.serialNumber && d.serial === selectedValue)
    );

    if (device) {
      onChange(device.serialNumber || device.serial);
      if (onDeviceChange) onDeviceChange(device);
    } else {
      onChange('');
      if (onDeviceChange) onDeviceChange(null);
    }
  };

  const getDeviceTypeColor = (type) => {
    const upperType = (type || '').toUpperCase();
    if (upperType === 'AP' || upperType === 'ACCESS POINT') return 'primary';
    if (upperType === 'SWITCH') return 'secondary';
    if (upperType === 'GATEWAY') return 'success';
    return 'default';
  };

  if (loading) {
    return (
      <FormControl fullWidth={fullWidth} required={required} error={error} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select value="" label={label} disabled>
          <MenuItem value="">
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Loading devices...
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (errorMsg) {
    return (
      <Alert severity="warning" sx={{ mb: 1 }}>
        {errorMsg}
      </Alert>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} required={required} error={error} disabled={disabled} sx={sx}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={handleChange}
        label={label}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              zIndex: 9999, // High z-index to ensure menu appears above all other content
              '& .MuiMenuItem-root': {
                position: 'relative',
                zIndex: 9999,
              },
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          disablePortal: false, // Use portal to render menu outside DOM hierarchy
          disableScrollLock: false, // Allow scrolling when menu is open
        }}
        renderValue={(selected) => {
          if (!selected || selected === '') {
            return required ? 'Select a device (required)' : 'Select a device (optional)';
          }
          // Find device by serial or serialNumber
          const device = devices.find(d => 
            d.serial === selected || 
            d.serialNumber === selected ||
            (d.serialNumber && d.serial === selected)
          );
          if (device) {
            const displaySerial = device.serialNumber || device.serial;
            return `${device.name} (${displaySerial})`;
          }
          return selected;
        }}
      >
        {devices.map((device) => {
          const deviceSerial = device.serialNumber || device.serial;
          return (
            <MenuItem key={deviceSerial} value={deviceSerial}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box>
                <Typography variant="body2">{device.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {deviceSerial} {device.model ? `• ${device.model}` : ''}
                </Typography>
              </Box>
              <Chip 
                label={device.type} 
                size="small" 
                color={getDeviceTypeColor(device.type)}
                sx={{ ml: 1 }}
              />
            </Box>
          </MenuItem>
          );
        })}
      </Select>
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
}

export default DeviceSelector;

