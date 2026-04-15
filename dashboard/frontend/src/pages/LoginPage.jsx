/**
 * Login Page Component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Chip,
} from '@mui/material';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import { authAPI } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await authAPI.login();
      onLogin();
      // Navigate to dashboard after successful login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please check server configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #111827 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.07,
          background: `
            radial-gradient(ellipse at 30% 50%, #FF6600 0%, transparent 60%),
            radial-gradient(ellipse at 70% 70%, #FF6600 0%, transparent 60%)
          `,
        }}
      />

      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          mx: 2,
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(255,102,0,0.3)',
              }}
            >
              <NetworkCheckIcon sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6600 0%, #FF9933 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Aruba Central
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Network Management Dashboard
            </Typography>
            <Chip
              icon={<CloudIcon sx={{ fontSize: 14 }} />}
              label="HPE GreenLake"
              size="small"
              sx={{
                mt: 1.5,
                backgroundColor: 'rgba(255, 102, 0, 0.1)',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
                border: '1px solid rgba(255,102,0,0.2)',
              }}
            />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Security note — simplified */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              mb: 3,
              borderRadius: '8px',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <SecurityIcon sx={{ fontSize: 18, color: '#64748B', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
              Authenticated via server-side OAuth2 credentials. No password required.
            </Typography>
          </Box>

          {/* Login Button — primary CTA */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />}
            sx={{
              py: 1.75,
              fontSize: '1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
              boxShadow: '0 6px 24px rgba(255,102,0,0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A00 0%, #FF6600 100%)',
                boxShadow: '0 8px 32px rgba(255,102,0,0.5)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Connecting...' : 'Connect to Aruba Central'}
          </Button>

          {/* Setup Wizard — secondary CTA */}
          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={() => navigate('/setup-wizard')}
            startIcon={<SettingsIcon sx={{ fontSize: 16 }} />}
            sx={{
              mt: 1.5,
              py: 1,
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(255, 102, 0, 0.05)',
              },
            }}
          >
            Configure Credentials
          </Button>

          {/* Footer — minimal */}
          <Box sx={{ mt: 4, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Typography variant="caption" color="text.disabled" align="center" display="block" sx={{ fontSize: '0.68rem', mb: 1.5 }}>
              Version 2.0.0
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link
                href="https://developer.arubanetworks.com/new-central/docs/getting-started-with-rest-apis"
                target="_blank"
                rel="noopener"
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: '0.68rem', '&:hover': { color: 'primary.main' }, transition: 'color 0.15s' }}
              >
                API Docs
              </Link>
              <Link
                href="https://developer.arubanetworks.com/new-central/docs/generating-and-managing-access-tokens"
                target="_blank"
                rel="noopener"
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: '0.68rem', '&:hover': { color: 'primary.main' }, transition: 'color 0.15s' }}
              >
                Token Management
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
