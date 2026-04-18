import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AlertsPage from './AlertsPage';
import SyslogPage from './SyslogPage';

export default function NotificationsPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(() => {
    const t = parseInt(searchParams.get('tab') || '0', 10);
    return isNaN(t) ? 0 : Math.min(t, 1);
  });

  return (
    <Box>
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { fontSize: '0.82rem', textTransform: 'none', minHeight: 44, gap: 0.5 },
            '& .MuiTabs-indicator': { bgcolor: 'var(--color-primary)' },
          }}
        >
          <Tab icon={<NotificationsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Alerts" />
          <Tab icon={<ReceiptLongIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Events" />
        </Tabs>
      </Box>

      {tab === 0 && <AlertsPage />}
      {tab === 1 && <SyslogPage />}
    </Box>
  );
}
