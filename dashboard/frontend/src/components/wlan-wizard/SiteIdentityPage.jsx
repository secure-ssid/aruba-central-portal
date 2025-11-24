/**
 * WLAN Wizard - Page 1: Site & Identity
 * Select deployment scope and configure basic WLAN identity
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Autocomplete,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Public as GlobalIcon,
  Wifi as WifiIcon,
} from '@mui/icons-material';
import { configAPI } from '../../services/api';
import { validateWLANName, validateSSID } from '../../utils/wlanValidation';

/**
 * Site & Identity Page Component
 * @param {object} data - Current wizard data
 * @param {function} onUpdate - Callback to update wizard data
 */
const SiteIdentityPage = ({ data, onUpdate }) => {
  const [sites, setSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [errors, setErrors] = useState({});

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, []);

  // Helper function to get site display name
  const getSiteName = (site) => {
    // Primary field: scopeName (this is what Aruba Central uses)
    if (site.scopeName && site.scopeName.trim() !== '') {
      return site.scopeName;
    }

    // Alternative name fields
    if (site.name && site.name.trim() !== '') {
      return site.name;
    }

    if (site.site_name && site.site_name.trim() !== '') {
      return site.site_name;
    }

    // Fall back to address if no name
    const address = site.address?.address || site.address;
    if (address && address.trim() !== '') {
      return address;
    }

    // Last resort - use ID
    return `Site ${site.scopeId || site.site_id || site.id || 'Unknown'}`;
  };

  const loadSites = async () => {
    try {
      setLoadingSites(true);
      const response = await configAPI.scopeManagement.getSites();
      console.log('Sites response:', response);

      // Extract sites from response
      const sitesData = response.sites || response.items || response.data || [];

      setSites(sitesData);

      // If no site selected and sites available, pre-select first site
      if (!data.scopeId && sitesData.length > 0) {
        const firstSite = sitesData[0];
        onUpdate({
          scopeId: firstSite.scopeId || firstSite.site_id || firstSite.id || firstSite.scope_id,
          scopeName: getSiteName(firstSite),
        });
      }
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  // Auto-fill SSID when WLAN name changes
  const handleWLANNameChange = (e) => {
    const wlanName = e.target.value;

    // Validate
    const validation = validateWLANName(wlanName);
    setErrors((prev) => ({ ...prev, wlanName: validation.error }));

    // Update data
    onUpdate({ wlanName });

    // Auto-fill SSID if it's empty or matches previous WLAN name
    if (!data.ssidBroadcastName || data.ssidBroadcastName === data.wlanName) {
      onUpdate({ wlanName, ssidBroadcastName: wlanName });
    }
  };

  const handleSSIDChange = (e) => {
    const ssidBroadcastName = e.target.value;

    // Validate
    const validation = validateSSID(ssidBroadcastName);
    setErrors((prev) => ({ ...prev, ssidBroadcastName: validation.error }));

    onUpdate({ ssidBroadcastName });
  };

  const handleScopeTypeChange = (e) => {
    const scopeType = e.target.value;

    if (scopeType === 'global') {
      onUpdate({
        scopeType,
        scopeId: null,
        scopeName: 'Global',
      });
    } else if (scopeType === 'site' && sites.length > 0) {
      const firstSite = sites[0];
      onUpdate({
        scopeType,
        scopeId: firstSite.scopeId || firstSite.site_id || firstSite.id || firstSite.scope_id,
        scopeName: getSiteName(firstSite),
      });
    } else {
      onUpdate({ scopeType });
    }
  };

  const handleSiteChange = (event, newValue) => {
    if (newValue) {
      onUpdate({
        scopeId: newValue.scopeId || newValue.site_id || newValue.id || newValue.scope_id,
        scopeName: getSiteName(newValue),
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WifiIcon />
        Site & Identity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure where this WLAN will be deployed and its basic identity
      </Typography>

      {/* Scope Selection */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon fontSize="small" />
          Deployment Scope
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Scope Type</InputLabel>
          <Select
            value={data.scopeType}
            label="Scope Type"
            onChange={handleScopeTypeChange}
          >
            <MenuItem value="global">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GlobalIcon fontSize="small" />
                Global (All Sites)
              </Box>
            </MenuItem>
            <MenuItem value="site">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                Specific Site
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Site selector - only shown if scope type is 'site' */}
        {data.scopeType === 'site' && (
          <Box sx={{ mt: 2 }}>
            {loadingSites ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Loading sites...
                </Typography>
              </Box>
            ) : sites.length > 0 ? (
              <Autocomplete
                options={sites}
                getOptionLabel={(option) => getSiteName(option)}
                value={sites.find((s) =>
                  (s.scopeId || s.site_id || s.id || s.scope_id) === data.scopeId
                ) || null}
                onChange={handleSiteChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Site"
                    placeholder="Choose a site"
                  />
                )}
                renderOption={(props, option) => {
                  const displayName = getSiteName(option);
                  const address = option.address?.address || option.address;
                  const showAddress = address && displayName !== address;

                  return (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2">
                          {displayName}
                        </Typography>
                        {showAddress && (
                          <Typography variant="caption" color="text.secondary">
                            {address}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  );
                }}
              />
            ) : (
              <Alert severity="warning">
                No sites available. The WLAN will be created but not assigned to any site.
              </Alert>
            )}
          </Box>
        )}

        {data.scopeType === 'global' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This WLAN will be available to all sites in your organization
          </Alert>
        )}
      </Paper>

      {/* WLAN Identity */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          WLAN Configuration
        </Typography>

        <TextField
          fullWidth
          label="WLAN Name (Profile Name)"
          value={data.wlanName}
          onChange={handleWLANNameChange}
          required
          error={!!errors.wlanName}
          helperText={errors.wlanName || "Internal identifier for this WLAN configuration"}
          sx={{ mt: 2 }}
          placeholder="e.g., Corporate-WiFi"
        />

        <TextField
          fullWidth
          label="SSID (Broadcast Name)"
          value={data.ssidBroadcastName}
          onChange={handleSSIDChange}
          required
          error={!!errors.ssidBroadcastName}
          helperText={errors.ssidBroadcastName || "The name users see when scanning for WiFi"}
          sx={{ mt: 2 }}
          placeholder="e.g., Corporate-WiFi"
        />

        <TextField
          fullWidth
          label="Description (Optional)"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          multiline
          rows={2}
          sx={{ mt: 2 }}
          placeholder="Brief description of this WLAN's purpose"
        />

        <FormControlLabel
          control={
            <Switch
              checked={data.enabled}
              onChange={(e) => onUpdate({ enabled: e.target.checked })}
            />
          }
          label="Enable WLAN after creation"
          sx={{ mt: 2 }}
        />
      </Paper>

      {/* Help Text */}
      <Alert severity="info" icon={<WifiIcon />}>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          Best Practices:
        </Typography>
        <Typography variant="caption" component="div">
          • Use descriptive names that indicate the WLAN's purpose (e.g., "Guest-WiFi", "Corporate-Secure")
        </Typography>
        <Typography variant="caption" component="div">
          • SSID broadcast name is what users see when connecting
        </Typography>
        <Typography variant="caption" component="div">
          • Maximum 32 characters for both WLAN name and SSID
        </Typography>
      </Alert>
    </Box>
  );
};

export default SiteIdentityPage;
