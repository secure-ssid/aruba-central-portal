/**
 * Main App Component
 * Handles routing, authentication, and layout
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
    <CircularProgress size={28} sx={{ color: '#FF6600' }} />
  </Box>
);

// Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Breadcrumb from './components/Breadcrumb';
import GlobalSearch from './components/GlobalSearch';
// TODO: EventFeedProvider is a stub (provides empty context with no consumers).
//       Implement real event feed or remove EventFeedProvider.jsx entirely.
import EventFeedProvider from './components/EventFeedProvider';
import ChatDrawer from './components/ChatDrawer';
// TODO: NetworkHealthBanner (./components/NetworkHealthBanner.jsx) is a stub
//       that returns null. Implement a real health banner or remove the file.

// Services
import { authAPI } from './services/api';

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

// Theme configuration - Aruba Orange on deep navy-black
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
    background: {
      default: '#0A0E1A',
      paper: '#111827',
    },
    surface: {
      main: '#1C2333',
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
    divider: 'rgba(255,255,255,0.07)',
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
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
          backgroundColor: '#111827',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
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
          background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
          boxShadow: '0 4px 14px rgba(255,102,0,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55A00 0%, #FF6600 100%)',
            boxShadow: '0 6px 20px rgba(255,102,0,0.5)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.07)',
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
          borderColor: 'rgba(255,255,255,0.06)',
        },
        head: {
          backgroundColor: '#1C2333',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#94A3B8',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1C2333',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

/**
 * Inner authenticated layout — must live inside <Router> so useLocation works.
 * Receives sidebar/search state from App to keep a single source of truth.
 */
function AuthenticatedLayout({ sidebarOpen, setSidebarOpen, searchOpen, setSearchOpen, onLogout }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <Box
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
        {/* NetworkHealthBanner removed — stub that returned null */}
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

      {/* Network assistant chat drawer — fixed to viewport bottom */}
      <ChatDrawer pageContext={location.pathname} />
    </Box>
  );
}

function App() {
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
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#111827', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
          success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
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

export default App;
