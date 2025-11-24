/**
 * Create VLAN Dialog
 * Inline VLAN creation during WLAN wizard
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { NetworkCheck as NetworkIcon } from '@mui/icons-material';
import { validateVLANID, validateVLANName } from '../../utils/wlanValidation';
import { configAPI } from '../../services/api';

/**
 * Create VLAN Dialog Component
 */
const CreateVLANDialog = ({ open, onClose, onSuccess, suggestedVlanId }) => {
  const [vlanId, setVlanId] = useState('');
  const [vlanName, setVlanName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill VLAN ID when dialog opens
  useEffect(() => {
    if (open && suggestedVlanId) {
      setVlanId(suggestedVlanId.toString());
      setVlanName(`VLAN-${suggestedVlanId}`);
      setDescription(`VLAN ${suggestedVlanId} for wireless network`);
    }
  }, [open, suggestedVlanId]);

  const handleVLANIDChange = (e) => {
    const value = e.target.value;
    setVlanId(value);

    const validation = validateVLANID(value);
    setErrors((prev) => ({ ...prev, vlanId: validation.error }));

    // Auto-update VLAN name suggestion
    if (value && !validation.error) {
      setVlanName(`VLAN-${value}`);
    }
  };

  const handleVLANNameChange = (e) => {
    const value = e.target.value;
    setVlanName(value);

    const validation = validateVLANName(value);
    setErrors((prev) => ({ ...prev, vlanName: validation.error }));
  };

  const handleCreate = async () => {
    // Validate all fields
    const vlanIdValidation = validateVLANID(vlanId);
    const vlanNameValidation = validateVLANName(vlanName);

    if (!vlanIdValidation.valid || !vlanNameValidation.valid) {
      setErrors({
        vlanId: vlanIdValidation.error,
        vlanName: vlanNameValidation.error,
      });
      return;
    }

    try {
      setCreating(true);
      setError('');

      const vlanData = {
        vlan: parseInt(vlanId, 10),
        name: vlanName,
        descriptionAlias: description || `VLAN ${vlanId}`,
      };

      // Create Layer2 VLAN
      await configAPI.vlansNetworks.createVLAN(parseInt(vlanId, 10), vlanData);

      // Create Named VLAN for APs
      const namedVlanData = {
        name: `vlan-${vlanId}`,
        vlan: {
          vlanIdRanges: [vlanId.toString()],
        },
      };
      await configAPI.vlansNetworks.createNamedVLAN(`vlan-${vlanId}`, namedVlanData);

      // Success
      onSuccess(parseInt(vlanId, 10), vlanName);
      handleClose();
    } catch (err) {
      console.error('Error creating VLAN:', err);
      setError(err.message || 'Failed to create VLAN');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setVlanId('');
    setVlanName('');
    setDescription('');
    setErrors({});
    setError('');
    setCreating(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NetworkIcon />
        Create VLAN
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          This will create both a Layer2 VLAN (for switches) and a Named VLAN (for access points).
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="VLAN ID"
            value={vlanId}
            onChange={handleVLANIDChange}
            required
            error={!!errors.vlanId}
            helperText={errors.vlanId || "VLAN ID (1-4094)"}
            disabled={creating}
          />

          <TextField
            fullWidth
            label="VLAN Name"
            value={vlanName}
            onChange={handleVLANNameChange}
            required
            error={!!errors.vlanName}
            helperText={errors.vlanName || "Internal name for this VLAN"}
            disabled={creating}
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            placeholder="Brief description of VLAN purpose"
            disabled={creating}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={creating}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={creating || !vlanId || !vlanName || !!errors.vlanId || !!errors.vlanName}
          startIcon={creating && <CircularProgress size={16} />}
        >
          {creating ? 'Creating...' : 'Create VLAN'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVLANDialog;
