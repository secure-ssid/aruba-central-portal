/**
 * Network Topology Page
 * SVG-based hierarchical topology visualization of the network
 * Shows: Network -> Sites -> Gateways -> Switches -> APs
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Skeleton,
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import HubIcon from '@mui/icons-material/Hub';
import WifiIcon from '@mui/icons-material/Wifi';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { deviceAPI, configAPI, monitoringAPIv2 } from '../services/api';

// --- Layout constants ---
const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const LEVEL_GAP_Y = 120;
const NODE_GAP_X = 30;
const CANVAS_PADDING = 80;

// --- Color constants ---
const ACCENT = 'var(--color-primary)';
const ACCENT_DIM = 'rgba(255, 102, 0, 0.3)';
const NODE_BG = 'rgba(30, 30, 40, 0.85)';
const NODE_BORDER = 'var(--border-default)';
const NODE_HOVER_BORDER = ACCENT;
const STATUS_UP = 'var(--color-success)';
const STATUS_DOWN = 'var(--color-error)';
const STATUS_UNKNOWN = 'var(--text-secondary)';
const LINE_COLOR = 'rgba(255, 102, 0, 0.35)';
const LINE_HIGHLIGHT = ACCENT;

/**
 * Build the topology tree from fetched data.
 * Returns { nodes: [], edges: [], levels: { 0: [...], 1: [...], ... } }
 */
function buildTopology(sites, devices) {
  const nodes = [];
  const edges = [];
  const levels = {};

  const addLevel = (lvl, node) => {
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(node);
  };

  // Root node
  const rootId = '__root__';
  const rootNode = {
    id: rootId,
    label: 'Network',
    type: 'root',
    level: 0,
    status: 'Up',
    serial: null,
  };
  nodes.push(rootNode);
  addLevel(0, rootNode);

  // Group devices by site
  const siteMap = {};
  const siteIdSet = new Set();

  (sites || []).forEach((s) => {
    const siteId = s.site_id || s.id || s.name;
    const siteName = s.site_name || s.name || siteId;
    siteMap[siteName] = { site: s, gateways: [], switches: [], aps: [] };
    siteIdSet.add(siteName);
  });

  (devices || []).forEach((d) => {
    const siteName = d.site || d.site_name || null;
    const dtype = (d.device_type || d.deviceType || d.aruba_device_type || '').toLowerCase();

    if (siteName && !siteMap[siteName]) {
      siteMap[siteName] = { site: { name: siteName }, gateways: [], switches: [], aps: [] };
    }

    const bucket = siteName ? siteMap[siteName] : null;

    if (!bucket) {
      if (!siteMap['Unassigned']) {
        siteMap['Unassigned'] = { site: { name: 'Unassigned' }, gateways: [], switches: [], aps: [] };
      }
      const unassigned = siteMap['Unassigned'];
      if (dtype.includes('gw') || dtype.includes('gateway') || dtype.includes('controller')) {
        unassigned.gateways.push(d);
      } else if (dtype.includes('switch') || dtype.includes('cx') || dtype.includes('hp')) {
        unassigned.switches.push(d);
      } else if (dtype.includes('ap') || dtype.includes('iap') || dtype.includes('access')) {
        unassigned.aps.push(d);
      } else {
        // Default to switch if unknown
        unassigned.switches.push(d);
      }
      return;
    }

    if (dtype.includes('gw') || dtype.includes('gateway') || dtype.includes('controller')) {
      bucket.gateways.push(d);
    } else if (dtype.includes('switch') || dtype.includes('cx') || dtype.includes('hp')) {
      bucket.switches.push(d);
    } else if (dtype.includes('ap') || dtype.includes('iap') || dtype.includes('access')) {
      bucket.aps.push(d);
    } else {
      bucket.switches.push(d);
    }
  });

  // Build site nodes (level 1)
  Object.keys(siteMap).forEach((siteName) => {
    const entry = siteMap[siteName];
    const siteId = `site__${siteName}`;
    const totalDevices = entry.gateways.length + entry.switches.length + entry.aps.length;
    if (totalDevices === 0 && siteName !== 'Unassigned') {
      // Still show empty sites
    }
    const siteNode = {
      id: siteId,
      label: siteName,
      type: 'site',
      level: 1,
      status: 'Up',
      serial: null,
      deviceCount: totalDevices,
    };
    nodes.push(siteNode);
    addLevel(1, siteNode);
    edges.push({ from: rootId, to: siteId });

    // Gateways (level 2)
    entry.gateways.forEach((gw, i) => {
      const gwId = `gw__${gw.serial || gw.serialNumber || siteName + '_gw_' + i}`;
      const gwNode = {
        id: gwId,
        label: gw.name || gw.device_name || gw.deviceName || gw.hostname || 'Gateway',
        type: 'gateway',
        level: 2,
        status: normalizeStatus(gw.status || gw.device_status || gw.deviceStatus),
        serial: gw.serial || gw.serialNumber || '',
        model: gw.model || '',
        ip: gw.ip_address || gw.ipv4 || gw.ipAddress || '',
      };
      nodes.push(gwNode);
      addLevel(2, gwNode);
      edges.push({ from: siteId, to: gwId });
    });

    // If no gateways, connect switches directly to site
    const switchParents = entry.gateways.length > 0
      ? entry.gateways.map((gw, i) => `gw__${gw.serial || gw.serialNumber || siteName + '_gw_' + i}`)
      : [siteId];

    // Switches (level 3)
    entry.switches.forEach((sw, i) => {
      const swId = `sw__${sw.serial || sw.serialNumber || siteName + '_sw_' + i}`;
      const swNode = {
        id: swId,
        label: sw.name || sw.device_name || sw.deviceName || sw.hostname || 'Switch',
        type: 'switch',
        level: entry.gateways.length > 0 ? 3 : 2,
        status: normalizeStatus(sw.status || sw.device_status || sw.deviceStatus),
        serial: sw.serial || sw.serialNumber || '',
        model: sw.model || '',
        ip: sw.ip_address || sw.ipv4 || sw.ipAddress || '',
      };
      nodes.push(swNode);
      addLevel(swNode.level, swNode);
      // Connect to first parent (round-robin for visual spread)
      const parentId = switchParents[i % switchParents.length];
      edges.push({ from: parentId, to: swId });
    });

    // APs (level 4)
    const apParents = entry.switches.length > 0
      ? entry.switches.map((sw, i) => `sw__${sw.serial || sw.serialNumber || siteName + '_sw_' + i}`)
      : switchParents;

    entry.aps.forEach((ap, i) => {
      const apId = `ap__${ap.serial || ap.serialNumber || siteName + '_ap_' + i}`;
      const baseLevel = entry.gateways.length > 0 ? 3 : 2;
      const apLevel = entry.switches.length > 0 ? baseLevel + 1 : baseLevel;
      const apNode = {
        id: apId,
        label: ap.name || ap.device_name || ap.deviceName || ap.hostname || 'AP',
        type: 'ap',
        level: apLevel,
        status: normalizeStatus(ap.status || ap.device_status || ap.deviceStatus),
        serial: ap.serial || ap.serialNumber || '',
        model: ap.model || '',
        ip: ap.ip_address || ap.ipv4 || ap.ipAddress || '',
      };
      nodes.push(apNode);
      addLevel(apLevel, apNode);
      const parentId = apParents[i % apParents.length];
      edges.push({ from: parentId, to: apId });
    });
  });

  return { nodes, edges, levels };
}

function normalizeStatus(s) {
  if (!s) return 'Unknown';
  const lower = s.toLowerCase();
  if (lower === 'up' || lower === 'online' || lower === 'active') return 'Up';
  if (lower === 'down' || lower === 'offline') return 'Down';
  return 'Unknown';
}

/**
 * Compute x, y positions for each node based on levels.
 * Returns a map: nodeId -> { x, y }
 */
function layoutNodes(levels) {
  const positions = {};
  const maxLevel = Math.max(...Object.keys(levels).map(Number));

  // First pass: determine widths per level
  const levelWidths = {};
  for (let lvl = 0; lvl <= maxLevel; lvl++) {
    const count = (levels[lvl] || []).length;
    levelWidths[lvl] = count * (NODE_WIDTH + NODE_GAP_X) - NODE_GAP_X;
  }

  const maxWidth = Math.max(...Object.values(levelWidths), 0);

  for (let lvl = 0; lvl <= maxLevel; lvl++) {
    const nodesAtLevel = levels[lvl] || [];
    const totalWidth = nodesAtLevel.length * (NODE_WIDTH + NODE_GAP_X) - NODE_GAP_X;
    const startX = CANVAS_PADDING + (maxWidth - totalWidth) / 2;
    const y = CANVAS_PADDING + lvl * LEVEL_GAP_Y;

    nodesAtLevel.forEach((node, i) => {
      positions[node.id] = {
        x: startX + i * (NODE_WIDTH + NODE_GAP_X),
        y,
      };
    });
  }

  return {
    positions,
    totalWidth: maxWidth + CANVAS_PADDING * 2 + NODE_WIDTH,
    totalHeight: CANVAS_PADDING * 2 + (maxLevel + 1) * LEVEL_GAP_Y + NODE_HEIGHT,
  };
}

/**
 * Get icon SVG path data for a device type
 */
function getNodeIcon(type) {
  switch (type) {
    case 'root':
      return { icon: 'globe', color: ACCENT };
    case 'site':
      return { icon: 'location', color: '#42a5f5' };
    case 'gateway':
      return { icon: 'router', color: '#ab47bc' };
    case 'switch':
      return { icon: 'hub', color: '#26a69a' };
    case 'ap':
      return { icon: 'wifi', color: '#ffa726' };
    default:
      return { icon: 'globe', color: 'var(--text-secondary)' };
  }
}

function getStatusColor(status) {
  if (status === 'Up') return STATUS_UP;
  if (status === 'Down') return STATUS_DOWN;
  return STATUS_UNKNOWN;
}

function truncateLabel(label, maxLen = 16) {
  if (!label) return '';
  return label.length > maxLen ? label.slice(0, maxLen - 1) + '\u2026' : label;
}

// --- SVG Icon components rendered inline ---
function SvgIcon({ type, x, y, size = 18 }) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  switch (type) {
    case 'globe':
      return (
        <g>
          <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx={cx} cy={cy} rx={(r - 1) * 0.5} ry={r - 1} fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1={x + 1} y1={cy} x2={x + size - 1} y2={cy} stroke="currentColor" strokeWidth="1" />
        </g>
      );
    case 'location':
      return (
        <g>
          <path
            d={`M${cx} ${y + 2} C${x + 3} ${y + 2} ${x + 2} ${y + 6} ${x + 2} ${cy}
              C${x + 2} ${y + 12} ${cx} ${y + size - 1} ${cx} ${y + size - 1}
              C${cx} ${y + size - 1} ${x + size - 2} ${y + 12} ${x + size - 2} ${cy}
              C${x + size - 2} ${y + 6} ${x + size - 3} ${y + 2} ${cx} ${y + 2}Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx={cx} cy={cy - 1} r={2.5} fill="currentColor" />
        </g>
      );
    case 'router':
      return (
        <g>
          <rect x={x + 2} y={y + 5} width={size - 4} height={size - 10} rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1={cx} y1={y + 2} x2={cx} y2={y + 5} stroke="currentColor" strokeWidth="1.5" />
          <line x1={x + 4} y1={y + 2} x2={x + size - 4} y2={y + 2} stroke="currentColor" strokeWidth="1.5" />
          <circle cx={x + 5} cy={cy} r="1" fill="currentColor" />
          <circle cx={cx} cy={cy} r="1" fill="currentColor" />
          <circle cx={x + size - 5} cy={cy} r="1" fill="currentColor" />
        </g>
      );
    case 'hub':
      return (
        <g>
          <rect x={x + 1} y={y + 4} width={size - 2} height={size - 8} rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1={x + 4} y1={y + size - 4} x2={x + 4} y2={y + size - 1} stroke="currentColor" strokeWidth="1.2" />
          <line x1={cx} y1={y + size - 4} x2={cx} y2={y + size - 1} stroke="currentColor" strokeWidth="1.2" />
          <line x1={x + size - 4} y1={y + size - 4} x2={x + size - 4} y2={y + size - 1} stroke="currentColor" strokeWidth="1.2" />
          <circle cx={x + 5} cy={cy - 1} r="1.2" fill="currentColor" />
          <circle cx={x + size - 5} cy={cy - 1} r="1.2" fill="currentColor" />
        </g>
      );
    case 'wifi':
      return (
        <g>
          <path d={`M${cx - 6} ${cy - 2} A 8 8 0 0 1 ${cx + 6} ${cy - 2}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M${cx - 4} ${cy + 1} A 5 5 0 0 1 ${cx + 4} ${cy + 1}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy + 4} r="1.5" fill="currentColor" />
        </g>
      );
    default:
      return <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="currentColor" strokeWidth="1.5" />;
  }
}

// --- Main component ---
export default function TopologyPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [sites, setSites] = useState([]);

  // Transform state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  // Interaction state
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdges, setHoveredEdges] = useState(new Set());

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [devicesResult, sitesResult] = await Promise.allSettled([
        deviceAPI.getAll(),
        configAPI.getSites(),
      ]);

      if (devicesResult.status === 'fulfilled') {
        const list = devicesResult.value.devices || devicesResult.value.items || [];
        setDevices(list);
      } else {
        console.warn('Failed to fetch devices:', devicesResult.reason);
      }

      if (sitesResult.status === 'fulfilled') {
        const list = sitesResult.value.sites || sitesResult.value.items || [];
        setSites(list);
      } else {
        console.warn('Failed to fetch sites:', sitesResult.reason);
      }
    } catch (err) {
      setError(err.message || 'Failed to load topology data');
    } finally {
      setLoading(false);
    }
  };

  // Build topology
  const topology = useMemo(() => buildTopology(sites, devices), [sites, devices]);
  const layout = useMemo(() => layoutNodes(topology.levels), [topology.levels]);

  // Build edge lookup for hover highlighting
  const edgesByNode = useMemo(() => {
    const map = {};
    topology.edges.forEach((e, i) => {
      if (!map[e.from]) map[e.from] = [];
      if (!map[e.to]) map[e.to] = [];
      map[e.from].push(i);
      map[e.to].push(i);
    });
    return map;
  }, [topology.edges]);

  // Stats
  const stats = useMemo(() => {
    const counts = { total: 0, sites: 0, gateways: 0, switches: 0, aps: 0 };
    topology.nodes.forEach((n) => {
      if (n.type === 'site') counts.sites++;
      else if (n.type === 'gateway') { counts.gateways++; counts.total++; }
      else if (n.type === 'switch') { counts.switches++; counts.total++; }
      else if (n.type === 'ap') { counts.aps++; counts.total++; }
    });
    return counts;
  }, [topology.nodes]);

  // Hover handler
  const handleNodeHover = useCallback((nodeId) => {
    setHoveredNode(nodeId);
    if (nodeId && edgesByNode[nodeId]) {
      setHoveredEdges(new Set(edgesByNode[nodeId]));
    } else {
      setHoveredEdges(new Set());
    }
  }, [edgesByNode]);

  // Click handler
  const handleNodeClick = useCallback((node) => {
    if (node.serial) {
      navigate(`/devices/${node.serial}`);
    }
  }, [navigate]);

  // Zoom handler
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.2), 3));
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    // Only pan if clicking on the SVG background, not on a node
    if (e.target.tagName === 'svg' || e.target.classList?.contains('topology-bg')) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      translateStart.current = { ...translate };
    }
  }, [translate]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.2));
  }, []);

  // Attach wheel listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // --- Render ---

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Network Topology
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hierarchical view of your network infrastructure
          </Typography>
        </Box>
        {/* Stats skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" width={140} height={48} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
        {/* Canvas skeleton */}
        <Paper
          sx={{
            height: 'calc(100vh - 280px)',
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: ACCENT, mb: 2 }} />
            <Typography color="text.secondary">Loading topology data...</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  const hasDevices = topology.nodes.length > 1; // more than just root

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Network Topology
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hierarchical view of your network infrastructure
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<LanguageIcon />}
          label={`${stats.total} Devices`}
          sx={{
            bgcolor: 'rgba(255, 102, 0, 0.12)',
            color: ACCENT,
            fontWeight: 600,
            '& .MuiChip-icon': { color: ACCENT },
          }}
        />
        <Chip
          icon={<LocationOnIcon />}
          label={`${stats.sites} Sites`}
          sx={{
            bgcolor: 'rgba(66, 165, 245, 0.12)',
            color: '#42a5f5',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#42a5f5' },
          }}
        />
        <Chip
          icon={<RouterIcon />}
          label={`${stats.gateways} Gateways`}
          sx={{
            bgcolor: 'rgba(171, 71, 188, 0.12)',
            color: '#ab47bc',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#ab47bc' },
          }}
        />
        <Chip
          icon={<HubIcon />}
          label={`${stats.switches} Switches`}
          sx={{
            bgcolor: 'rgba(38, 166, 154, 0.12)',
            color: '#26a69a',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#26a69a' },
          }}
        />
        <Chip
          icon={<WifiIcon />}
          label={`${stats.aps} APs`}
          sx={{
            bgcolor: 'rgba(255, 167, 38, 0.12)',
            color: '#ffa726',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#ffa726' },
          }}
        />
      </Box>

      {/* Topology canvas */}
      <Paper
        sx={{
          position: 'relative',
          height: 'calc(100vh - 280px)',
          minHeight: 400,
          overflow: 'hidden',
          bgcolor: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-default)',
          cursor: isPanning ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Zoom controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Tooltip title="Zoom In" placement="left">
            <IconButton
              size="small"
              onClick={zoomIn}
              sx={{
                bgcolor: 'rgba(30,30,40,0.9)',
                border: '1px solid var(--border-default)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(50,50,60,0.9)', borderColor: ACCENT },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out" placement="left">
            <IconButton
              size="small"
              onClick={zoomOut}
              sx={{
                bgcolor: 'rgba(30,30,40,0.9)',
                border: '1px solid var(--border-default)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(50,50,60,0.9)', borderColor: ACCENT },
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View" placement="left">
            <IconButton
              size="small"
              onClick={resetView}
              sx={{
                bgcolor: 'rgba(30,30,40,0.9)',
                border: '1px solid var(--border-default)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(50,50,60,0.9)', borderColor: ACCENT },
              }}
            >
              <CenterFocusStrongIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.5)',
              mt: 0.5,
            }}
          >
            {Math.round(scale * 100)}%
          </Typography>
        </Box>

        {!hasDevices ? (
          /* Empty state */
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LanguageIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No devices found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect devices to your network to see the topology view.
            </Typography>
          </Box>
        ) : (
          /* SVG Topology */
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
            viewBox={`0 0 ${layout.totalWidth} ${layout.totalHeight}`}
            preserveAspectRatio="xMidYMin meet"
          >
            {/* Background rect for pan target */}
            <rect
              className="topology-bg"
              x="0"
              y="0"
              width={layout.totalWidth}
              height={layout.totalHeight}
              fill="transparent"
            />

            {/* Edges */}
            {topology.edges.map((edge, i) => {
              const fromPos = layout.positions[edge.from];
              const toPos = layout.positions[edge.to];
              if (!fromPos || !toPos) return null;

              const x1 = fromPos.x + NODE_WIDTH / 2;
              const y1 = fromPos.y + NODE_HEIGHT;
              const x2 = toPos.x + NODE_WIDTH / 2;
              const y2 = toPos.y;

              const midY = (y1 + y2) / 2;
              const isHighlighted = hoveredEdges.has(i);

              return (
                <path
                  key={`edge-${i}`}
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  fill="none"
                  stroke={isHighlighted ? LINE_HIGHLIGHT : LINE_COLOR}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  style={{
                    transition: 'stroke 0.2s, stroke-width 0.2s',
                  }}
                />
              );
            })}

            {/* Nodes */}
            {topology.nodes.map((node) => {
              const pos = layout.positions[node.id];
              if (!pos) return null;

              const { icon, color } = getNodeIcon(node.type);
              const isHovered = hoveredNode === node.id;
              const isClickable = !!node.serial;
              const statusColor = getStatusColor(node.status);

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => handleNodeHover(node.id)}
                  onMouseLeave={() => handleNodeHover(null)}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                >
                  {/* Card background */}
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="8"
                    ry="8"
                    fill={NODE_BG}
                    stroke={isHovered ? NODE_HOVER_BORDER : NODE_BORDER}
                    strokeWidth={isHovered ? 2 : 1}
                    style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                  />

                  {/* Glow on hover */}
                  {isHovered && (
                    <rect
                      x={pos.x - 2}
                      y={pos.y - 2}
                      width={NODE_WIDTH + 4}
                      height={NODE_HEIGHT + 4}
                      rx="10"
                      ry="10"
                      fill="none"
                      stroke={ACCENT_DIM}
                      strokeWidth="3"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Icon */}
                  <g style={{ color }}>
                    <SvgIcon type={icon} x={pos.x + 10} y={pos.y + 10} size={18} />
                  </g>

                  {/* Label */}
                  <text
                    x={pos.x + 34}
                    y={pos.y + 23}
                    fill="#fff"
                    fontSize="11"
                    fontFamily="Inter, Roboto, sans-serif"
                    fontWeight="600"
                  >
                    {truncateLabel(node.label)}
                  </text>

                  {/* Sub-label (type or model) */}
                  <text
                    x={pos.x + 34}
                    y={pos.y + 38}
                    fill="rgba(255,255,255,0.5)"
                    fontSize="9"
                    fontFamily="Inter, Roboto, sans-serif"
                  >
                    {node.type === 'root'
                      ? `${stats.total} devices`
                      : node.type === 'site'
                        ? `${node.deviceCount || 0} devices`
                        : node.model
                          ? truncateLabel(node.model, 14)
                          : node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                  </text>

                  {/* Status indicator */}
                  {node.type !== 'root' && node.type !== 'site' && (
                    <>
                      <circle
                        cx={pos.x + NODE_WIDTH - 14}
                        cy={pos.y + 14}
                        r="4"
                        fill={statusColor}
                      />
                      {node.status === 'Up' && (
                        <circle
                          cx={pos.x + NODE_WIDTH - 14}
                          cy={pos.y + 14}
                          r="6"
                          fill="none"
                          stroke={statusColor}
                          strokeWidth="1"
                          opacity="0.4"
                        />
                      )}
                    </>
                  )}

                  {/* Tooltip on hover */}
                  {isHovered && node.type !== 'root' && (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={pos.x + NODE_WIDTH + 8}
                        y={pos.y}
                        width={160}
                        height={node.serial ? 70 : 44}
                        rx="6"
                        fill="rgba(20, 20, 30, 0.95)"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1"
                      />
                      <text
                        x={pos.x + NODE_WIDTH + 16}
                        y={pos.y + 16}
                        fill="#fff"
                        fontSize="10"
                        fontWeight="600"
                        fontFamily="Inter, Roboto, sans-serif"
                      >
                        {node.label}
                      </text>
                      <text
                        x={pos.x + NODE_WIDTH + 16}
                        y={pos.y + 30}
                        fill="rgba(255,255,255,0.6)"
                        fontSize="9"
                        fontFamily="Inter, Roboto, sans-serif"
                      >
                        Status: {node.status}
                        {node.ip ? ` | ${node.ip}` : ''}
                      </text>
                      {node.serial && (
                        <>
                          <text
                            x={pos.x + NODE_WIDTH + 16}
                            y={pos.y + 44}
                            fill="rgba(255,255,255,0.5)"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            S/N: {node.serial}
                          </text>
                          <text
                            x={pos.x + NODE_WIDTH + 16}
                            y={pos.y + 58}
                            fill={ACCENT}
                            fontSize="9"
                            fontFamily="Inter, Roboto, sans-serif"
                          >
                            Click to view details
                          </text>
                        </>
                      )}
                      {!node.serial && node.type === 'site' && (
                        <text
                          x={pos.x + NODE_WIDTH + 16}
                          y={pos.y + 44}
                          fill="rgba(255,255,255,0.5)"
                          fontSize="9"
                          fontFamily="Inter, Roboto, sans-serif"
                        >
                          {node.deviceCount || 0} devices assigned
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Legend */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            display: 'flex',
            gap: 2,
            bgcolor: 'rgba(20, 20, 30, 0.85)',
            borderRadius: 2,
            px: 2,
            py: 1,
            border: '1px solid var(--border-default)',
          }}
        >
          {[
            { label: 'Gateway', color: '#ab47bc' },
            { label: 'Switch', color: '#26a69a' },
            { label: 'AP', color: '#ffa726' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: item.color,
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_UP }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>
              Up
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_DOWN }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>
              Down
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
