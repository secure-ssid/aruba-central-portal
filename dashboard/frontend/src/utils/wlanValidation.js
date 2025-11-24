/**
 * WLAN Creation Wizard Validation Utilities
 * Provides validation functions for WLAN configuration parameters
 */

/**
 * Validate WLAN/SSID name
 * Max 32 characters, alphanumeric + hyphen/underscore
 * @param {string} name - WLAN name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateWLANName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'WLAN name is required' };
  }

  if (name.length > 32) {
    return { valid: false, error: 'WLAN name must be 32 characters or less' };
  }

  // Allow alphanumeric, hyphen, underscore, and spaces
  const validPattern = /^[a-zA-Z0-9\s_-]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'WLAN name can only contain letters, numbers, spaces, hyphens, and underscores',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate SSID broadcast name (ESSID)
 * Max 32 characters
 * @param {string} ssid - SSID to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateSSID = (ssid) => {
  if (!ssid || ssid.trim() === '') {
    return { valid: false, error: 'SSID is required' };
  }

  if (ssid.length > 32) {
    return { valid: false, error: 'SSID must be 32 characters or less' };
  }

  return { valid: true, error: null };
};

/**
 * Validate WPA passphrase (PSK)
 * STRING format: 8-63 ASCII characters
 * HEX format: Exactly 64 hexadecimal characters
 * @param {string} passphrase - Passphrase to validate
 * @param {string} format - "STRING" or "HEX"
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePassphrase = (passphrase, format = 'STRING') => {
  if (!passphrase) {
    return { valid: false, error: 'Passphrase is required' };
  }

  if (format === 'STRING') {
    if (passphrase.length < 8) {
      return { valid: false, error: 'Passphrase must be at least 8 characters' };
    }
    if (passphrase.length > 63) {
      return { valid: false, error: 'Passphrase must be 63 characters or less' };
    }
    // Check for ASCII printable characters (32-126)
    for (let i = 0; i < passphrase.length; i++) {
      const charCode = passphrase.charCodeAt(i);
      if (charCode < 32 || charCode > 126) {
        return { valid: false, error: 'Passphrase must contain only printable ASCII characters' };
      }
    }
  } else if (format === 'HEX') {
    if (passphrase.length !== 64) {
      return { valid: false, error: 'HEX passphrase must be exactly 64 characters' };
    }
    const hexPattern = /^[0-9a-fA-F]{64}$/;
    if (!hexPattern.test(passphrase)) {
      return { valid: false, error: 'HEX passphrase must contain only hexadecimal characters (0-9, A-F)' };
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate VLAN ID
 * Must be integer between 1 and 4094
 * @param {number|string} vlanId - VLAN ID to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateVLANID = (vlanId) => {
  if (vlanId === null || vlanId === undefined || vlanId === '') {
    return { valid: false, error: 'VLAN ID is required' };
  }

  const numericVlan = parseInt(vlanId, 10);

  if (isNaN(numericVlan)) {
    return { valid: false, error: 'VLAN ID must be a number' };
  }

  if (numericVlan < 1 || numericVlan > 4094) {
    return { valid: false, error: 'VLAN ID must be between 1 and 4094' };
  }

  // Reserved VLANs (optional check - can be commented out if needed)
  // VLAN 1 is often reserved for management, 1002-1005 for legacy protocols
  if (numericVlan === 1) {
    return {
      valid: true,
      warning: 'VLAN 1 is typically reserved for management traffic',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate VLAN name
 * Max 32 characters (Aruba standard)
 * @param {string} name - VLAN name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateVLANName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'VLAN name is required' };
  }

  if (name.length > 32) {
    return { valid: false, error: 'VLAN name must be 32 characters or less' };
  }

  // Allow alphanumeric, hyphen, underscore
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'VLAN name can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate role name
 * Alphanumeric + hyphen/underscore
 * @param {string} name - Role name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateRoleName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Role name is required' };
  }

  if (name.length > 64) {
    return { valid: false, error: 'Role name must be 64 characters or less' };
  }

  // Allow alphanumeric, hyphen, underscore
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'Role name can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate policy name
 * Alphanumeric + hyphen/underscore
 * @param {string} name - Policy name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePolicyName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Policy name is required' };
  }

  if (name.length > 64) {
    return { valid: false, error: 'Policy name must be 64 characters or less' };
  }

  // Allow alphanumeric, hyphen, underscore
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'Policy name can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate CoS (Class of Service) value
 * Must be 0-7
 * @param {number} cos - CoS value to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateCoS = (cos) => {
  const numericCoS = parseInt(cos, 10);

  if (isNaN(numericCoS)) {
    return { valid: false, error: 'CoS must be a number' };
  }

  if (numericCoS < 0 || numericCoS > 7) {
    return { valid: false, error: 'CoS must be between 0 and 7' };
  }

  return { valid: true, error: null };
};

/**
 * Validate client limit
 * Must be 1-256
 * @param {number} limit - Client limit to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateClientLimit = (limit) => {
  const numericLimit = parseInt(limit, 10);

  if (isNaN(numericLimit)) {
    return { valid: false, error: 'Client limit must be a number' };
  }

  if (numericLimit < 1 || numericLimit > 256) {
    return { valid: false, error: 'Client limit must be between 1 and 256' };
  }

  return { valid: true, error: null };
};

/**
 * Validate session timeout
 * Must be 0 (unlimited) or positive integer
 * @param {number} timeout - Timeout in seconds
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateSessionTimeout = (timeout) => {
  const numericTimeout = parseInt(timeout, 10);

  if (isNaN(numericTimeout)) {
    return { valid: false, error: 'Session timeout must be a number' };
  }

  if (numericTimeout < 0) {
    return { valid: false, error: 'Session timeout must be 0 (unlimited) or positive' };
  }

  return { valid: true, error: null };
};

/**
 * Validate bandwidth limit (Kbps)
 * Must be positive integer or 0 (unlimited)
 * @param {number} bandwidth - Bandwidth in Kbps
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateBandwidthLimit = (bandwidth) => {
  if (bandwidth === '' || bandwidth === null || bandwidth === undefined) {
    // Empty is allowed (means unlimited)
    return { valid: true, error: null };
  }

  const numericBandwidth = parseInt(bandwidth, 10);

  if (isNaN(numericBandwidth)) {
    return { valid: false, error: 'Bandwidth must be a number' };
  }

  if (numericBandwidth < 0) {
    return { valid: false, error: 'Bandwidth must be 0 (unlimited) or positive' };
  }

  return { valid: true, error: null };
};

/**
 * Validate IP address (IPv4)
 * @param {string} ip - IP address to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateIPv4 = (ip) => {
  if (!ip || ip.trim() === '') {
    return { valid: false, error: 'IP address is required' };
  }

  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Pattern);

  if (!match) {
    return { valid: false, error: 'Invalid IP address format' };
  }

  // Check each octet is 0-255
  for (let i = 1; i <= 4; i++) {
    const octet = parseInt(match[i], 10);
    if (octet < 0 || octet > 255) {
      return { valid: false, error: 'IP address octets must be between 0 and 255' };
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate port number
 * Must be 1-65535
 * @param {number} port - Port number to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePort = (port) => {
  if (port === null || port === undefined || port === '') {
    return { valid: false, error: 'Port number is required' };
  }

  const numericPort = parseInt(port, 10);

  if (isNaN(numericPort)) {
    return { valid: false, error: 'Port must be a number' };
  }

  if (numericPort < 1 || numericPort > 65535) {
    return { valid: false, error: 'Port must be between 1 and 65535' };
  }

  return { valid: true, error: null };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { valid: false, error: 'Invalid email address format' };
  }

  return { valid: true, error: null };
};

/**
 * Validate MAC address
 * Supports formats: XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, XXXXXXXXXXXX
 * @param {string} mac - MAC address to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateMAC = (mac) => {
  if (!mac || mac.trim() === '') {
    return { valid: false, error: 'MAC address is required' };
  }

  // Remove separators and convert to uppercase
  const cleanMac = mac.replace(/[:-]/g, '').toUpperCase();

  if (cleanMac.length !== 12) {
    return { valid: false, error: 'MAC address must be 12 hexadecimal characters' };
  }

  const hexPattern = /^[0-9A-F]{12}$/;
  if (!hexPattern.test(cleanMac)) {
    return { valid: false, error: 'MAC address must contain only hexadecimal characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate all basic WLAN wizard fields
 * @param {object} data - Wizard data to validate
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateBasicWLAN = (data) => {
  const errors = {};

  // WLAN Name
  const wlanNameResult = validateWLANName(data.wlanName);
  if (!wlanNameResult.valid) {
    errors.wlanName = wlanNameResult.error;
  }

  // SSID
  const ssidResult = validateSSID(data.ssid);
  if (!ssidResult.valid) {
    errors.ssid = ssidResult.error;
  }

  // VLAN ID
  const vlanResult = validateVLANID(data.vlanId);
  if (!vlanResult.valid) {
    errors.vlanId = vlanResult.error;
  }

  // If creating new VLAN, validate VLAN name
  if (data.createVlan && data.vlanName) {
    const vlanNameResult = validateVLANName(data.vlanName);
    if (!vlanNameResult.valid) {
      errors.vlanName = vlanNameResult.error;
    }
  }

  // Auth type specific validation
  if (data.authType === 'WPA2-Personal' || data.authType === 'WPA2/WPA3-Personal') {
    const passphraseResult = validatePassphrase(data.passphrase);
    if (!passphraseResult.valid) {
      errors.passphrase = passphraseResult.error;
    }
  }

  // MPSK validation
  if (data.authType === 'MPSK' && data.mpskList) {
    data.mpskList.forEach((mpsk, index) => {
      const mpskPassphraseResult = validatePassphrase(mpsk.passphrase);
      if (!mpskPassphraseResult.valid) {
        errors[`mpsk_${index}_passphrase`] = mpskPassphraseResult.error;
      }
    });
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateWLANName,
  validateSSID,
  validatePassphrase,
  validateVLANID,
  validateVLANName,
  validateRoleName,
  validatePolicyName,
  validateCoS,
  validateClientLimit,
  validateSessionTimeout,
  validateBandwidthLimit,
  validateIPv4,
  validatePort,
  validateEmail,
  validateMAC,
  validateBasicWLAN,
};
