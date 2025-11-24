/**
 * WLAN Creation Wizard
 * Multi-tier wizard (Basic/Intermediate/Advanced) for creating WLANs with automatic dependency management
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  SignalCellularAlt as SignalIcon,
  TuneOutlined as TuneIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { WIZARD_MODES, WIZARD_STEPS } from '../../utils/wlanTemplates';
import SiteIdentityPage from '../../components/wlan-wizard/SiteIdentityPage';
import AuthNetworkPage from '../../components/wlan-wizard/AuthNetworkPage';
import ReviewDeployPage from '../../components/wlan-wizard/ReviewDeployPage';

// Placeholder imports for advanced pages (to be created later)
// import AdvancedOptionsPage from '../../components/wlan-wizard/AdvancedOptionsPage';
// import RolesPoliciesPage from '../../components/wlan-wizard/RolesPoliciesPage';

/**
 * Main WLAN Wizard Component
 * @param {boolean} open - Whether dialog is open
 * @param {function} onClose - Callback when dialog closes
 * @param {function} onSuccess - Callback when WLAN is created successfully
 */
const WLANWizard = ({ open, onClose, onSuccess }) => {
  // Wizard mode: 'BASIC', 'INTERMEDIATE', 'ADVANCED'
  const [wizardMode, setWizardMode] = useState('BASIC');
  const [activeStep, setActiveStep] = useState(0);

  // Wizard data state - stores all configuration data
  const [wizardData, setWizardData] = useState({
    // Page 1: Site & Identity
    scopeType: 'site', // 'global', 'site', 'device-group'
    scopeId: null,
    scopeName: 'Global',
    wlanName: '',
    ssidBroadcastName: '',
    description: '',
    enabled: true,

    // Page 2: Authentication & Network
    securityLevel: 'Personal', // 'Personal', 'Enterprise', 'No Security'
    authType: 'WPA2/WPA3-Personal', // Default to recommended Personal auth type
    passphrase: '',
    mpskList: [],
    vlanId: '1',
    vlanName: '',
    vlanExists: null, // true/false/null (not checked yet)
    createVlan: false,
    useExistingRole: false,
    existingRoleName: '',
    gatewaySerial: '',
    gatewayName: '',

    // Page 2.5: Advanced Options (Intermediate/Advanced)
    rfBand: '24GHZ_5GHZ',
    clientLimit: 64,
    hideSSID: false,
    bandwidthLimit: '',
    inactivityTimeout: 1000,
    clientIsolation: false,
    enableCaptivePortal: false,
    captivePortalProfile: '',

    // Page 3: Advanced Security & RF (Advanced only)
    forwardMode: 'FORWARD_MODE_BRIDGE',
    mfpMode: 'capable', // 'capable', 'required', 'disabled'
    okcEnable: false,
    disable11ax: false,
    dot11r: true,
    dot11k: true,
    dot11v: false,
    mobilityDomainId: null,

    // Page 3.5: Custom Role & Policy (Advanced only)
    createCustomRole: false,
    customRoleName: '',
    customRoleDescription: '',
    roleVlanId: '',
    sessionTimeout: 0,
    ingressBandwidth: '',
    egressBandwidth: '',
    cos: 0,
    gatewayZone: '',
    gatewayRole: '',
    enableDPI: false,
    enableIPClassification: false,
    enableWebCC: false,

    createPolicy: false,
    policyName: '',
    policyDescription: '',
    policyRules: [],
  });

  // Get current step labels based on wizard mode
  const steps = WIZARD_STEPS[wizardMode];

  // Handle wizard mode change
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setWizardMode(newMode);
      setActiveStep(0); // Reset to first step when changing modes
    }
  };

  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle wizard data update
  const updateWizardData = (updates) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  // Validate if current step has all required fields filled
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Site & Identity
        return wizardData.wlanName && wizardData.wlanName.trim() !== '' &&
               wizardData.ssidBroadcastName && wizardData.ssidBroadcastName.trim() !== '';

      case 1: // Authentication & Network
        // VLAN ID is always required
        if (!wizardData.vlanId || wizardData.vlanId.trim() === '') {
          return false;
        }

        // Passphrase required for Personal auth types
        const personalAuthTypes = ['WPA2-Personal', 'WPA2/WPA3-Personal', 'WPA3-Personal', 'MPSK-Local', 'MPSK-AES', 'MPSK'];
        if (personalAuthTypes.includes(wizardData.authType)) {
          if (!wizardData.passphrase || wizardData.passphrase.trim() === '') {
            return false;
          }
        }

        // Gateway required for tunnel mode
        if (wizardData.forwardMode === 'FORWARD_MODE_L2' && !wizardData.gatewaySerial) {
          return false;
        }

        return true;

      case 2: // Step 3 varies by wizard mode
        return true; // Advanced Options or Review pages handle their own validation

      default:
        return true;
    }
  };

  // Handle wizard close
  const handleClose = () => {
    // TODO: Add confirmation dialog if data has been entered
    setActiveStep(0);
    setWizardData({
      scopeType: 'site',
      scopeId: null,
      scopeName: 'Global',
      wlanName: '',
      ssidBroadcastName: '',
      description: '',
      enabled: true,
      authType: 'WPA2-Personal',
      passphrase: '',
      mpskList: [],
      vlanId: '1',
      vlanName: '',
      vlanExists: null,
      createVlan: false,
      useExistingRole: false,
      existingRoleName: '',
      gatewaySerial: '',
      gatewayName: '',
      rfBand: '24GHZ_5GHZ',
      clientLimit: 64,
      hideSSID: false,
      bandwidthLimit: '',
      inactivityTimeout: 1000,
      clientIsolation: false,
      enableCaptivePortal: false,
      captivePortalProfile: '',
      forwardMode: 'FORWARD_MODE_BRIDGE',
      mfpMode: 'capable',
      okcEnable: false,
      disable11ax: false,
      dot11r: true,
      dot11k: true,
      dot11v: false,
      mobilityDomainId: null,
      createCustomRole: false,
      customRoleName: '',
      customRoleDescription: '',
      roleVlanId: '',
      sessionTimeout: 0,
      ingressBandwidth: '',
      egressBandwidth: '',
      cos: 0,
      gatewayZone: '',
      gatewayRole: '',
      enableDPI: false,
      enableIPClassification: false,
      enableWebCC: false,
      createPolicy: false,
      policyName: '',
      policyDescription: '',
      policyRules: [],
    });
    onClose();
  };

  // Render step content based on active step and wizard mode
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        // Page 1: Site & Identity (all modes)
        return <SiteIdentityPage data={wizardData} onUpdate={updateWizardData} />;

      case 1:
        // Page 2: Authentication & Network (all modes)
        return <AuthNetworkPage data={wizardData} onUpdate={updateWizardData} />;

      case 2:
        // This could be Advanced Options (Intermediate/Advanced) or Review (Basic)
        if (wizardMode === 'BASIC') {
          return <ReviewDeployPage data={wizardData} onSuccess={onSuccess} />;
        } else {
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Advanced Options
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Intermediate/Advanced options coming soon. For now, click Next to proceed to Review & Deploy.
              </Alert>
            </Box>
          );
        }

      case 3:
        // Review (Intermediate) or Roles & Policies (Advanced)
        if (wizardMode === 'INTERMEDIATE') {
          return <ReviewDeployPage data={wizardData} onSuccess={onSuccess} />;
        } else {
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Roles & Policies
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Advanced role/policy builder coming soon. For now, click Next to proceed to Review & Deploy.
              </Alert>
            </Box>
          );
        }

      case 4:
        // Review & Deploy (Advanced only)
        return <ReviewDeployPage data={wizardData} onSuccess={onSuccess} />;

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SignalIcon color="primary" />
          <Typography variant="h6">Create WLAN</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Wizard Mode Selection */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Configuration Mode
          </Typography>
          <ToggleButtonGroup
            value={wizardMode}
            exclusive
            onChange={handleModeChange}
            aria-label="wizard mode"
            size="small"
            fullWidth
          >
            <ToggleButton value="BASIC" aria-label="basic mode">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                <SignalIcon fontSize="small" sx={{ mb: 0.5 }} />
                <Typography variant="caption">Basic</Typography>
              </Box>
            </ToggleButton>
            <ToggleButton value="INTERMEDIATE" aria-label="intermediate mode">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                <TuneIcon fontSize="small" sx={{ mb: 0.5 }} />
                <Typography variant="caption">Intermediate</Typography>
              </Box>
            </ToggleButton>
            <ToggleButton value="ADVANCED" aria-label="advanced mode">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                <SettingsIcon fontSize="small" sx={{ mb: 0.5 }} />
                <Typography variant="caption">Advanced</Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Mode description */}
          <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              {WIZARD_MODES[wizardMode].description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {WIZARD_MODES[wizardMode].features.map((feature, index) => (
                <Chip key={index} label={feature} size="small" variant="outlined" />
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.id}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ minHeight: 400 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={activeStep === steps.length - 1 || !isStepValid()}
            >
              {activeStep === steps.length - 1 ? 'Create WLAN' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WLANWizard;
