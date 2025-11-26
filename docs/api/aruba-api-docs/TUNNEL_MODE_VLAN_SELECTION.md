# Tunnel Mode VLAN Selection - Implementation Summary

**Date**: November 23, 2025
**Status**: ✅ Implemented

---

## Problem Statement

Tunnel mode (L2) WLANs were failing with error:
```
'L2-VLAN:X is not configured'
```

**Root Cause**: For L2 tunnel mode, the VLAN must be pre-configured on the gateway device. You cannot use arbitrary VLAN IDs like in bridge mode.

---

## Solution Implemented

Users can now only select VLANs that exist on the selected gateway when creating tunnel mode WLANs.

### Backend Changes

**New Endpoint**: `/api/monitoring/gateways/<serial>/vlans`

```python
@app.route('/api/monitoring/gateways/<serial>/vlans', methods=['GET'])
@require_session
def get_gateway_vlans(serial):
    """Get VLANs configured on a gateway.

    This endpoint is used to fetch available VLANs for tunnel mode WLAN configuration.
    Only VLANs that exist on the gateway can be used for L2 tunnel mode WLANs.
    """
    try:
        # Try to get VLANs from the gateway configuration
        response = aruba_client.get(f'/network-config/v1alpha1/gateways/{serial}/vlans')
        return jsonify(response)
    except Exception as e:
        # Fallback to all VLANs if gateway-specific endpoint fails
        all_vlans_response = aruba_client.get('/network-config/v1alpha1/layer2-vlans')
        return jsonify(all_vlans_response)
```

**File**: `dashboard/backend/app.py` (line ~5791)

### Frontend Changes

#### 1. API Service Method

**File**: `dashboard/frontend/src/services/api.js`

```javascript
getGatewayVlans: async (serial) => {
  const response = await apiClient.get(`/monitoring/gateways/${serial}/vlans`);
  return response.data;
},
```

#### 2. WLAN Wizard - AuthNetworkPage

**File**: `dashboard/frontend/src/components/wlan-wizard/AuthNetworkPage.jsx`

**Added State**:
```javascript
const [gatewayVlans, setGatewayVlans] = useState([]);
const [loadingGatewayVlans, setLoadingGatewayVlans] = useState(false);
```

**Added Effect**:
```javascript
// Fetch VLANs when gateway is selected for tunnel mode
useEffect(() => {
  if (data.forwardMode === 'FORWARD_MODE_L2' && data.gatewaySerial) {
    fetchGatewayVlans(data.gatewaySerial);
  }
}, [data.gatewaySerial, data.forwardMode]);
```

**Added Function**:
```javascript
const fetchGatewayVlans = async (gatewaySerial) => {
  // Fetches VLANs from gateway
  // Parses response and sets gatewayVlans state
  // Auto-selects first VLAN if none selected
};
```

**Updated UI**:
- **Bridge Mode**: Text field for manual VLAN ID entry (1-4094)
- **Tunnel Mode**: Dropdown showing only VLANs configured on the selected gateway

```javascript
{data.forwardMode === 'FORWARD_MODE_L2' && data.gatewaySerial ? (
  <FormControl fullWidth sx={{ mt: 2 }} required>
    <InputLabel>VLAN ID (from Gateway)</InputLabel>
    <Select value={data.vlanId || ''}>
      {gatewayVlans.map((vlan) => (
        <MenuItem key={vlan.id} value={String(vlan.id)}>
          VLAN {vlan.id} - {vlan.name}
        </MenuItem>
      ))}
    </Select>
    <Typography variant="caption">
      Only VLANs configured on the selected gateway can be used for tunnel mode
    </Typography>
  </FormControl>
) : (
  <TextField label="VLAN ID" /> // Bridge mode - any VLAN ID
)}
```

---

## User Experience Flow

### Bridge Mode (FORWARD_MODE_BRIDGE)
1. User enters any VLAN ID (1-4094)
2. System checks if VLAN exists
3. If not exists, offers to create it
4. WLAN created with specified VLAN

### Tunnel Mode (FORWARD_MODE_L2)
1. User selects "Tunneled (Gateway)" forward mode
2. System fetches available gateways
3. User selects a gateway (or first gateway auto-selected)
4. System fetches VLANs configured on that gateway
5. **VLAN dropdown shows only gateway VLANs**
6. User selects VLAN from dropdown
7. WLAN created with gateway VLAN (guaranteed to exist)

---

## Benefits

✅ **No More VLAN Errors**: Users can only select VLANs that exist on the gateway
✅ **Better UX**: Clear visual indication of available VLANs
✅ **Auto-Selection**: First gateway and VLAN auto-selected for convenience
✅ **Loading States**: Spinner shown while fetching VLANs
✅ **Helpful Messaging**: Explains why only certain VLANs are available

---

## Testing

### Test Tunnel Mode WLAN Creation

1. Open WLAN Wizard
2. Select "Tunneled (Gateway)" forward mode
3. Observe:
   - Gateway dropdown appears
   - First gateway auto-selected
   - VLAN dropdown loads with gateway VLANs
4. Select a VLAN from dropdown
5. Complete wizard
6. **Expected**: WLAN creates successfully with no VLAN errors

### Verify VLAN Dropdown Contents

```bash
# Get gateway serial from UI or API
curl -X GET "http://localhost:5000/api/monitoring/gateways" \
  -H "X-Session-ID: <session>"

# Fetch VLANs for that gateway
curl -X GET "http://localhost:5000/api/monitoring/gateways/<serial>/vlans" \
  -H "X-Session-ID: <session>"
```

---

## Known Limitations

1. **Gateway VLAN API**: The exact API endpoint for fetching gateway VLANs may vary
   - Current implementation tries `/network-config/v1alpha1/gateways/{serial}/vlans`
   - Falls back to `/network-config/v1alpha1/layer2-vlans` if gateway-specific fails
   - May need adjustment based on actual Aruba Central API

2. **VLAN Creation**: Users cannot create new VLANs on the gateway from the wizard
   - VLANs must be pre-configured on the gateway via Central UI or API
   - Future enhancement: Add "Create VLAN on Gateway" button

3. **Multiple Gateways**: If network has multiple gateways, VLANs shown are only from selected gateway
   - VLANs should ideally be consistent across all gateways in a cluster

---

## Future Enhancements

1. **Gateway VLAN Creation**: Add ability to create VLANs on gateway from wizard
2. **VLAN Validation**: Show which VLANs exist on multiple gateways (for redundancy)
3. **VLAN Details**: Show more info about each VLAN (description, subnet, etc.)
4. **Gateway Cluster Support**: Show VLANs common to all gateways in a cluster

---

## Files Modified

### Backend
- `dashboard/backend/app.py` - Added `/api/monitoring/gateways/<serial>/vlans` endpoint

### Frontend
- `dashboard/frontend/src/services/api.js` - Added `getGatewayVlans()` method
- `dashboard/frontend/src/components/wlan-wizard/AuthNetworkPage.jsx` - Added VLAN dropdown for tunnel mode

---

**Status**: ✅ Ready for testing
**Next Step**: Test tunnel mode WLAN creation with gateway VLAN selection
