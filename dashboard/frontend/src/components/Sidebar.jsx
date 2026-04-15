/**
 * Sidebar — redesigned
 * - GitHub dark palette (#0D1117 base)
 * - Collapse to icon-only mode (toggle via chevron button)
 * - Grouped navigation with category headers
 * - Active items: gradient left border + glow
 * - Bottom: system status indicator (green dot + "Connected")
 * - Favorites pinned at top
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import ApiIcon from '@mui/icons-material/Api';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import TuneIcon from '@mui/icons-material/Tune';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ShieldIcon from '@mui/icons-material/Shield';
import CloudIcon from '@mui/icons-material/Cloud';

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAWER_WIDTH_OPEN   = 248;
const DRAWER_WIDTH_CLOSED = 64;

const SIDEBAR_BG    = '#0D1117';
const ACTIVE_ORANGE = '#FF6600';
const ACTIVE_LIGHT  = '#FF8C42';

// ─── Nav data ────────────────────────────────────────────────────────────────

const networkItems = [
  { text: 'Dashboard',   icon: <DashboardIcon />,    path: '/' },
  { text: 'Devices',     icon: <DevicesIcon />,      path: '/devices' },
  { text: 'Topology',    icon: <AccountTreeIcon />,  path: '/topology' },
  { text: 'Clients',     icon: <GroupsIcon />,       path: '/clients' },
  { text: 'Sites',       icon: <LocationOnIcon />,   path: '/sites' },
  { text: 'WLANs',       icon: <WifiIcon />,         path: '/wlans' },
  { text: 'Alerts',      icon: <NotificationsIcon />,path: '/alerts', badge: true },
];

const configItems = [
  { text: 'Site Config',           icon: <LocationOnIcon />,   path: '/configuration/scope-management' },
  { text: 'Wireless',              icon: <WifiIcon />,          path: '/configuration/wireless' },
  { text: 'Application Experience',icon: <AdminPanelSettingsIcon />, path: '/configuration/application-experience' },
  { text: 'NAC',                   icon: <SecurityIcon />,      path: '/nac' },
  { text: 'Extensions',            icon: <TuneIcon />,          path: '/configuration/extensions' },
  { text: 'High Availability',     icon: <MonitorHeartIcon />,  path: '/configuration/high-availability' },
  { text: 'Interfaces',            icon: <AccountTreeIcon />,   path: '/configuration/interfaces' },
  { text: 'VLANs & Networks',      icon: <NetworkCheckIcon />,  path: '/configuration/vlans-networks' },
];

const adminItems = [
  { text: 'Users',         icon: <PeopleIcon />,        path: '/users' },
  { text: 'Firmware',      icon: <SystemUpdateIcon />,  path: '/firmware' },
  { text: 'Troubleshoot',  icon: <BugReportIcon />,     path: '/troubleshoot' },
  { text: 'API Explorer',  icon: <ApiIcon />,           path: '/api-explorer' },
  { text: 'System Status', icon: <MonitorHeartIcon />,  path: '/status' },
  { text: 'Settings',      icon: <SettingsIcon />,      path: '/settings' },
];

const analyticsItems = [
  { text: 'Analytics',    icon: <AssessmentIcon />,    path: '/analytics' },
  { text: 'Reporting',    icon: <DescriptionIcon />,   path: '/reporting' },
];

const glItems = [
  { text: 'Devices',       icon: <DevicesIcon />,     path: '/gl/devices' },
  { text: 'Locations',     icon: <LocationOnIcon />,  path: '/gl/locations' },
  { text: 'Tags',          icon: <DescriptionIcon />, path: '/gl/tags' },
  { text: 'Subscriptions', icon: <AssessmentIcon />,  path: '/gl/subscriptions' },
  { text: 'Users',         icon: <PeopleIcon />,      path: '/gl/users' },
  { text: 'Roles',         icon: <ShieldIcon />,      path: '/gl/roles' },
  { text: 'Permissions',   icon: <SecurityIcon />,    path: '/gl/permissions' },
  { text: 'Workspaces',    icon: <GroupsIcon />,      path: '/gl/workspaces' },
];

const navGroups = [
  { id: 'network',       title: 'Network',         items: networkItems },
  { id: 'config',        title: 'Configuration',   items: configItems },
  { id: 'analytics',     title: 'Analytics',       items: analyticsItems },
  { id: 'admin',         title: 'Administration',  items: adminItems },
  { id: 'gl',            title: 'GreenLake',       items: glItems },
];

// ─── Pulsing dot for alert badge ─────────────────────────────────────────────

function PulsingDot() {
  return (
    <Box sx={{ position: 'relative', width: 8, height: 8, ml: 0.5, flexShrink: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          inset: -3,
          borderRadius: '50%',
          backgroundColor: 'rgba(239,68,68,0.3)',
          animation: 'pulse-ring 1.5s ease-out infinite',
          '@keyframes pulse-ring': {
            '0%': { transform: 'scale(0.8)', opacity: 1 },
            '100%': { transform: 'scale(2)', opacity: 0 },
          },
        }}
      />
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
    </Box>
  );
}

// ─── Category label (only shown when expanded) ────────────────────────────────

function CategoryLabel({ title, collapsed }) {
  if (collapsed) {
    return <Box sx={{ height: 16, borderTop: '1px solid rgba(255,255,255,0.06)', mx: 1.5, my: 1 }} />;
  }
  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#475569',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.6rem',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

// ─── Single nav item ─────────────────────────────────────────────────────────

function NavItem({ item, collapsed, isActive, isFavorite, onToggleFavorite, alertCount }) {
  const hasAlert = item.badge && alertCount > 0;

  const button = (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        mx: collapsed ? 0.75 : 1,
        mb: 0.25,
        px: collapsed ? 0 : 1.5,
        py: 0.75,
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 40,
        // Gradient left border when active
        borderLeft: isActive
          ? `3px solid ${ACTIVE_ORANGE}`
          : '3px solid transparent',
        background: isActive
          ? `linear-gradient(90deg, rgba(255,102,0,0.15) 0%, rgba(255,102,0,0.04) 100%)`
          : 'transparent',
        boxShadow: isActive
          ? 'inset 0 0 16px rgba(255,102,0,0.08)'
          : 'none',
        transition: 'all 0.18s ease',
        '&:hover': {
          background: isActive
            ? `linear-gradient(90deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.06) 100%)`
            : 'rgba(255,255,255,0.04)',
          borderLeft: `3px solid ${isActive ? ACTIVE_ORANGE : 'rgba(255,102,0,0.45)'}`,
          '& .nav-icon': {
            color: isActive ? ACTIVE_LIGHT : '#CBD5E1',
            transform: 'scale(1.08)',
          },
        },
      }}
    >
      <ListItemIcon
        className="nav-icon"
        sx={{
          color: isActive ? ACTIVE_ORANGE : '#64748B',
          minWidth: collapsed ? 0 : 34,
          mr: collapsed ? 0 : 0,
          transition: 'color 0.18s ease, transform 0.18s ease',
          justifyContent: 'center',
        }}
      >
        {item.icon}
      </ListItemIcon>

      {!collapsed && (
        <>
          <ListItemText
            primary={item.text}
            sx={{
              ml: 0.5,
              '& .MuiTypography-root': {
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#F1F5F9' : '#94A3B8',
                fontSize: '0.88rem',
                letterSpacing: '0.01em',
              },
            }}
          />

          {hasAlert && <PulsingDot />}

          <IconButton
            size="small"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(item.path); }}
            sx={{
              ml: 0.25,
              color: isFavorite ? '#F59E0B' : 'rgba(255,255,255,0.15)',
              p: 0.25,
              '&:hover': { color: '#F59E0B' },
              transition: 'color 0.15s',
            }}
          >
            {isFavorite
              ? <StarIcon sx={{ fontSize: 13 }} />
              : <StarBorderIcon sx={{ fontSize: 13 }} />}
          </IconButton>
        </>
      )}

      {collapsed && hasAlert && (
        <Box sx={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', bgcolor: '#EF4444' }} />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <ListItem disablePadding>
        <Tooltip title={item.text} placement="right" arrow>
          {button}
        </Tooltip>
      </ListItem>
    );
  }

  return <ListItem disablePadding>{button}</ListItem>;
}

// ─── Main component ───────────────────────────────────────────────────────────

function Sidebar({ open, onToggle, onSearchOpen, alertCount = 0 }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(['network', 'management', 'analytics']);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('navFavorites') || '[]');
    setFavorites(saved);
  }, []);

  const toggleGroup = (id) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (path) => {
    setFavorites((prev) => {
      const updated = prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem('navFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const getItemByPath = (path) => {
    for (const g of navGroups) {
      const found = g.items.find((i) => i.path === path);
      if (found) return found;
    }
    return null;
  };

  const drawerWidth = open ? (collapsed ? DRAWER_WIDTH_CLOSED : DRAWER_WIDTH_OPEN) : 0;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.25s ease',
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_WIDTH_CLOSED : DRAWER_WIDTH_OPEN,
          boxSizing: 'border-box',
          backgroundColor: SIDEBAR_BG,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backgroundImage: 'none',
          overflowX: 'hidden',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Brand header ───────────────────────────────────────────────── */}
        <Box
          sx={{
            px: collapsed ? 1 : 2,
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 1.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            minHeight: 64,
          }}
        >
          {/* Icon mark */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(255,102,0,0.45)',
            }}
          >
            <NetworkCheckIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>

          {/* Word mark */}
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Aruba
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.72rem',
                  color: '#475569',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                Central · MSP
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Search button ───────────────────────────────────────────────── */}
        <Box sx={{ px: collapsed ? 0.75 : 1.5, pt: 1.5, pb: 1 }}>
          {collapsed ? (
            <Tooltip title="Search (⌘K)" placement="right" arrow>
              <IconButton
                onClick={onSearchOpen}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  py: 0.75,
                  color: '#64748B',
                  '&:hover': { backgroundColor: 'rgba(255,102,0,0.08)', borderColor: 'rgba(255,102,0,0.4)', color: '#94A3B8' },
                  transition: 'all 0.18s',
                }}
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <ListItemButton
              onClick={onSearchOpen}
              sx={{
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.07)',
                py: 0.6,
                px: 1.25,
                '&:hover': {
                  backgroundColor: 'rgba(255,102,0,0.07)',
                  borderColor: 'rgba(255,102,0,0.35)',
                },
                transition: 'all 0.18s',
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <SearchIcon sx={{ fontSize: 17, color: '#64748B' }} />
              </ListItemIcon>
              <ListItemText
                primary="Search…"
                sx={{ '& .MuiTypography-root': { color: '#475569', fontSize: '0.82rem' } }}
              />
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                ⌘K
              </Typography>
            </ListItemButton>
          )}
        </Box>

        <Divider sx={{ mx: collapsed ? 0.75 : 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* ── Nav scroll area ─────────────────────────────────────────────── */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            pt: 0.5,
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: 2 },
          }}
        >
          {/* Pinned favorites */}
          {!collapsed && favorites.length > 0 && (
            <>
              <CategoryLabel title="Pinned" collapsed={collapsed} />
              <List sx={{ py: 0 }}>
                {favorites.map((path) => {
                  const item = getItemByPath(path);
                  if (!item) return null;
                  return (
                    <NavItem
                      key={path}
                      item={item}
                      collapsed={collapsed}
                      isActive={location.pathname === path}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      alertCount={alertCount}
                    />
                  );
                })}
              </List>
              <Divider sx={{ mx: 1.5, my: 0.5, borderColor: 'rgba(255,255,255,0.05)' }} />
            </>
          )}

          {/* Nav groups */}
          {navGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id);
            return (
              <Box key={group.id}>
                {/* Group header — clickable to collapse when not icon-only */}
                {!collapsed ? (
                  <Box
                    onClick={() => toggleGroup(group.id)}
                    sx={{
                      px: 2,
                      pt: 1.5,
                      pb: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover .group-label': { color: '#64748B' },
                    }}
                  >
                    <Typography
                      className="group-label"
                      variant="caption"
                      sx={{
                        color: '#334155',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.6rem',
                        flex: 1,
                        transition: 'color 0.15s',
                      }}
                    >
                      {group.title}
                    </Typography>
                    <Box
                      sx={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        color: '#334155',
                      }}
                    >
                      <ExpandMoreIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ height: 12, borderTop: group.id !== 'network' ? '1px solid rgba(255,255,255,0.05)' : 'none', mx: 0.75, mt: group.id !== 'network' ? 1 : 0 }} />
                )}

                <Collapse in={collapsed || isExpanded} timeout="auto">
                  <List sx={{ py: 0 }}>
                    {group.items.map((item) => (
                      <NavItem
                        key={item.path}
                        item={item}
                        collapsed={collapsed}
                        isActive={location.pathname === item.path}
                        isFavorite={favorites.includes(item.path)}
                        onToggleFavorite={toggleFavorite}
                        alertCount={alertCount}
                      />
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            px: collapsed ? 0.75 : 1.5,
            py: 1.25,
          }}
        >
          {/* System status indicator */}
          {!collapsed && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: '8px',
                bgcolor: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.15)',
                mb: 1,
              }}
            >
              <Box sx={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34,197,94,0.3)',
                    animation: 'status-pulse 2.5s ease-out infinite',
                    '@keyframes status-pulse': {
                      '0%': { transform: 'scale(0.7)', opacity: 1 },
                      '100%': { transform: 'scale(2.5)', opacity: 0 },
                    },
                  }}
                />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
              </Box>
              <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600, fontSize: '0.72rem' }}>
                Connected
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem' }}>
                Aruba Cloud
              </Typography>
            </Box>
          )}

          {/* Collapse/expand toggle */}
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right" arrow>
            <IconButton
              onClick={() => setCollapsed((v) => !v)}
              size="small"
              sx={{
                width: '100%',
                borderRadius: '8px',
                color: '#475569',
                border: '1px solid rgba(255,255,255,0.06)',
                py: 0.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', color: '#94A3B8' },
                transition: 'all 0.18s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 1.5,
                gap: 1,
              }}
            >
              {collapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : (
                <>
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'inherit' }}>
                    Collapse
                  </Typography>
                </>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
