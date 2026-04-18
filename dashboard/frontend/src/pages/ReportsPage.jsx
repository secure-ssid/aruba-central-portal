import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ReportingPage from './ReportingPage';
import ScheduledReportsPage from './ScheduledReportsPage';

export default function ReportsPage() {
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
          <Tab icon={<DescriptionIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Ad-hoc Export" />
          <Tab icon={<ScheduleIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Scheduled" />
        </Tabs>
      </Box>

      {tab === 0 && <ReportingPage />}
      {tab === 1 && <ScheduledReportsPage />}
    </Box>
  );
}
