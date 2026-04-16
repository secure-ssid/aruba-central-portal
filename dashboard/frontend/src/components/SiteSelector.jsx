/**
 * Site Selector Component
 * Reusable dropdown for selecting sites when scope-id or site-id is required
 */

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import useSites from '../hooks/useSites';

function SiteSelector({
  value,
  onChange,
  required = false,
  label = 'Site',
  helperText,
  disabled = false,
  error = false,
  fullWidth = true,
}) {
  const { sites, loading, error: errorMsg } = useSites();

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    // Find the site to get the scopeId (which should be same as site-id)
    const site = sites.find(s => 
      String(s.scopeId || s.id || s.siteId || s.site_id) === String(selectedValue)
    );
    
    if (site) {
      // Use scopeId as the value (same as site-id)
      const siteId = site.scopeId || site.id || site.siteId || site.site_id;
      onChange(siteId);
    } else {
      onChange('');
    }
  };

  if (loading) {
    return (
      <FormControl fullWidth={fullWidth} required={required} error={error} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select value="" label={label} disabled>
          <MenuItem value="">
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Loading sites...
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
    <FormControl fullWidth={fullWidth} required={required} error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={handleChange}
        label={label}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || selected === '') {
            return required ? 'Select a site (required)' : 'Select a site (optional)';
          }
          const site = sites.find(s => 
            String(s.scopeId || s.id || s.siteId || s.site_id) === String(selected)
          );
          return site ? (site.name || `Site ${selected}`) : selected;
        }}
      >
        {sites.map((site) => {
          const siteId = site.scopeId || site.id || site.siteId || site.site_id;
          return (
            <MenuItem key={siteId} value={siteId}>
              {site.name || `Site ${siteId}`}
              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                ({siteId})
              </Typography>
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

export default SiteSelector;

