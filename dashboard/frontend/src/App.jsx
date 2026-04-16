/**
 * Main App Component
 * Handles routing, authentication, and layout
 */

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';

// Pages that must be eager (shown before auth layout)
import SetupWizard from './pages/SetupWizard';
import LoginPage from './pages/LoginPage';

// ErrorBoundary (always needed)
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded page components
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const DevicesPage        = lazy(() => import('./pages/DevicesPage'));
const DeviceDetailPage   = lazy(() => import('./pages/DeviceDetailPage'));
const ClientsPage        = lazy(() => import('./pages/ClientsPage'));
const ConfigurationPage  = lazy(() => import('./pages/ConfigurationPage'));
const APIExplorerPage    = lazy(() => import('./pages/APIExplorerPage'));
const UsersPage          = lazy(() => import('./pages/UsersPage'));
const TroubleshootPage   = lazy(() => import('./pages/TroubleshootPage'));
const NACPage            = lazy(() => import('./pages/NACPage'));
const SettingsPage       = lazy(() => import('./pages/SettingsPage'));
const SitesPage          = lazy(() => import('./pages/SitesPage'));
const WLANsPage          = lazy(() => import('./pages/WLANsPage'));
const AlertsPage         = lazy(() => import('./pages/AlertsPage'));
const AnalyticsPage      = lazy(() => import('./pages/AnalyticsPage'));
const FirmwarePage       = lazy(() => import('./pages/FirmwarePage'));
const NetworkMonitorPage = lazy(() => import('./pages/NetworkMonitorPage'));
const TopologyPage       = lazy(() => import('./pages/TopologyPage'));
const StatusPage         = lazy(() => import('./pages/StatusPage'));
const GLDevicesPage       = lazy(() => import('./pages/GLDevicesPage'));
const GLLocationsPage     = lazy(() => import('./pages/GLLocationsPage'));
const GLTagsPage          = lazy(() => import('./pages/GLTagsPage'));
const GLSubscriptionsPage = lazy(() => import('./pages/GLSubscriptionsPage'));
const GLWorkspacesPage    = lazy(() => import('./pages/GLWorkspacesPage'));
const GLUsersPage         = lazy(() => import('./pages/GLUsersPage'));
const GLRolesPage         = lazy(() => import('./pages/GLRolesPage'));
const GLPermissionsPage   = lazy(() => import('./pages/GLPermissionsPage'));
const ReportingPage       = lazy(() => import('./pages/ReportingPage'));
const GatewayWANPage          = lazy(() => import('./pages/GatewayWANPage'));
const APTroubleshootPage      = lazy(() => import('./pages/APTroubleshootPage'));
const ScheduledReportsPage    = lazy(() => import('./pages/ScheduledReportsPage'));
const AuditLogPage            = lazy(() => import('./pages/AuditLogPage'));

// Configuration sub-pages
const ConfigurationIndexPage      = lazy(() => import('./pages/configuration/ConfigurationIndexPage'));
const ScopeManagementPage         = lazy(() => import('./pages/configuration/ScopeManagementPage'));
const ApplicationExperiencePage   = lazy(() => import('./pages/configuration/ApplicationExperiencePage'));
const CentralNACPage              = lazy(() => import('./pages/configuration/CentralNACPage'));
const CentralNACServicePage       = lazy(() => import('./pages/configuration/CentralNACServicePage'));
const ConfigManagementPage        = lazy(() => import('./pages/configuration/ConfigManagementPage'));
const ConfigurationHealthPage     = lazy(() => import('./pages/configuration/ConfigurationHealthPage'));
const ExtensionsPage              = lazy(() => import('./pages/configuration/ExtensionsPage'));
const HighAvailabilityPage        = lazy(() => import('./pages/configuration/HighAvailabilityPage'));
const InterfacesPage              = lazy(() => import('./pages/configuration/InterfacesPage'));
const VLANsNetworksPage           = lazy(() => import('./pages/configuration/VLANsNetworksPage'));
const WirelessPage                = lazy(() => import('./pages/configuration/WirelessPage'));

const LazyFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }} role="status" aria-label="Loading page">
    <CircularProgress size={28} sx={{ color: 'var(--color-primary)' }} />
  </Box>
);

/**
 * Prefetch the JS chunks for the most common navigation targets so they are
 * already in the browser cache by the time the user clicks.  This triggers
 * the dynamic import() without rendering the component.
 *
 * Called once after the authenticated layout mounts.
 */
const prefetchRouteChunks = () => {
  // Dashboard -> Devices is the most common navigation path
  import('./pages/DevicesPage');
  // Dashboard -> Clients is the second most common
  import('./pages/ClientsPage');
};

// Components (eagerly loaded — part of authenticated shell)
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Breadcrumb from './components/Breadcrumb';
import GlobalSearch from './components/GlobalSearch';
import EventFeedProvider from './components/EventFeedProvider';
import NetworkHealthBanner from './components/NetworkHealthBanner';

// Heavy components — lazy-loaded to keep the initial bundle lean
const ChatDrawer = lazy(() => import('./components/ChatDrawer'));

// Services
import { authAPI, deviceAPI, sitesConfigAPI, monitoringAPI, alertsAPI } from './services/api';

// Notifications
import { Toaster } from 'react-hot-toast';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,      // 30s before refetch
      gcTime: 5 * 60_000,     // 5min garbage collect
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Brand + theme tokens as real color strings — MUI's createTheme() parses these
// for contrast/luminance; CSS variables are not supported there. Values mirror
// `src/styles/index.css` (:root and [data-theme="light"]).
const PALETTE_BRAND = {
  primary: {
    main: '#FF6600',
    light: '#FF8C42',
    dark: '#CC4E00',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#B45309',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#15803D',
  },
};

// Theme configuration — builds either dark or light MUI theme.
// Component `styleOverrides` below still use CSS variables so live theme toggles
// on <html> stay in sync with index.css.
function buildTheme(mode) {
  const isLight = mode === 'light';
  return createTheme({
  palette: {
    mode,
    ...PALETTE_BRAND,
    background: isLight
      ? { default: '#F8FAFC', paper: '#FFFFFF' }
      : { default: '#0A0E1A', paper: '#111827' },
    surface: {
      main: isLight ? '#F1F5F9' : '#1C2333',
    },
    divider: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.07)',
    text: isLight
      ? { primary: '#0F172A', secondary: '#475569', disabled: '#94A3B8' }
      : { primary: '#F1F5F9', secondary: '#94A3B8', disabled: '#475569' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--bg-paper)',
          border: `1px solid var(--border-subtle)`,
          boxShadow: 'var(--shadow-card)',
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--bg-paper)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          boxShadow: 'var(--shadow-glow)',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)',
            boxShadow: 'var(--shadow-glow-hover)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'var(--border-divider)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'var(--border-subtle)',
        },
        head: {
          backgroundColor: 'var(--bg-surface)',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          fontSize: '0.75rem',
        },
      },
    },
  },
});
}

/**
 * Inner authenticated layout — must live inside <Router> so useLocation works.
 * Receives sidebar/search state from App to keep a single source of truth.
 *
 * Prefetches critical data on mount so the Dashboard, Devices, and Alerts
 * pages render immediately from cache instead of showing spinners.
 */
function AuthenticatedLayout({ sidebarOpen, setSidebarOpen, searchOpen, setSearchOpen, onLogout }) {
  const location = useLocation();

  // ── Prefetch critical data that most pages need ──────────────────────
  // These calls are fire-and-forget — they populate the React Query cache
  // in the background so pages that call useDevices(), useSites(), etc.
  // get an instant cache hit instead of a loading spinner.
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['devices'],
      queryFn: () => deviceAPI.getAll(),
      staleTime: 5 * 60_000,
    });
    queryClient.prefetchQuery({
      queryKey: ['sites', {}],
      queryFn: () => sitesConfigAPI.getSites({}),
      staleTime: 5 * 60_000,
    });
    queryClient.prefetchQuery({
      queryKey: ['network-health'],
      queryFn: () => monitoringAPI.getNetworkHealth(),
      staleTime: 30_000,
    });
    queryClient.prefetchQuery({
      queryKey: ['alerts'],
      queryFn: () => alertsAPI.getAll(),
      staleTime: 30_000,
    });

    // Prefetch JS chunks for the most common navigation targets
    prefetchRouteChunks();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <Box
        id="main-content"
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen ? 0 : '-240px',
          // Right-side chat panel doesn't need bottom padding
        }}
      >
        <TopBar
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <NetworkHealthBanner />
        <Box sx={{ p: 3 }}>
          <Breadcrumb />
          <ErrorBoundary>
          <Suspense fallback={<LazyFallback />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/:serial" element={<DeviceDetailPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/wlans" element={<WLANsPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
            <Route path="/configuration/index" element={<ErrorBoundary><ConfigurationIndexPage /></ErrorBoundary>} />
            <Route path="/configuration/scope-management" element={<ErrorBoundary><ScopeManagementPage /></ErrorBoundary>} />
            <Route path="/configuration/application-experience" element={<ErrorBoundary><ApplicationExperiencePage /></ErrorBoundary>} />
            <Route path="/configuration/central-nac" element={<ErrorBoundary><CentralNACPage /></ErrorBoundary>} />
            <Route path="/configuration/central-nac-service" element={<ErrorBoundary><CentralNACServicePage /></ErrorBoundary>} />
            <Route path="/configuration/config-management" element={<ErrorBoundary><ConfigManagementPage /></ErrorBoundary>} />
            <Route path="/configuration/health" element={<ErrorBoundary><ConfigurationHealthPage /></ErrorBoundary>} />
            <Route path="/configuration/extensions" element={<ErrorBoundary><ExtensionsPage /></ErrorBoundary>} />
            <Route path="/configuration/high-availability" element={<ErrorBoundary><HighAvailabilityPage /></ErrorBoundary>} />
            <Route path="/configuration/interfaces" element={<ErrorBoundary><InterfacesPage /></ErrorBoundary>} />
            <Route path="/configuration/vlans-networks" element={<ErrorBoundary><VLANsNetworksPage /></ErrorBoundary>} />
            <Route path="/configuration/wireless" element={<ErrorBoundary><WirelessPage /></ErrorBoundary>} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/nac" element={<NACPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/firmware" element={<FirmwarePage />} />
            <Route path="/troubleshoot" element={<TroubleshootPage />} />
            <Route path="/network-monitor" element={<NetworkMonitorPage />} />
            <Route path="/topology" element={<TopologyPage />} />
            <Route path="/api-explorer" element={<APIExplorerPage />} />
            <Route path="/reporting" element={<ErrorBoundary><ReportingPage /></ErrorBoundary>} />
            <Route path="/gateway-wan" element={<ErrorBoundary><GatewayWANPage /></ErrorBoundary>} />
            <Route path="/ap-troubleshoot" element={<ErrorBoundary><APTroubleshootPage /></ErrorBoundary>} />
            <Route path="/scheduled-reports" element={<ErrorBoundary><ScheduledReportsPage /></ErrorBoundary>} />
            <Route path="/audit-log" element={<ErrorBoundary><AuditLogPage /></ErrorBoundary>} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/status" element={<StatusPage />} />
            {/* Global Layer (MSP) routes */}
            <Route path="/gl/devices"       element={<ErrorBoundary><GLDevicesPage /></ErrorBoundary>} />
            <Route path="/gl/locations"     element={<ErrorBoundary><GLLocationsPage /></ErrorBoundary>} />
            <Route path="/gl/tags"          element={<ErrorBoundary><GLTagsPage /></ErrorBoundary>} />
            <Route path="/gl/subscriptions" element={<ErrorBoundary><GLSubscriptionsPage /></ErrorBoundary>} />
            <Route path="/gl/workspaces"    element={<ErrorBoundary><GLWorkspacesPage /></ErrorBoundary>} />
            <Route path="/gl/users"         element={<ErrorBoundary><GLUsersPage /></ErrorBoundary>} />
            <Route path="/gl/roles"         element={<ErrorBoundary><GLRolesPage /></ErrorBoundary>} />
            <Route path="/gl/permissions"   element={<ErrorBoundary><GLPermissionsPage /></ErrorBoundary>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Network assistant chat drawer — lazy-loaded, fixed to viewport */}
      <Suspense fallback={null}>
        <ChatDrawer pageContext={location.pathname} />
      </Suspense>
    </Box>
  );
}

function AppInner() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      // First check if credentials are configured
      const setupResponse = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/setup/check`);
      const setupData = await setupResponse.json();

      if (setupData.needs_setup) {
        setNeedsSetup(true);
        setIsLoading(false);
        return;
      }

      // If configured, check auth
      checkAuth();
    } catch (error) {
      console.error('Setup check failed:', error);
      setIsLoading(false);
    }
  };
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      // Ctrl+/ is handled internally by ChatDrawer
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkAuth = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        await authAPI.getStatus();
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    // Navigate to root and reload to pick up new credentials
    window.location.href = '/';
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          role="status"
          aria-live="polite"
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: 'var(--bg-paper)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
          success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
          error: { iconTheme: { primary: 'var(--color-error)', secondary: '#fff' } },
        }}
      />
      <Router>
        {needsSetup ? (
          <Routes>
            <Route path="*" element={<SetupWizard onComplete={handleSetupComplete} />} />
          </Routes>
        ) : !isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/setup-wizard" element={<SetupWizard onComplete={handleSetupComplete} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <EventFeedProvider>
            <AuthenticatedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              onLogout={handleLogout}
            />
          </EventFeedProvider>
        )}
      </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppInner />
    </ThemeContextProvider>
  );
}

export default App;
