import { useState, useEffect, memo, useCallback, useMemo as useMemoReact } from 'react';
import useDebouncedValue from '../hooks/useDebouncedValue';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  OutlinedInput,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  Cable as CableIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { List } from 'react-window';
import { useNavigate } from 'react-router-dom';
import { getClients, getClientTrends, getTopClients } from '../services/api';
import useSites from '../hooks/useSites';

/** Threshold: use virtualized rendering when filtered rows exceed this count. */
const VIRTUALIZE_THRESHOLD = 200;
const CLIENT_ROW_HEIGHT = 52;

/** `essid` is often a string, sometimes `{ name, ssid, ... }` from Central. */
function getEssidRaw(client) {
  if (!client || typeof client !== 'object') return '';
  const e = client.essid;
  if (typeof e === 'string' && e.trim()) return e.trim();
  if (e && typeof e === 'object') {
    const n = e.name ?? e.ssid ?? e.essid;
    if (n != null && String(n).trim()) return String(n).trim();
  }
  return '';
}

/**
 * Best-effort SSID / WLAN name for display and search.
 * Central commonly uses wlanName; legacy UI used ssid / string essid.
 */
function getClientSsid(client) {
  if (!client || typeof client !== 'object') return '';
  const fromFields = [
    client.ssid,
    client.wlanName,
    client.wlan_name,
    client.wlanProfileName,
    client.wlan_profile_name,
    client.userWlan,
    client.connected_ssid,
    client.associated_ssid,
    getEssidRaw(client),
    client.network,
  ];
  for (const v of fromFields) {
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

/**
 * Aruba Central uses clientConnectionType (e.g. WIRELESS / WIRED); older UI code used `type`.
 * WIRELESS must be detected before WIRED because "WIRELESS".includes("WIRED") is true.
 */
function getClientConnectionKind(client) {
  if (!client || typeof client !== 'object') return 'unknown';
  const raw =
    client.clientConnectionType ||
    client.connectionType ||
    client.connection_type ||
    client.network_type ||
    client.networkType ||
    client.type ||
    '';
  const u = String(raw).toUpperCase().replace(/\s+/g, '_');
  if (!u) {
    if (client.ssid || client.wlanName || client.wlan_name || getEssidRaw(client)) return 'wireless';
    return 'unknown';
  }
  if (u.includes('WIRELESS') || u.includes('WLAN') || u.includes('WIFI') || u.includes('802')) {
    return 'wireless';
  }
  if (u.includes('WIRED') || u.includes('ETHERNET') || u === 'ETH') {
    return 'wired';
  }
  return 'unknown';
}

/**
 * Sortable header button - shared style for table column headers
 */
const SortHeaderButton = ({ label, column, sortColumn, sortDirection, onSort }) => (
  <Box
    component="button"
    type="button"
    aria-label={`Sort by ${label}`}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      cursor: 'pointer',
      userSelect: 'none',
      background: 'none',
      border: 'none',
      color: 'inherit',
      font: 'inherit',
      padding: 0,
    }}
    onClick={() => onSort(column)}
  >
    {label}
    {sortColumn === column && (
      sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
    )}
  </Box>
);

/**
 * Memoized virtual row renderer for the clients table.
 * Used when the number of sorted/filtered clients exceeds VIRTUALIZE_THRESHOLD.
 */
const ClientVirtualRow = memo(function ClientVirtualRow({ index, style, data }) {
  const { rows, getClientConnectionKind: getKind, getClientSsid: getSsid, onClientRowClick } = data;
  const client = rows[index];
  const rowMac = client?.macAddress || client?.mac || client?.macaddr || '';

  const status = client.status?.toLowerCase() || 'unknown';
  const isConnected = status === 'connected';
  const isFailed = status === 'failed';
  const isConnecting = status === 'connecting';
  const isDisconnected = status === 'disconnected';
  const experience = client.experience || 'Good';
  const statusColor = isConnected ? 'var(--color-success)'
    : isFailed ? 'var(--color-error)'
    : (isConnecting || isDisconnected) ? 'var(--color-warning)'
    : 'var(--text-secondary)';

  const clientKind = getKind(client);
  const typeChipLabel =
    client.clientConnectionType || client.connectionType || client.type ||
    (clientKind === 'wireless' ? 'Wireless' : clientKind === 'wired' ? 'Wired' : 'Unknown');

  const statusLabel = isConnected ? `Connected - ${experience} Performance`
    : isFailed ? 'Failed'
    : isConnecting ? 'Connecting'
    : isDisconnected ? 'Disconnected' : '';

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle, rgba(224,224,224,1))',
        boxSizing: 'border-box',
        cursor: rowMac && onClientRowClick ? 'pointer' : undefined,
      }}
      role="row"
      onClick={() => rowMac && onClientRowClick?.(rowMac)}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {/* Name */}
      <div style={{ flex: 2, padding: '4px 16px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
        {(isConnected || isFailed || isConnecting || isDisconnected) && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor, flexShrink: 0 }} />
        )}
        <span style={{ overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {client.name || client.hostname || client.macaddr || client.mac || client.macAddress || 'Unknown'}
          </Typography>
          {statusLabel && (
            <Typography variant="caption" color="textSecondary" noWrap display="block">
              {statusLabel}
            </Typography>
          )}
        </span>
      </div>
      {/* Type */}
      <div style={{ flex: 1, padding: '4px 16px' }}>
        <Chip
          size="small"
          label={typeChipLabel}
          icon={clientKind === 'wireless' ? <WifiIcon /> : <CableIcon />}
          sx={{
            ...(clientKind === 'wireless' && { backgroundColor: 'var(--color-primary)', color: 'white', '& .MuiChip-icon': { color: 'white' } }),
            ...(clientKind === 'wired' && { backgroundColor: '#01A982', color: 'white', '& .MuiChip-icon': { color: 'white' } }),
            ...(clientKind !== 'wireless' && clientKind !== 'wired' && { backgroundColor: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }),
          }}
        />
      </div>
      {/* MAC */}
      <div style={{ flex: 1.2, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }} noWrap>
          {client.mac || client.macaddr || client.macAddress || 'N/A'}
        </Typography>
      </div>
      {/* IP */}
      <div style={{ flex: 1, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>{client.ipv4 || '-'}</Typography>
      </div>
      {/* VLAN */}
      <div style={{ flex: 0.7, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>
          {client.vlanId ? `${client.vlanId}${client.network ? ` (${client.network})` : ''}` : client.network || '-'}
        </Typography>
      </div>
      {/* Connected To */}
      <div style={{ flex: 1.2, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>
          {client.connectedTo || client.connected_to || client.device || client.associatedDevice || '-'}
        </Typography>
      </div>
      {/* Port */}
      <div style={{ flex: 0.7, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }} noWrap>
          {client.port || client.portId || client.port_id || client.interface || client.portName || '-'}
        </Typography>
      </div>
      {/* Role */}
      <div style={{ flex: 0.7, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>{client.role || '-'}</Typography>
      </div>
      {/* SSID */}
      <div style={{ flex: 1, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap color={getSsid(client) ? 'text.primary' : 'text.secondary'}>
          {getSsid(client) || '-'}
        </Typography>
      </div>
      {/* Site */}
      <div style={{ flex: 1, padding: '4px 16px', overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>{client.siteName || 'Unknown'}</Typography>
      </div>
    </div>
  );
});

/**
 * ClientsTable - renders either a standard MUI table or a virtualized table
 * depending on the number of rows.
 */
const ClientsTable = memo(function ClientsTable({
  sortedClients,
  selectedSites,
  sortColumn,
  sortDirection,
  handleSort,
  getClientConnectionKind,
  getClientSsid,
  onClientRowClick,
}) {
  const useVirtualized = sortedClients.length > VIRTUALIZE_THRESHOLD;

  const itemData = useMemoReact(
    () => ({ rows: sortedClients, getClientConnectionKind, getClientSsid, onClientRowClick }),
    [sortedClients, getClientConnectionKind, getClientSsid, onClientRowClick]
  );

  const headerColumns = [
    { label: 'Name', column: 'name', flex: 2 },
    { label: 'Type', column: 'type', flex: 1 },
    { label: 'MAC Address', column: 'mac', flex: 1.2 },
    { label: 'IP Address', column: 'ip', flex: 1 },
    { label: 'VLAN', column: 'vlan', flex: 0.7 },
    { label: 'Connected To', column: 'connectedTo', flex: 1.2 },
    { label: 'Port', column: 'port', flex: 0.7 },
    { label: 'Role', column: 'role', flex: 0.7 },
    { label: 'SSID', column: 'ssid', flex: 1 },
    { label: 'Site Name', column: 'site', flex: 1 },
  ];

  return (
    <TableContainer>
      <Table sx={useVirtualized ? { tableLayout: 'fixed' } : undefined}>
        <TableHead>
          <TableRow>
            {headerColumns.map((col) => (
              <TableCell key={col.column}>
                <SortHeaderButton
                  label={col.label}
                  column={col.column}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {!useVirtualized && (
          <TableBody>
            {sortedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    {selectedSites.length === 0
                      ? 'Please select one or more sites to view clients'
                      : 'No clients found for the selected sites'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedClients.map((client) => {
                const status = client.status?.toLowerCase() || 'unknown';
                const isConnected = status === 'connected';
                const isFailed = status === 'failed';
                const isConnecting = status === 'connecting';
                const isDisconnected = status === 'disconnected';
                const experience = client.experience || 'Good';

                const statusColor = isConnected ? 'var(--color-success)'
                  : isFailed ? 'var(--color-error)'
                  : (isConnecting || isDisconnected) ? 'var(--color-warning)'
                  : 'var(--text-secondary)';

                const clientKind = getClientConnectionKind(client);
                const clientType = clientKind;
                const typeChipLabel =
                  client.clientConnectionType ||
                  client.connectionType ||
                  client.type ||
                  (clientKind === 'wireless' ? 'Wireless' : clientKind === 'wired' ? 'Wired' : 'Unknown');

                const rowMac = client.macAddress || client.mac || client.macaddr || '';
                return (
                  <TableRow
                    key={client.id || client.mac || client.macaddr || client.macAddress}
                    hover
                    onClick={() => rowMac && onClientRowClick?.(rowMac)}
                    sx={{ cursor: rowMac && onClientRowClick ? 'pointer' : undefined }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {(isConnected || isFailed || isConnecting || isDisconnected) && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
                        )}
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={rowMac && onClientRowClick ? { color: 'primary.main' } : undefined}
                          >
                            {client.name || client.hostname || client.macaddr || client.mac || client.macAddress || 'Unknown'}
                          </Typography>
                          {isConnected && <Typography variant="caption" color="textSecondary">Connected - {experience} Performance</Typography>}
                          {isFailed && <Typography variant="caption" color="textSecondary">Failed</Typography>}
                          {isConnecting && <Typography variant="caption" color="textSecondary">Connecting</Typography>}
                          {isDisconnected && <Typography variant="caption" color="textSecondary">Disconnected</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={typeChipLabel}
                        icon={clientType === 'wireless' ? <WifiIcon /> : <CableIcon />}
                        sx={{
                          ...(clientType === 'wireless' && { backgroundColor: 'var(--color-primary)', color: 'white', '& .MuiChip-icon': { color: 'white' } }),
                          ...(clientType === 'wired' && { backgroundColor: '#01A982', color: 'white', '& .MuiChip-icon': { color: 'white' } }),
                          ...(clientType !== 'wireless' && clientType !== 'wired' && { backgroundColor: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-secondary)' }),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {client.mac || client.macaddr || client.macAddress || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {client.ipv4 && <Typography variant="body2">{client.ipv4}</Typography>}
                        {client.ipv6 && <Typography variant="caption" color="textSecondary" display="block">{client.ipv6}</Typography>}
                        {!client.ipv4 && !client.ipv6 && <Typography variant="body2" color="textSecondary">-</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {client.vlanId ? (
                        <Typography variant="body2">{client.vlanId}{client.network && ` (${client.network})`}</Typography>
                      ) : client.network ? (
                        <Typography variant="body2">{client.network}</Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {client.connectedTo || client.connected_to || client.device || client.associatedDevice || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {client.port || client.portId || client.port_id || client.interface || client.portName || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{client.role || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={getClientSsid(client) ? 'text.primary' : 'text.secondary'}>
                        {getClientSsid(client) || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{client.siteName || 'Unknown'}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        )}
      </Table>

      {/* Virtualized body for large client lists */}
      {useVirtualized && (
        <>
          {sortedClients.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                {selectedSites.length === 0
                  ? 'Please select one or more sites to view clients'
                  : 'No clients found for the selected sites'}
              </Typography>
            </Box>
          ) : (
            <List
              height={Math.min(sortedClients.length * CLIENT_ROW_HEIGHT, 600)}
              itemCount={sortedClients.length}
              itemSize={CLIENT_ROW_HEIGHT}
              width="100%"
              itemData={itemData}
              overscanCount={15}
            >
              {ClientVirtualRow}
            </List>
          )}
        </>
      )}
    </TableContainer>
  );
});

function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false); // Don't block initial render
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 250);
  const [selectedStatus, setSelectedStatus] = useState(null); // null = all statuses
  const [selectedTypes, setSelectedTypes] = useState(['wireless', 'wired']);
  const [viewMode, setViewMode] = useState('list');
  const [selectedSites, setSelectedSites] = useState([]);
  const [sitesLoaded, setSitesLoaded] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Shared hook handles multi-API-fallback site loading
  const { sites, loading: loadingSites, error: sitesError } = useSites();

  // When sites finish loading, select all by default and mark as loaded
  useEffect(() => {
    if (!loadingSites) {
      if (sites.length > 0) {
        const siteIds = sites.map(site => site.scopeId || site.id || site.siteId || site.site_id).filter(Boolean);
        setSelectedSites(siteIds);
      } else {
        setSelectedSites([]);
      }
      if (sitesError) {
        setError(sitesError);
      }
      setSitesLoaded(true);
    }
  }, [sites, loadingSites, sitesError]);

  useEffect(() => {
    // Only load data after sites have been loaded (even if empty)
    if (sitesLoaded) {
      loadData();
    }
  }, [selectedSites, sitesLoaded]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (selectedSites.length === 0) {
        setClients([]);
        setTopClients([]);
        setTrends(null);
        setLoading(false);
        return;
      }

      // Fetch clients using monitoring API (same approach as SitesPage)
      // First try to get all clients without site_id
      let allClients = [];
      let useMonitoringAPI = false;
      
      try {
        const clientsResponse = await getClients(); // No siteId = uses monitoring API
        if (clientsResponse) {
          if (Array.isArray(clientsResponse)) {
            allClients = clientsResponse;
            useMonitoringAPI = allClients.length > 0;
          } else if (clientsResponse.items && Array.isArray(clientsResponse.items)) {
            allClients = clientsResponse.items;
            useMonitoringAPI = allClients.length > 0;
          } else if (clientsResponse.count > 0 || clientsResponse.total > 0) {
            // Response has count but no items array - might be summary only
            useMonitoringAPI = false;
          }
        }
      } catch (err) {
        useMonitoringAPI = false;
      }
      
      // If monitoring API didn't return clients, fetch from selected sites
      if (!useMonitoringAPI && selectedSites.length > 0) {
        const clientPromises = selectedSites.map(siteId =>
          getClients(siteId).catch(() => {
            return { items: [], total: 0, count: 0 };
          })
        );
        
        const clientsResults = await Promise.allSettled(clientPromises);
        clientsResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const clientData = result.value;
            const siteId = selectedSites[index];
            const site = sites.find(s => {
              const sId = s.scopeId || s.id || s.siteId || s.site_id;
              return sId?.toString() === siteId?.toString();
            });
            const siteName = site?.scopeName || site?.name || site?.siteName || site?.site_name || `Site ${siteId}`;
            
            // Handle different response formats
            let itemsArray = [];
            if (Array.isArray(clientData)) {
              itemsArray = clientData;
            } else if (clientData?.items && Array.isArray(clientData.items)) {
              itemsArray = clientData.items;
            } else if (clientData?.clients && Array.isArray(clientData.clients)) {
              itemsArray = clientData.clients;
            } else if (clientData?.data && Array.isArray(clientData.data)) {
              itemsArray = clientData.data;
            }
            
            itemsArray.forEach(client => {
              allClients.push({
                ...client,
                siteId: siteId,
                siteName: siteName,
              });
            });
          }
        });
      }

      // Filter clients by selected sites if we got all clients from monitoring API
      // Only filter if not all sites are selected
      if (allClients.length > 0 && selectedSites.length > 0 && selectedSites.length < sites.length) {
        // Filter to only selected sites
        allClients = allClients.filter(client => {
          const clientSiteId = client.siteId || client['site-id'] || client.site_id;
          const matches = selectedSites.some(siteId => {
            const siteIdStr = siteId?.toString();
            const clientSiteIdStr = clientSiteId?.toString();
            return siteIdStr === clientSiteIdStr;
          });
          return matches;
        });
      }

      // Add site names to clients if not already present
      allClients = allClients.map(client => {
        if (!client.siteName) {
          const clientSiteId = client.siteId || client['site-id'] || client.site_id;
          const site = sites.find(s => {
            const siteId = s.scopeId || s.id || s.siteId || s.site_id;
            return siteId?.toString() === clientSiteId?.toString();
          });
          if (site) {
            client.siteId = clientSiteId;
            client.siteName = site.scopeName || site.name || site.siteName || site.site_name || `Site ${clientSiteId}`;
          } else if (clientSiteId) {
            // If we have a site ID but can't find the site, still set it
            client.siteId = clientSiteId;
            client.siteName = `Site ${clientSiteId}`;
          }
        }
        return client;
      });

      const [topData, trendsData] = await Promise.allSettled([
        selectedSites.length > 0 ? getTopClients(selectedSites[0]) : Promise.resolve({ items: [] }),
        selectedSites.length > 0 ? getClientTrends(selectedSites[0]) : Promise.resolve(null),
      ]);

      setClients(allClients);
      setTopClients(topData.status === 'fulfilled' ? (topData.value?.items || []) : []);
      setTrends(trendsData.status === 'fulfilled' ? trendsData.value : null);
    } catch (err) {
      console.error('Error loading client data:', err);
      setError(err.message || 'Failed to load client data');
      setClients([]);
      setTopClients([]);
      setTrends(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate counts for all statuses
  const statusCounts = {
    connected: clients.filter((c) => c.status?.toLowerCase() === 'connected').length,
    failed: clients.filter((c) => c.status?.toLowerCase() === 'failed').length,
    connecting: clients.filter((c) => c.status?.toLowerCase() === 'connecting').length,
    disconnected: clients.filter((c) => c.status?.toLowerCase() === 'disconnected').length,
  };

  // Calculate counts for type filters - filtered by selected status if one is selected
  const clientsForTypeCount = selectedStatus
    ? clients.filter((c) => c.status?.toLowerCase() === selectedStatus?.toLowerCase())
    : clients;
  
  const typeCounts = {
    wireless: clientsForTypeCount.filter((c) => getClientConnectionKind(c) === 'wireless').length,
    wired: clientsForTypeCount.filter((c) => getClientConnectionKind(c) === 'wired').length,
  };

  const filteredClients = clients.filter((client) => {
    // Search filter (debounced to avoid per-keystroke re-renders)
    const search = debouncedSearch.toLowerCase();
    const matchesSearch =
      !debouncedSearch ||
      client.name?.toLowerCase().includes(search) ||
      client.hostname?.toLowerCase().includes(search) ||
      client.mac?.toLowerCase().includes(search) ||
      client.macaddr?.toLowerCase().includes(search) ||
      client.macAddress?.toLowerCase().includes(search) ||
      client.ipv4?.toLowerCase().includes(search) ||
      client.network?.toLowerCase().includes(search) ||
      client.connectedTo?.toLowerCase().includes(search) ||
      client.connected_to?.toLowerCase().includes(search) ||
      client.device?.toLowerCase().includes(search) ||
      client.associatedDevice?.toLowerCase().includes(search) ||
      client.port?.toLowerCase().includes(search) ||
      client.portId?.toLowerCase().includes(search) ||
      client.port_id?.toLowerCase().includes(search) ||
      client.interface?.toLowerCase().includes(search) ||
      client.portName?.toLowerCase().includes(search) ||
      client.essid?.toLowerCase?.().includes(search) ||
      getEssidRaw(client).toLowerCase().includes(search) ||
      getClientSsid(client).toLowerCase().includes(search) ||
      client.ssid?.toLowerCase().includes(search);

    // Status filter
    const matchesStatus =
      !selectedStatus ||
      client.status?.toLowerCase() === selectedStatus?.toLowerCase();

    // Type filter (API: clientConnectionType; legacy: type)
    const kind = getClientConnectionKind(client);
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(kind) ||
      (kind === 'unknown' && selectedTypes.length > 0);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'name':
        aValue = (a.name || a.mac || '').toLowerCase();
        bValue = (b.name || b.mac || '').toLowerCase();
        break;
      case 'type':
        aValue = getClientConnectionKind(a);
        bValue = getClientConnectionKind(b);
        break;
      case 'mac':
        aValue = (a.mac || a.macaddr || a.macAddress || '').toLowerCase();
        bValue = (b.mac || b.macaddr || b.macAddress || '').toLowerCase();
        break;
      case 'ip':
        aValue = (a.ipv4 || '').toLowerCase();
        bValue = (b.ipv4 || '').toLowerCase();
        break;
      case 'vlan':
        aValue = a.vlanId || a.network || '';
        bValue = b.vlanId || b.network || '';
        break;
      case 'connectedTo':
        aValue = (a.connectedTo || a.connected_to || a.device || a.associatedDevice || '').toLowerCase();
        bValue = (b.connectedTo || b.connected_to || b.device || b.associatedDevice || '').toLowerCase();
        break;
      case 'port':
        aValue = (a.port || a.portId || a.port_id || a.interface || a.portName || '').toLowerCase();
        bValue = (b.port || b.portId || b.port_id || b.interface || b.portName || '').toLowerCase();
        break;
      case 'role':
        aValue = (a.role || '').toLowerCase();
        bValue = (b.role || '').toLowerCase();
        break;
      case 'site':
        aValue = (a.siteName || '').toLowerCase();
        bValue = (b.siteName || '').toLowerCase();
        break;
      case 'ssid':
        aValue = getClientSsid(a).toLowerCase();
        bValue = getClientSsid(b).toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleTypeClick = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleStatusClick = (status) => {
    setSelectedStatus((prev) => {
      // If clicking the same status, deselect it (show all)
      if (prev === status) {
        return null;
      }
      return status;
    });
  };

  // Don't block the entire page on loading - show content with loading indicators
  // The loading state should only apply to the data loading, not the initial page render

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
      </Box>

      {/* Filters Row */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Status Filters Group */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={selectedStatus === 'connected' ? 'contained' : 'outlined'}
              color="success"
              size="small"
              startIcon={selectedStatus === 'connected' && <CheckCircleIcon />}
              onClick={() => handleStatusClick('connected')}
            >
              Connected ({statusCounts.connected})
            </Button>
            <Button
              variant={selectedStatus === 'failed' ? 'contained' : 'outlined'}
              color="error"
              size="small"
              startIcon={selectedStatus === 'failed' && <CheckCircleIcon />}
              onClick={() => handleStatusClick('failed')}
            >
              Failed ({statusCounts.failed})
            </Button>
            <Button
              variant={selectedStatus === 'connecting' ? 'contained' : 'outlined'}
              color="info"
              size="small"
              startIcon={selectedStatus === 'connecting' && <CheckCircleIcon />}
              onClick={() => handleStatusClick('connecting')}
            >
              Connecting ({statusCounts.connecting})
            </Button>
            <Button
              variant={selectedStatus === 'disconnected' ? 'contained' : 'outlined'}
              size="small"
              startIcon={selectedStatus === 'disconnected' && <CheckCircleIcon />}
              onClick={() => handleStatusClick('disconnected')}
              sx={{
                ...(selectedStatus === 'disconnected' && {
                  backgroundColor: 'var(--color-warning)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#D97706',
                  },
                }),
                ...(selectedStatus !== 'disconnected' && {
                  borderColor: 'var(--color-warning)',
                  color: 'var(--color-warning)',
                  '&:hover': {
                    borderColor: '#D97706',
                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                  },
                }),
              }}
            >
              Disconnected ({statusCounts.disconnected})
            </Button>
          </Box>
        </Box>

        {/* Type Filters Group */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant={selectedTypes.includes('wireless') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleTypeClick('wireless')}
              startIcon={selectedTypes.includes('wireless') && <CheckCircleIcon />}
              sx={{
                ...(selectedTypes.includes('wireless') && {
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                  },
                }),
                ...(!selectedTypes.includes('wireless') && {
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-dark)',
                    backgroundColor: 'rgba(255, 102, 0, 0.04)',
                  },
                }),
              }}
            >
              Wireless ({typeCounts.wireless})
            </Button>
            <Button
              variant={selectedTypes.includes('wired') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleTypeClick('wired')}
              startIcon={selectedTypes.includes('wired') && <CheckCircleIcon />}
              sx={{
                ...(selectedTypes.includes('wired') && {
                  backgroundColor: '#01A982',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#018F6F',
                  },
                }),
                ...(!selectedTypes.includes('wired') && {
                  borderColor: '#01A982',
                  color: '#01A982',
                  '&:hover': {
                    borderColor: '#018F6F',
                    backgroundColor: 'rgba(1, 169, 130, 0.04)',
                  },
                }),
              }}
            >
              Wired ({typeCounts.wired})
            </Button>
            {/* Site Selection Dropdown */}
            <FormControl size="small" sx={{ minWidth: 200, ml: 1 }}>
              {loadingSites && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">Loading sites...</Typography>
                </Box>
              )}
              {error && sites.length === 0 && !loadingSites && (
                <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>
              )}
              <Select
                multiple
                value={selectedSites}
                disabled={loadingSites}
                onChange={(e) => {
                  const value = e.target.value;
                  // Handle "Select All" option - if "all" is in the value, select all sites
                  if (value.includes('all')) {
                    const allSiteIds = sites.map(site => site.scopeId || site.id || site.siteId || site.site_id).filter(Boolean);
                    setSelectedSites(allSiteIds);
                  } else {
                    // Remove "all" if it's in the array and select/deselect sites normally
                    setSelectedSites(value.filter(v => v !== 'all'));
                  }
                }}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (loadingSites) return 'Loading sites...';
                  if (sites.length === 0 && !loadingSites) return 'No sites available';
                  if (selected.length === 0) return 'Select Sites';
                  if (selected.length === sites.length) return 'All Sites';
                  if (selected.length === 1) {
                    const site = sites.find(s => (s.scopeId || s.id || s.siteId || s.site_id) === selected[0]);
                    return site?.scopeName || site?.name || site?.siteName || `Site ${selected[0]}`;
                  }
                  return `${selected.length} Sites`;
                }}
                displayEmpty
              >
                <MenuItem value="all">
                  <em>Select All</em>
                </MenuItem>
                {sites.map((site) => {
                  const siteId = site.scopeId || site.id || site.siteId || site.site_id;
                  const siteName = site.scopeName || site.name || site.siteName || site.site_name || `Site ${siteId}`;
                  return (
                    <MenuItem key={siteId} value={siteId}>
                      {siteName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Search and Actions Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search clients..."
          aria-label="Search clients"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" aria-label="Filter clients">
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: { xs: 0, sm: 300 } }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
          {filteredClients.length} items
        </Typography>
        <Button type="button" variant="outlined" size="small" sx={{ whiteSpace: 'nowrap' }}>
          Create Tag
        </Button>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value="standard" displayEmpty>
            <MenuItem value="standard">Standard</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="List View">
            <IconButton
              size="small"
              color={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid View">
            <IconButton
              size="small"
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Clients Table */}
      <Paper>
        <ClientsTable
          sortedClients={sortedClients}
          selectedSites={selectedSites}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          getClientConnectionKind={getClientConnectionKind}
          getClientSsid={getClientSsid}
          onClientRowClick={(mac) => mac && navigate(`/clients/${mac}`)}
        />
      </Paper>
    </Box>
  );
}

export default ClientsPage;
