/**
 * WLAN Configuration Templates
 * Default configurations and options for WLAN wizard
 */

// Best practice defaults applied to all WLANs
const BEST_PRACTICE_DEFAULTS = {
  enable: true,

  // Fast roaming / seamless handoff
  dot11k: true,   // RRM (Radio Resource Management)
  dot11r: true,   // Fast BSS Transition

  // WiFi 6 optimizations
  'high-efficiency': {
    enable: true,
  },

  // Client limits and timeouts
  'max-clients-threshold': 64,
  'inactivity-timeout': 1000,

  // Required AP configuration parameters
  'dtim-period': 1,               // DTIM period (1-255 beacon intervals)
  'broadcast-filter-ipv4': 'BCAST_FILTER_ARP',  // IPv4 broadcast filtering
  'broadcast-filter-ipv6': 'UCAST_FILTER_RA',   // IPv6 broadcast filtering
  'dmo': {                        // Dynamic Multicast Optimization
    'enable': true,
    'channel-utilization-threshold': 90,
    'clients-threshold': 6,
  },
};

/**
 * Get default WLAN configuration based on auth type
 * @param {string} authType - Auth type
 * @returns {object} - Default WLAN configuration
 */
export const getDefaultWLANConfig = (authType = 'WPA2/WPA3-Personal') => {
  const baseConfig = {
    ...BEST_PRACTICE_DEFAULTS,
  };

  // Auth-specific configurations
  switch (authType) {
    case 'Open':
      return {
        ...baseConfig,
        // No auth configuration needed
      };

    case 'Enhanced-Open':
      return {
        ...baseConfig,
        // OWE (Opportunistic Wireless Encryption) - encryption without authentication
        // No additional security config needed - opmode ENHANCED_OPEN handles it
      };

    case 'WPA2-Personal':
    case 'WPA2/WPA3-Personal':
    case 'WPA3-Personal':
      return {
        ...baseConfig,
        'personal-security': {
          'passphrase-format': 'STRING',
        },
      };

    case 'WPA2-Enterprise':
    case 'WPA3-Enterprise-CCM-128':
    case 'WPA3-Enterprise-GCM-256':
    case 'WPA3-Enterprise-CNSA':
      return {
        ...baseConfig,
        // Enterprise auth - Central NAC handles authentication
      };

    case 'MPSK-Local':
    case 'MPSK-AES':
      return {
        ...baseConfig,
        'personal-security': {
          'passphrase-format': 'STRING',
          'mpsk-cloud-auth': authType === 'MPSK-AES',
        },
      };

    default:
      return baseConfig;
  }
};

/**
 * Get default role configuration
 * @param {string} roleName - Role name
 * @param {number} vlanId - VLAN ID to assign
 * @returns {object} - Default role configuration
 */
export const getDefaultRoleConfig = (roleName, vlanId) => {
  return {
    name: roleName,
    description: `Auto-created role for WLAN`,
    vlanParameters: {
      accessVlan: vlanId,
    },
    // QoS defaults - omit bandwidth limits for unlimited (best practice)
    // If limits needed, specify in Kbps (e.g., 10000 = 10 Mbps)
    qosParameters: {
      cos: 0,
      // Omitting ingress/egress bandwidth = unlimited
    },
  };
};

/**
 * Get default Layer2 VLAN configuration
 * @param {number} vlanId - VLAN ID
 * @param {string} vlanName - VLAN name
 * @returns {object} - Default Layer2 VLAN configuration
 */
export const getDefaultVLANConfig = (vlanId, vlanName) => {
  return {
    vlan: vlanId,
    name: vlanName,
    descriptionAlias: `VLAN for WLAN`,
  };
};

/**
 * Get default Named VLAN configuration (for APs)
 * @param {string} name - Named VLAN profile name
 * @param {number} vlanId - VLAN ID
 * @returns {object} - Default Named VLAN configuration
 */
export const getDefaultNamedVLANConfig = (name, vlanId) => {
  return {
    name: name,
    vlan: {
      vlanIdRanges: [vlanId.toString()],
    },
  };
};

/**
 * RF Band options for dropdowns
 */
export const RF_BAND_OPTIONS = [
  { value: '24GHZ_5GHZ', label: 'Dual-band (2.4GHz + 5GHz)', recommended: true },
  { value: '24GHZ_ONLY', label: '2.4GHz only' },
  { value: '5GHZ_ONLY', label: '5GHz only' },
  { value: '6GHZ_ONLY', label: '6GHz (WiFi 6E)' },
];

/**
 * Security level options (Step 1 of auth selection)
 */
export const SECURITY_LEVEL_OPTIONS = [
  {
    value: 'Personal',
    label: 'Personal',
    description: 'Pre-shared key (password) authentication - simple and secure for most networks',
    icon: 'lock',
  },
  {
    value: 'Enterprise',
    label: 'Enterprise',
    description: 'User-based authentication via 802.1X/RADIUS - recommended for corporate networks',
    icon: 'business',
  },
  {
    value: 'No Security',
    label: 'No Security / Open',
    description: 'No authentication required - use only for public guest networks',
    icon: 'lock_open',
  },
];

/**
 * Authentication type options organized by security level
 */
export const AUTH_TYPE_OPTIONS_BY_LEVEL = {
  'Personal': [
    {
      value: 'WPA2/WPA3-Personal',
      label: 'WPA2/WPA3-Personal (Transition)',
      description: 'Supports both WPA2 and WPA3 clients - best for compatibility',
      recommended: true,
    },
    {
      value: 'WPA3-Personal',
      label: 'WPA3-Personal (SAE)',
      description: 'WPA3-only with Simultaneous Authentication of Equals - most secure'
    },
    {
      value: 'WPA2-Personal',
      label: 'WPA2-Personal (PSK)',
      description: 'Legacy WPA2 only - for older devices that don\'t support WPA3'
    },
    {
      value: 'MPSK-Local',
      label: 'MPSK - Local Database',
      description: 'Multiple keys using local AP database - best performance',
    },
    {
      value: 'MPSK-AES',
      label: 'MPSK - Cloud Authentication',
      description: 'Multiple keys using Central NAC cloud - centralized management',
    },
  ],
  'Enterprise': [
    {
      value: 'WPA3-Enterprise-CCM-128',
      label: 'WPA3-Enterprise (CCM-128)',
      description: 'WPA3 with AES CCM-128 encryption - recommended for enterprise',
      recommended: true,
    },
    {
      value: 'WPA3-Enterprise-GCM-256',
      label: 'WPA3-Enterprise (GCM-256)',
      description: 'WPA3 with AES GCM-256 encryption - higher security'
    },
    {
      value: 'WPA3-Enterprise-CNSA',
      label: 'WPA3-Enterprise (CNSA 192-bit)',
      description: 'WPA3 CNSA with 192-bit security - highest security for government/military'
    },
    {
      value: 'WPA2-Enterprise',
      label: 'WPA2-Enterprise (802.1X)',
      description: 'Legacy WPA2 Enterprise - for compatibility with older devices'
    },
  ],
  'No Security': [
    {
      value: 'Enhanced-Open',
      label: 'Enhanced Open (OWE)',
      description: 'Opportunistic Wireless Encryption - encrypted but no password required',
      recommended: true,
    },
    {
      value: 'Open',
      label: 'Open (No Security)',
      description: 'No authentication or encryption - least secure, use only when necessary'
    },
  ],
};

/**
 * Legacy flat auth type options (for backward compatibility)
 */
export const AUTH_TYPE_OPTIONS = [
  ...AUTH_TYPE_OPTIONS_BY_LEVEL['Personal'],
  ...AUTH_TYPE_OPTIONS_BY_LEVEL['Enterprise'],
  ...AUTH_TYPE_OPTIONS_BY_LEVEL['No Security'],
];

/**
 * Forward mode options
 */
export const FORWARD_MODE_OPTIONS = [
  {
    value: 'FORWARD_MODE_BRIDGE',
    label: 'Bridged (Local Switching)',
    description: 'Traffic switched locally at the AP - best for most deployments',
    recommended: true,
  },
  {
    value: 'FORWARD_MODE_TUNNEL',
    label: 'Tunneled (Gateway)',
    description: 'Traffic tunneled to gateway - use when centralized control needed',
  },
];

/**
 * Wizard modes and steps
 */
export const WIZARD_MODES = {
  BASIC: {
    name: 'Basic Mode',
    description: 'Quickly create a basic WLAN with essential security settings',
    features: ['Name & SSID', 'Security Level', 'Authentication', 'Network'],
  },
  INTERMEDIATE: {
    name: 'Intermediate Mode',
    description: 'Configure WLAN with additional customization options',
    features: ['Name & SSID', 'Security Level', 'Authentication & Network', 'Review & Deploy'],
  },
  ADVANCED: {
    name: 'Advanced Mode',
    description: 'Full control over all WLAN settings and advanced features',
    features: ['Name & SSID', 'Authentication & Network', 'Advanced Settings', 'Review & Deploy'],
  },
};

export const WIZARD_STEPS = {
  BASIC: [
    { id: 'identity', label: 'Site & Identity', component: 'SiteIdentityPage' },
    { id: 'auth', label: 'Authentication & Network', component: 'AuthNetworkPage' },
    { id: 'review', label: 'Review & Deploy', component: 'ReviewDeployPage' },
  ],
  INTERMEDIATE: [
    { id: 'identity', label: 'Site & Identity', component: 'SiteIdentityPage' },
    { id: 'auth', label: 'Authentication & Network', component: 'AuthNetworkPage' },
    { id: 'review', label: 'Review & Deploy', component: 'ReviewDeployPage' },
  ],
  ADVANCED: [
    { id: 'identity', label: 'Site & Identity', component: 'SiteIdentityPage' },
    { id: 'auth', label: 'Authentication & Network', component: 'AuthNetworkPage' },
    { id: 'review', label: 'Review & Deploy', component: 'ReviewDeployPage' },
  ],
};

export default {
  getDefaultWLANConfig,
  getDefaultRoleConfig,
  getDefaultVLANConfig,
  getDefaultNamedVLANConfig,
  RF_BAND_OPTIONS,
  SECURITY_LEVEL_OPTIONS,
  AUTH_TYPE_OPTIONS_BY_LEVEL,
  AUTH_TYPE_OPTIONS,
  FORWARD_MODE_OPTIONS,
  WIZARD_MODES,
  WIZARD_STEPS,
};
