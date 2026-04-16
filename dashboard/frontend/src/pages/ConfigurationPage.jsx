/**
 * Configuration Page
 * Manage sites, groups, SSIDs, roles, NAC, webhooks, and bulk configuration tasks
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Button,
  TextField,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  CloudUpload as CloudUploadIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  NetworkCheck as NetworkCheckIcon,
  Add as AddIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { configAPI, bulkConfigAPI, nacAPI, webhookAPI } from '../services/api';
import { getErrorMessage } from '../utils/errorUtils';

function ConfigurationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const tabFromUrl = parseInt(searchParams.get('tab') || '0', 10);
  const [tabValue, setTabValue] = useState(tabFromUrl);

  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Update tab when URL parameter changes
  useEffect(() => {
    const tab = parseInt(searchParams.get('tab') || '0', 10);
    if (tab >= 0 && tab <= 6) {
      setTabValue(tab);
    }
  }, [searchParams]);

  // Data state
  const [sites, setSites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [wlans, setWlans] = useState([]);
  const [roles, setRoles] = useState([]);
  const [acls, setAcls] = useState([]);
  const [authServers, setAuthServers] = useState([]);
  const [macRegistrations, setMacRegistrations] = useState([]);
  const [webhooks, setWebhooks] = useState([]);

  // Groups CRUD state
  const [groupsError, setGroupsError] = useState('');
  const [groupsSnack, setGroupsSnack] = useState('');
  const [createGroupDialog, setCreateGroupDialog] = useState(false);
  const [groupForm, setGroupForm] = useState({
    group: '',
    group_attributes: {
      group_type: 'Wired',
      allowed_device_types: ['IAP', 'ArubaSwitch', 'CX', 'MobilityController'],
    },
  });
  const [savingGroup, setSavingGroup] = useState(false);
  const [deleteGroupDialog, setDeleteGroupDialog] = useState({ open: false, group: null });
  const [deletingGroup, setDeletingGroup] = useState(false);

  // Webhooks CRUD state
  const [webhooksError, setWebhooksError] = useState('');
  const [webhooksSnack, setWebhooksSnack] = useState('');
  const [createWebhookDialog, setCreateWebhookDialog] = useState(false);
  const [webhookForm, setWebhookForm] = useState({ name: '', urls: '' });
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [deleteWebhookDialog, setDeleteWebhookDialog] = useState({ open: false, webhook: null });
  const [deletingWebhook, setDeletingWebhook] = useState(false);

  // Bulk operations state
  const [bulkOperation, setBulkOperation] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  useEffect(() => {
    fetchConfigData();
  }, []);

  // Set default tab parameter if missing (only on mount)
  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: '0' }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConfigData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        sitesData,
        groupsData,
        wlansData,
        rolesData,
        aclsData,
        authServersData,
        macRegsData,
        webhooksData,
      ] = await Promise.allSettled([
        configAPI.getMonitoringSites(),
        configAPI.getGroups(),
        configAPI.getWlans(),
        configAPI.getRoles(),
        configAPI.getAcls(),
        configAPI.getAuthServers(),
        nacAPI.getMacRegistrations({ limit: 100 }),
        webhookAPI.list(),
      ]);

      if (sitesData.status === 'fulfilled') {
        const v = sitesData.value;
        setSites(Array.isArray(v) ? v : (v?.result || v?.items || v?.sites || v?.data || []));
      } else {
        setSites([]);
      }

      if (groupsData.status === 'fulfilled') {
        const v = groupsData.value;
        setGroups(Array.isArray(v) ? v : (v?.data || v?.items || v?.groups || []));
      } else {
        setGroups([]);
      }

      if (wlansData.status === 'fulfilled') {
        const v = wlansData.value;
        setWlans(Array.isArray(v) ? v : (v?.['wlan-ssid'] || v?.items || v?.['wlan-ssids'] || v?.wlans || []));
      } else {
        setWlans([]);
      }

      if (rolesData.status === 'fulfilled') {
        const v = rolesData.value;
        setRoles(Array.isArray(v) ? v : (v?.role || v?.items || v?.roles || []));
      } else {
        setRoles([]);
      }

      if (aclsData.status === 'fulfilled') {
        const v = aclsData.value;
        // ACLs endpoint returns {} when empty
        setAcls(Array.isArray(v) ? v : (v?.['role-acl'] || v?.items || v?.acls || []));
      } else {
        setAcls([]);
      }

      if (authServersData.status === 'fulfilled') {
        const v = authServersData.value;
        setAuthServers(Array.isArray(v) ? v : (v?.['auth-server'] || v?.items || v?.['auth-servers'] || []));
      } else {
        setAuthServers([]);
      }

      if (macRegsData.status === 'fulfilled') {
        const v = macRegsData.value;
        // items can be null when there are no registrations
        setMacRegistrations(Array.isArray(v) ? v : (v?.items || v?.registrations || []));
      } else {
        setMacRegistrations([]);
      }

      if (webhooksData.status === 'fulfilled') {
        const v = webhooksData.value;
        // items can be null when no webhooks are configured
        setWebhooks(Array.isArray(v) ? v : (v?.items || v?.webhooks || []));
      } else {
        setWebhooks([]);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load configuration data'));
    } finally {
      setLoading(false);
    }
  };

  // ========== Groups CRUD ==========

  const handleCreateGroup = async () => {
    if (!groupForm.group.trim()) return;
    setSavingGroup(true);
    try {
      await configAPI.createGroup({
        group: groupForm.group.trim(),
        group_attributes: groupForm.group_attributes,
      });
      setGroupsSnack('Group created');
      setCreateGroupDialog(false);
      setGroupForm({
        group: '',
        group_attributes: {
          group_type: 'Wired',
          allowed_device_types: ['IAP', 'ArubaSwitch', 'CX', 'MobilityController'],
        },
      });
      const data = await configAPI.getGroups();
      setGroups(Array.isArray(data) ? data : (data?.data || data?.items || data?.groups || []));
    } catch (err) {
      setGroupsError(err?.response?.data?.error || err.message || 'Failed to create group');
      setCreateGroupDialog(false);
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteGroupDialog.group) return;
    setDeletingGroup(true);
    try {
      await configAPI.deleteGroup(deleteGroupDialog.group.group);
      setGroupsSnack('Group deleted');
      setDeleteGroupDialog({ open: false, group: null });
      const data = await configAPI.getGroups();
      setGroups(Array.isArray(data) ? data : (data?.data || data?.items || data?.groups || []));
    } catch (err) {
      setGroupsError(err?.response?.data?.error || err.message || 'Failed to delete group');
      setDeleteGroupDialog({ open: false, group: null });
    } finally {
      setDeletingGroup(false);
    }
  };

  // ========== Webhooks CRUD ==========

  const handleCreateWebhook = async () => {
    if (!webhookForm.name.trim()) return;
    setSavingWebhook(true);
    try {
      const urls = webhookForm.urls
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
      await webhookAPI.create({ name: webhookForm.name.trim(), urls });
      setWebhooksSnack('Webhook created');
      setCreateWebhookDialog(false);
      setWebhookForm({ name: '', urls: '' });
      const data = await webhookAPI.list();
      setWebhooks(Array.isArray(data) ? data : (data?.items || data?.webhooks || []));
    } catch (err) {
      setWebhooksError(err?.response?.data?.error || err.message || 'Failed to create webhook');
      setCreateWebhookDialog(false);
    } finally {
      setSavingWebhook(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!deleteWebhookDialog.webhook) return;
    setDeletingWebhook(true);
    try {
      const id = deleteWebhookDialog.webhook.id || deleteWebhookDialog.webhook.webhook_id;
      await webhookAPI.delete(id);
      setWebhooksSnack('Webhook deleted');
      setDeleteWebhookDialog({ open: false, webhook: null });
      const data = await webhookAPI.list();
      setWebhooks(Array.isArray(data) ? data : (data?.items || data?.webhooks || []));
    } catch (err) {
      setWebhooksError(err?.response?.data?.error || err.message || 'Failed to delete webhook');
      setDeleteWebhookDialog({ open: false, webhook: null });
    } finally {
      setDeletingWebhook(false);
    }
  };

  const handleRotateWebhookKey = async (webhook) => {
    const id = webhook.id || webhook.webhook_id;
    try {
      await webhookAPI.rotateKey(id);
      setWebhooksSnack('Webhook key rotated');
    } catch (err) {
      setWebhooksError(err?.response?.data?.error || err.message || 'Failed to rotate key');
    }
  };

  // ========== Bulk Operations ==========

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        setError('CSV file must have at least a header and one data row');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });

      setCsvData(data);
      setError('');
    };

    reader.readAsText(file);
  };

  const handleBulkExecute = async () => {
    if (csvData.length === 0) {
      setError('Please upload a CSV file first');
      return;
    }

    setBulkProcessing(true);
    setError('');

    try {
      let response;

      if (bulkOperation === 'ap-rename') {
        const mappings = csvData.map((row) => ({
          serial: row.serial,
          new_name: row.new_name,
        }));
        response = await bulkConfigAPI.bulkAPRename(mappings);
      } else if (bulkOperation === 'group-assign') {
        const mappings = csvData.map((row) => ({
          serial: row.serial,
          group: row.group,
        }));
        response = await bulkConfigAPI.bulkGroupAssign(mappings);
      } else if (bulkOperation === 'site-assign') {
        const mappings = csvData.map((row) => ({
          serial: row.serial,
          site_id: row.site_id,
        }));
        response = await bulkConfigAPI.bulkSiteAssign(mappings);
      }

      setBulkResults(response);
      setShowResultsDialog(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Bulk operation failed'));
    } finally {
      setBulkProcessing(false);
    }
  };

  const clearBulkOperation = () => {
    setCsvData([]);
    setCsvFile(null);
    setBulkResults(null);
    setBulkOperation(null);
  };

  const downloadTemplate = (operation) => {
    let csvContent = '';

    if (operation === 'ap-rename') {
      csvContent = 'serial,new_name\nSERIAL_NUMBER_1,DEVICE_NAME_1\nSERIAL_NUMBER_2,DEVICE_NAME_2';
    } else if (operation === 'group-assign') {
      csvContent = 'serial,group\nSERIAL_NUMBER_1,GROUP_NAME_1\nSERIAL_NUMBER_2,GROUP_NAME_2';
    } else if (operation === 'site-assign') {
      csvContent = 'serial,site_id\nSERIAL_NUMBER_1,SITE_ID_HERE\nSERIAL_NUMBER_2,SITE_ID_HERE';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${operation}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ========== Detail Dialog ==========

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedItem(null);
  };

  // ========== Render Functions ==========

  const renderSitesTable = () => {
    if (sites.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No sites configured</Typography>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Devices</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site, index) => (
              <TableRow key={site.scopeId || site.site_id || site.id || index} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {site.scopeName || site.site_name || site.name || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>{site.city || site.address?.city || site.addressParams?.city || 'N/A'}</TableCell>
                <TableCell>{site.state || site.address?.state || 'N/A'}</TableCell>
                <TableCell>{site.country || site.address?.country || site.addressParams?.country || 'N/A'}</TableCell>
                <TableCell>
                  {site.address?.address || (typeof site.address === 'string' ? site.address : null) || site.addressParams?.address || 'N/A'}
                </TableCell>
                <TableCell align="right">{site.deviceCount ?? site.device_count ?? 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleItemClick(site, 'site')}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderGroupsTable = () => {
    return (
      <Box>
        {groupsError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setGroupsError('')}>
            {groupsError}
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
          <Button
            startIcon={<AddIcon />}
            size="small"
            variant="contained"
            onClick={() => setCreateGroupDialog(true)}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            New Group
          </Button>
        </Box>
        {groups.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No configuration groups found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Template Group</TableCell>
                  <TableCell>Devices</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group, index) => (
                  <TableRow key={group.group || index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {group.group || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={group.group_type || 'N/A'} size="small" />
                    </TableCell>
                    <TableCell>{group.template_info?.template_group || 'N/A'}</TableCell>
                    <TableCell>{group.device_count || 0}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleItemClick(group, 'group')}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete group">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteGroupDialog({ open: true, group })}
                            sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  const renderWlansTable = () => {
    if (wlans.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No SSIDs configured</Typography>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SSID Name</TableCell>
              <TableCell>Security (opmode)</TableCell>
              <TableCell>VLAN</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wlans.map((wlan, index) => {
              const name = wlan['ssid'] || wlan.ssidName || wlan.name || 'N/A';
              const security = wlan['opmode'] || wlan.securityType || wlan.security || wlan.security_type || 'N/A';
              const vlanRaw = wlan['vlan-id-range'] || wlan.vlanId || wlan.vlan_id || wlan.vlan;
              const vlan = Array.isArray(vlanRaw) ? vlanRaw.join(', ') : (vlanRaw || 'N/A');
              const wlanType = wlan['type'] || wlan.wlan_type || '';
              const enabled = wlan['enable'] === true || wlan.status === 'enabled' || wlan.enabled === true || wlan.status === true;
              return (
                <TableRow key={name + index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {name}
                    </Typography>
                  </TableCell>
                  <TableCell>{security}</TableCell>
                  <TableCell>{vlan}</TableCell>
                  <TableCell>{wlanType || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={enabled ? 'Enabled' : 'Disabled'}
                      size="small"
                      color={enabled ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleItemClick(wlan, 'ssid')}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderRolesAcls = () => {
    return (
      <Box>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h6">Roles ({roles.length})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {roles.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No roles configured
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Policies</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role, index) => (
                      <TableRow key={role.name || role.role_name || index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {role.name || role.role_name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>{role.description || role.type || role.role_type || '—'}</TableCell>
                        <TableCell>{role.policies?.length ?? 0}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleItemClick(role, 'role')}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NetworkCheckIcon color="primary" />
              <Typography variant="h6">ACLs / Firewall Rules ({acls.length})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {acls.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No ACL policies configured
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ACL Name</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {acls.map((acl, index) => (
                      <TableRow key={acl.name || acl.acl_name || index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {acl.name || acl.acl_name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>{acl.action || acl.default_action || 'N/A'}</TableCell>
                        <TableCell>{acl.count || acl.rule_count || 0}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleItemClick(acl, 'acl')}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderNAC = () => {
    return (
      <Box>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h6">Auth Servers ({authServers.length})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {authServers.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No auth servers configured
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Server Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Host / IP</TableCell>
                      <TableCell>Transport</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {authServers.map((server, index) => (
                      <TableRow key={server.name || server.server_name || index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {server.name || server.server_name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>{server.type || server.protocol || 'RADIUS'}</TableCell>
                        <TableCell>{server['auth-server-address'] || server.host || server.ip || server.server_ip || 'Local'}</TableCell>
                        <TableCell>{server['enable-radsec'] ? 'RadSec' : 'Standard'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NetworkCheckIcon color="primary" />
              <Typography variant="h6">MAC Registrations ({macRegistrations.length})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {macRegistrations.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No MAC registrations
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>MAC Address</TableCell>
                      <TableCell>Display Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Auto Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {macRegistrations.map((reg, index) => {
                      const enabled =
                        reg.enable === true || reg.enabled === true || reg.status === 'enabled' || reg.status === true;
                      return (
                        <TableRow key={reg.macAddress || reg.mac || reg.mac_address || index} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                              {reg.macAddress || reg.mac || reg.mac_address || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>{reg.displayName || reg.name || reg.display_name || reg.client_name || '—'}</TableCell>
                          <TableCell>
                            <Chip
                              label={enabled ? 'Enabled' : 'Disabled'}
                              size="small"
                              color={enabled ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            {reg.autoCreated && <Chip label="Auto" size="small" variant="outlined" />}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderWebhooks = () => {
    return (
      <Box>
        {webhooksError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setWebhooksError('')}>
            {webhooksError}
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
          <Button
            startIcon={<AddIcon />}
            size="small"
            variant="contained"
            onClick={() => setCreateWebhookDialog(true)}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            New Webhook
          </Button>
        </Box>
        {webhooks.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No webhooks configured</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webhooks.map((webhook, index) => {
                  const id = webhook.id || webhook.webhook_id;
                  const urls = webhook.urls || webhook.url_list || [];
                  const firstUrl = Array.isArray(urls) ? urls[0] : urls;
                  const displayUrl = firstUrl
                    ? firstUrl.length > 60
                      ? firstUrl.slice(0, 57) + '...'
                      : firstUrl
                    : 'N/A';
                  const active =
                    webhook.status === 'active' ||
                    webhook.enabled === true ||
                    webhook.state === 'enabled';
                  return (
                    <TableRow key={id || index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {webhook.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                          {displayUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={active ? 'Active' : 'Inactive'}
                          size="small"
                          color={active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Rotate Key">
                            <IconButton
                              size="small"
                              onClick={() => handleRotateWebhookKey(webhook)}
                              sx={{ color: 'text.secondary' }}
                            >
                              <VpnKeyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete webhook">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteWebhookDialog({ open: true, webhook })}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  const renderBulkOperations = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Bulk Configuration Operations
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload CSV files to perform bulk operations on multiple devices
        </Typography>

        {/* Operation Selection */}
        {!bulkOperation && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setBulkOperation('ap-rename')}
            >
              Bulk AP Rename
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setBulkOperation('group-assign')}
            >
              Bulk Group Assignment
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setBulkOperation('site-assign')}
            >
              Bulk Site Assignment
            </Button>
          </Box>
        )}

        {/* CSV Upload Section */}
        {bulkOperation && (
          <Card sx={{ mb: 3, border: '2px dashed', borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {bulkOperation === 'ap-rename' && 'Bulk AP Rename'}
                  {bulkOperation === 'group-assign' && 'Bulk Group Assignment'}
                  {bulkOperation === 'site-assign' && 'Bulk Site Assignment'}
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => downloadTemplate(bulkOperation)}
                >
                  Download Template
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <input
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="csv-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    fullWidth
                  >
                    {csvFile ? `Loaded: ${csvFile.name}` : 'Upload CSV File'}
                  </Button>
                </label>
              </Box>

              {csvData.length > 0 && (
                <>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Loaded {csvData.length} rows from CSV. Review below and click Execute.
                  </Alert>

                  <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 2 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {Object.keys(csvData[0]).map((header) => (
                            <TableCell key={header}>
                              <strong>{header}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {csvData.map((row, idx) => (
                          <TableRow key={idx} hover>
                            {Object.values(row).map((value, vidx) => (
                              <TableCell key={vidx}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        bulkProcessing ? <CircularProgress size={20} /> : <PlayArrowIcon />
                      }
                      onClick={handleBulkExecute}
                      disabled={bulkProcessing}
                      fullWidth
                    >
                      {bulkProcessing ? 'Processing...' : 'Execute Bulk Operation'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={clearBulkOperation}
                      disabled={bulkProcessing}
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* CSV Format Help */}
        {bulkOperation && (
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              CSV Format for {bulkOperation}:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            >
              {bulkOperation === 'ap-rename' && 'serial,new_name\nSERIAL_NUMBER_1,DEVICE_NAME_1'}
              {bulkOperation === 'group-assign' && 'serial,group\nSERIAL_NUMBER_1,GROUP_NAME_1'}
              {bulkOperation === 'site-assign' && 'serial,site_id\nSERIAL_NUMBER_1,SITE_ID_HERE'}
            </Typography>
          </Alert>
        )}
      </Box>
    );
  };

  const renderDetailDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog open={detailDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedItem.type.replace('_', ' ').toUpperCase()} Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {Object.entries(selectedItem)
              .filter(([key]) => key !== 'type')
              .map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {key.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : String(value || 'N/A')}
                  </Typography>
                </Box>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Configuration Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive network configuration and policy management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchConfigData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Configuration Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => {
              setTabValue(v);
              setSearchParams({ tab: v.toString() });
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`Sites (${sites.length})`} />
            <Tab label={`Groups (${groups.length})`} />
            <Tab label={`SSIDs (${wlans.length})`} />
            <Tab label="Roles & ACLs" />
            <Tab label="NAC" />
            <Tab label={`Webhooks (${webhooks.length})`} />
            <Tab label="Bulk Operations" />
          </Tabs>
        </Box>

        <CardContent>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: '#FF6600' }} />
              <Typography variant="body2" color="text.secondary">
                Loading configuration data from Aruba Central...
              </Typography>
            </Box>
          ) : (
            <>
              {tabValue === 0 && renderSitesTable()}
              {tabValue === 1 && renderGroupsTable()}
              {tabValue === 2 && renderWlansTable()}
              {tabValue === 3 && renderRolesAcls()}
              {tabValue === 4 && renderNAC()}
              {tabValue === 5 && renderWebhooks()}
              {tabValue === 6 && renderBulkOperations()}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bulk Results Dialog */}
      <Dialog
        open={showResultsDialog}
        onClose={() => setShowResultsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bulk Operation Results</DialogTitle>
        <DialogContent>
          {bulkResults && (
            <Box>
              <Alert
                severity={bulkResults.failed === 0 ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Total:</strong> {bulkResults.total} |{' '}
                  <strong>Successful:</strong> {bulkResults.successful} |{' '}
                  <strong>Failed:</strong> {bulkResults.failed}
                </Typography>
              </Alert>

              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Serial</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bulkResults.results.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{result.serial}</TableCell>
                        <TableCell>
                          {result.status === 'success' ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Success"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<ErrorIcon />}
                              label="Failed"
                              color="error"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {result.status === 'success'
                            ? result.new_name || result.group || result.site_id
                            : result.error}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResultsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      {renderDetailDialog()}

      {/* Create Group Dialog */}
      <Dialog
        open={createGroupDialog}
        onClose={() => setCreateGroupDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>New Device Group</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Group Name"
              value={groupForm.group}
              onChange={(e) => setGroupForm({ ...groupForm, group: e.target.value })}
              size="small"
              fullWidth
              placeholder="e.g., Branch-APs"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupDialog(false)} disabled={savingGroup}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={savingGroup || !groupForm.group.trim()}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            {savingGroup ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Group Confirmation */}
      <Dialog
        open={deleteGroupDialog.open}
        onClose={() => setDeleteGroupDialog({ open: false, group: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete group <strong>{deleteGroupDialog.group?.group}</strong>? This cannot be undone
            and will remove all device assignments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteGroupDialog({ open: false, group: null })}
            disabled={deletingGroup}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteGroup}
            variant="contained"
            color="error"
            disabled={deletingGroup}
          >
            {deletingGroup ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog
        open={createWebhookDialog}
        onClose={() => setCreateWebhookDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>New Webhook</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Webhook Name"
              value={webhookForm.name}
              onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              size="small"
              fullWidth
              placeholder="e.g., alert-receiver"
              required
            />
            <TextField
              label="URLs (comma-separated)"
              value={webhookForm.urls}
              onChange={(e) => setWebhookForm({ ...webhookForm, urls: e.target.value })}
              size="small"
              fullWidth
              placeholder="https://example.com/hook1, https://example.com/hook2"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateWebhookDialog(false)} disabled={savingWebhook}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateWebhook}
            variant="contained"
            disabled={savingWebhook || !webhookForm.name.trim()}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            {savingWebhook ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Webhook Confirmation */}
      <Dialog
        open={deleteWebhookDialog.open}
        onClose={() => setDeleteWebhookDialog({ open: false, webhook: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Webhook</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete webhook <strong>{deleteWebhookDialog.webhook?.name}</strong>? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteWebhookDialog({ open: false, webhook: null })}
            disabled={deletingWebhook}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWebhook}
            variant="contained"
            color="error"
            disabled={deletingWebhook}
          >
            {deletingWebhook ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Groups Snackbar */}
      <Snackbar
        open={!!groupsSnack}
        autoHideDuration={3000}
        onClose={() => setGroupsSnack('')}
        message={groupsSnack}
      />

      {/* Webhooks Snackbar */}
      <Snackbar
        open={!!webhooksSnack}
        autoHideDuration={3000}
        onClose={() => setWebhooksSnack('')}
        message={webhooksSnack}
      />
    </Box>
  );
}

export default ConfigurationPage;
