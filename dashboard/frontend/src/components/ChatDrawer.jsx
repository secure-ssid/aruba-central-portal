/**
 * ChatDrawer
 * Bottom-anchored slide-up drawer for MSP operators to chat with the network
 * assistant.
 *
 * Three height states:
 *   collapsed   → 40px tab strip only
 *   half        → 40 vh
 *   full        → 90 vh
 *
 * Keyboard shortcut: Ctrl+/ (or Cmd+/) toggles between collapsed and half.
 *
 * API: POST /api/chat/message  { message, context }
 *      → { reply, intent, data? }
 *
 * Props:
 *   pageContext  {string}  Current page path forwarded as context to the API.
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  Box,
  Chip,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Badge,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SendIcon             from '@mui/icons-material/Send';
import CloseIcon            from '@mui/icons-material/Close';
import OpenInFullIcon       from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon  from '@mui/icons-material/CloseFullscreen';
import RouterIcon           from '@mui/icons-material/Router';
import KeyboardIcon         from '@mui/icons-material/Keyboard';
import DeleteOutlineIcon    from '@mui/icons-material/DeleteOutline';
import toast                from 'react-hot-toast';
import ReactMarkdown        from 'react-markdown';
import remarkGfm            from 'remark-gfm';

// ─── Polyfill for crypto.randomUUID (not available over HTTP) ────────────────

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = 'aruba_session_id';
const API_BASE    = import.meta.env.VITE_API_BASE_URL || '/api';
const MAX_MESSAGES = 50;

const PANEL_WIDTH_OPEN = 400;
const PANEL_WIDTH_WIDE = 560;
const TOPBAR_HEIGHT    = 64; // px — matches TopBar height

// Floating-card defaults and constraints
const FLOAT_DEFAULT_W = 420;
const FLOAT_DEFAULT_H = 600;
const FLOAT_MIN_W     = 320;
const FLOAT_MIN_H     = 400;
const FLOAT_MAX_W     = 800;
const FLOAT_MAX_H     = 900;
const FLOAT_MARGIN    = 20;
const SIZE_STORAGE_KEY = 'chat_drawer_size';

const ORANGE      = 'var(--color-primary)';
const PAPER_BG    = 'var(--bg-paper)';
const SURFACE_BG  = 'var(--bg-surface-dark)';
const BORDER_CLR  = 'var(--border-default)';

// Quick-action suggestion chips shown when input is empty (no prior context)
const SUGGESTION_CHIPS = [
  'Show devices',
  'AP status',
  'Show alerts',
  'Site health',
  'Show clients',
  'Help',
];

// Follow-up chips shown after an assistant response, keyed by intent name
const FOLLOWUP_CHIPS = {
  ap_status:            ['Show down APs', 'AP status at site', 'Bounce an AP', 'Firmware status'],
  site_health:          ['Show devices', 'Show alerts', 'Show clients', 'Site list'],
  alert_summary:        ['Critical alerts only', 'Acknowledge alert', 'Show events'],
  firmware_status:      ['Show devices', 'AP status', 'Device inventory'],
  client_count:         ['Show clients on SSID', 'Top clients by usage', 'Find client by MAC'],
  clients_by_ssid:      ['Show all clients', 'Top clients', 'Find client by MAC'],
  client_by_mac:        ['Show clients on SSID', 'Disconnect client', 'Show alerts'],
  find_client:          ['Show all clients', 'Disconnect client', 'Client by MAC'],
  switch_port_errors:   ['Show VLANs on switch', 'Bounce port', 'Show devices'],
  show_switch_vlans:    ['Switch port status', 'Show devices', 'Site health'],
  switch_vlans:         ['Switch port status', 'Show devices', 'Site health'],
  show_switch_interfaces: ['Show VLANs on switch', 'Bounce port', 'Show devices'],
  wlan_list:            ['Show clients', 'Clients on SSID', 'Site health'],
  device_inventory:     ['AP status', 'Firmware status', 'Site health'],
  device_status:        ['Show alerts', 'Firmware status', 'AP status'],
  ping_test:            ['Run traceroute', 'Show devices', 'AP status'],
  traceroute:           ['Run ping', 'Show devices', 'AP status'],
  site_list:            ['Site health', 'Show devices', 'Show clients'],
  top_clients:          ['Show all clients', 'Top bandwidth', 'Site health'],
  top_bandwidth:        ['Top clients', 'Show devices', 'AP status'],
  bounce_ap:            ['AP status', 'Show alerts', 'Show devices'],
  bounce_port:          ['Switch port status', 'Show VLANs', 'Show devices'],
  ack_alert:            ['Show alerts', 'AP status', 'Site health'],
  disconnect_client:    ['Show clients', 'Show alerts', 'AP status'],
  ap_radios:            ['AP status', 'Show clients', 'Site health'],
  device_events:        ['Show alerts', 'AP status', 'Firmware status'],
  help:                 ['Show devices', 'AP status', 'Show alerts', 'Show clients'],
};

// Intent badge colors — maps intent name prefix to a theme-aligned color
const INTENT_COLORS = {
  ap_status:          'var(--color-secondary)',
  site_health:        'var(--color-success)',
  site_list:          'var(--color-success)',
  client_count:       'var(--color-purple)',
  clients_by_ssid:    'var(--color-purple)',
  client_by_mac:      'var(--color-purple)',
  find_client:        'var(--color-purple)',
  disconnect_client:  'var(--color-error)',
  alert_summary:      'var(--color-warning)',
  firmware_status:    'var(--color-secondary)',
  wlan_list:          '#06B6D4',
  top_clients:        '#78716C',
  top_bandwidth:      '#78716C',
  device_inventory:   'var(--text-muted)',
  device_status:      'var(--text-muted)',
  switch_port_errors: '#A855F7',
  bounce_ap:          'var(--color-error)',
  bounce_port:        'var(--color-error)',
  ack_alert:          'var(--color-warning)',
  ping_test:              '#0EA5E9',
  traceroute:             '#0EA5E9',
  help:                   'var(--text-muted)',
  show_switch_vlans:      '#A855F7',
  switch_vlans:           '#A855F7',
  show_switch_interfaces: '#A855F7',
  device_events:          'var(--color-secondary)',
  ap_radios:              'var(--color-secondary)',
  llm_response:           'rgba(99,102,241,0.8)',
};

// ─── Animated "Thinking" dots ─────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', px: 0.5, py: 0.25 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width:  8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.5)',
            animation: 'chatPulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes chatPulse': {
              '0%, 80%, 100%': { opacity: 0.25, transform: 'scale(0.85)' },
              '40%':           { opacity: 1,    transform: 'scale(1)'    },
            },
          }}
        />
      ))}
    </Box>
  );
}

// ─── Compact data table (scrollable) ─────────────────────────────────────────

// Safe cell rendering: handles null/undefined, objects/arrays, and long strings.
// Returns { display, full, truncated } so caller can decide on tooltip wrapping.
function formatCellValue(value) {
  if (value === null || value === undefined || value === '') {
    return { display: '—', full: '', truncated: false };
  }
  if (typeof value === 'object') {
    const full = JSON.stringify(value);
    if (full.length > 40) {
      return { display: full.slice(0, 40) + '…', full, truncated: true };
    }
    return { display: full, full, truncated: false };
  }
  const str = String(value);
  if (str.length > 50) {
    return { display: str.slice(0, 50) + '…', full: str, truncated: true };
  }
  return { display: str, full: str, truncated: false };
}

const DEFAULT_ROW_LIMIT = 8;

function DataTable({ data }) {
  const [showAll, setShowAll] = useState(false);
  const [popout, setPopout] = useState(false);

  // Accept an array of objects or a plain object
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return null;

  const keys = Object.keys(rows[0] || {});
  if (!keys.length) return null;

  const hasMore = rows.length > DEFAULT_ROW_LIMIT;
  const visibleRows = showAll || !hasMore ? rows : rows.slice(0, DEFAULT_ROW_LIMIT);

  return (
    <Box sx={{ mt: 1, width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: 320,
          borderRadius: 1,
          border: `1px solid ${BORDER_CLR}`,
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            '& .MuiTableCell-root': {
              px: 1,
              py: 0.5,
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {keys.map((k) => (
                <TableCell
                  key={k}
                  sx={{
                    color:         'text.secondary',
                    fontSize:      '0.7rem !important',
                    fontWeight:    600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    borderBottom:  `1px solid ${BORDER_CLR}`,
                    bgcolor:       PAPER_BG,
                  }}
                >
                  {k}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, ri) => (
              <TableRow key={ri}>
                {keys.map((k) => {
                  const { display, full, truncated } = formatCellValue(row ? row[k] : null);
                  const cell = (
                    <TableCell
                      key={k}
                      sx={{
                        color:     'text.primary',
                        border:    'none',
                        maxWidth:  260,
                        overflow:  'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {display}
                    </TableCell>
                  );
                  if (truncated && full) {
                    return (
                      <Tooltip key={k} title={full} placement="top" arrow>
                        {cell}
                      </Tooltip>
                    );
                  }
                  return cell;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
        {hasMore && (
          <Box
            component="button"
            type="button"
            onClick={() => setShowAll((v) => !v)}
            sx={{
              flex: 1,
              py: 0.4,
              border: `1px solid ${BORDER_CLR}`,
              borderRadius: 1,
              bgcolor: 'transparent',
              color: 'text.secondary',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'text.primary' },
            }}
          >
            {showAll
              ? `Show less (${DEFAULT_ROW_LIMIT} of ${rows.length})`
              : `+${rows.length - DEFAULT_ROW_LIMIT} more`}
          </Box>
        )}
        <Box
          component="button"
          type="button"
          onClick={() => setPopout(true)}
          sx={{
            flex: hasMore ? '0 0 auto' : 1,
            px: 1.2,
            py: 0.4,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            border: `1px solid var(--color-primary)`,
            borderRadius: 1,
            bgcolor: 'rgba(255,102,0,0.08)',
            color: 'var(--color-primary)',
            fontSize: '0.7rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(255,102,0,0.18)' },
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 13 }} />
          Pop out
        </Box>
      </Box>

      <Dialog
        open={popout}
        onClose={() => setPopout(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '85vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {rows.length} {rows.length === 1 ? 'item' : 'items'}
          </Typography>
          <IconButton size="small" onClick={() => setPopout(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { px: 1.5, py: 0.75, fontSize: '0.8rem', whiteSpace: 'nowrap' } }}>
              <TableHead>
                <TableRow>
                  {keys.map((k) => (
                    <TableCell key={k} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, bgcolor: PAPER_BG }}>
                      {k}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, ri) => (
                  <TableRow key={ri} hover>
                    {keys.map((k) => {
                      const { display, full, truncated } = formatCellValue(row ? row[k] : null);
                      const cell = (
                        <TableCell key={k} sx={{ color: 'text.primary', maxWidth: 480, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {display}
                        </TableCell>
                      );
                      return truncated && full
                        ? <Tooltip key={k} title={full} placement="top" arrow>{cell}</Tooltip>
                        : cell;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isUser      = msg.role === 'user';
  const isSystem    = msg.role === 'system';
  const isAssistant = msg.role === 'assistant';

  if (isSystem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', fontStyle: 'italic' }}
        >
          {msg.content}
        </Typography>
      </Box>
    );
  }

  const intentColor = msg.intent ? (INTENT_COLORS[msg.intent] || 'var(--text-muted)') : null;

  return (
    <Box
      sx={{
        display:        'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems:     'flex-start',
        gap:            0.75,
        mb:             1,
      }}
    >
      {/* Assistant avatar */}
      {isAssistant && (
        <Box
          sx={{
            width:        28,
            height:       28,
            borderRadius: '50%',
            bgcolor:      'rgba(255,102,0,0.15)',
            border:       `1px solid rgba(255,102,0,0.3)`,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            flexShrink:   0,
            mt:           0.25,
          }}
        >
          <RouterIcon sx={{ fontSize: 16, color: ORANGE }} />
        </Box>
      )}

      {/* Bubble */}
      <Box sx={{ maxWidth: '78%' }}>
        {/* Intent badge + LLM source tag */}
        {isAssistant && (msg.intent || msg.via === 'ollama') && (
          <Box sx={{ mb: 0.4, display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {msg.intent && msg.intent !== 'llm_response' && (
              <Chip
                label={msg.intent.replace(/_/g, ' ')}
                size="small"
                sx={{
                  height: 18, fontSize: '0.6rem', fontWeight: 600,
                  bgcolor: intentColor, color: '#fff', borderRadius: 1,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
            {(msg.via === 'ollama' || msg.via === 'claude' || msg.via === 'gemini') && (
              <Chip
                label={
                  msg.via === 'gemini'
                    ? `✦ ${msg.model ?? 'Gemini'}`
                    : msg.via === 'claude'
                    ? `✦ ${msg.model ? msg.model.replace('claude-', '').replace(/-\d{8}$/, '') : 'Claude'}`
                    : msg.model ? `🧠 ${msg.model.split(':')[0]}` : '🧠 Ollama'
                }
                size="small"
                sx={{
                  height: 18, fontSize: '0.6rem', fontWeight: 600,
                  bgcolor:
                    msg.via === 'gemini' ? 'rgba(66,133,244,0.15)'
                    : msg.via === 'claude' ? 'rgba(255,102,0,0.15)'
                    : 'rgba(99,102,241,0.2)',
                  color:
                    msg.via === 'gemini' ? '#4285F4'
                    : msg.via === 'claude' ? 'var(--color-primary)'
                    : '#818CF8',
                  border: `1px solid ${
                    msg.via === 'gemini' ? 'rgba(66,133,244,0.3)'
                    : msg.via === 'claude' ? 'rgba(255,102,0,0.3)'
                    : 'rgba(99,102,241,0.3)'
                  }`,
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
          </Box>
        )}

        <Box
          sx={{
            px:           1.5,
            py:           1,
            borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
            bgcolor:      isUser ? ORANGE : PAPER_BG,
            border:       isUser ? 'none' : `1px solid ${BORDER_CLR}`,
            color:        isUser ? '#fff' : 'text.primary',
            wordBreak:    'break-word',
            fontSize:     '0.85rem',
            lineHeight:   1.5,
            // Markdown element styles
            '& p':        { m: 0, mb: 0.75, '&:last-child': { mb: 0 } },
            '& ul, & ol': { mt: 0.25, mb: 0.75, pl: 2.5 },
            '& li':       { mb: 0.25 },
            '& strong':   { fontWeight: 700 },
            '& em':       { fontStyle: 'italic' },
            '& code':     {
              fontFamily: 'monospace',
              fontSize:   '0.8rem',
              bgcolor:    isUser ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.07)',
              px:         0.5,
              py:         0.1,
              borderRadius: 0.5,
            },
            '& pre': {
              bgcolor:     isUser ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.35)',
              p:           1,
              borderRadius: 1,
              overflowX:   'auto',
              fontSize:    '0.78rem',
              fontFamily:  'monospace',
              '& code':    { bgcolor: 'transparent', p: 0 },
            },
            '& table': {
              borderCollapse: 'collapse',
              width:          '100%',
              fontSize:       '0.78rem',
              mt:             0.5,
              mb:             0.75,
            },
            '& th, & td': {
              border:  `1px solid ${BORDER_CLR}`,
              px:      0.75,
              py:      0.4,
              textAlign: 'left',
            },
            '& th': { fontWeight: 700, bgcolor: 'rgba(255,255,255,0.05)' },
            '& hr': { border: 'none', borderTop: `1px solid ${BORDER_CLR}`, my: 1 },
            '& h1, & h2, & h3': { mt: 0.5, mb: 0.5, fontWeight: 700 },
            '& a': { color: 'inherit', textDecoration: 'underline' },
            '& blockquote': {
              borderLeft: `3px solid ${BORDER_CLR}`,
              pl: 1,
              ml: 0,
              opacity: 0.8,
            },
          }}
        >
          {isUser ? (
            msg.content
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          )}
        </Box>

        {/* Structured data table (assistant only) */}
        {isAssistant && msg.data && (
          <DataTable data={msg.data} />
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color:     'text.disabled',
            fontSize:  '0.65rem',
            display:   'block',
            mt:        0.25,
            textAlign: isUser ? 'right' : 'left',
            px:        0.5,
          }}
        >
          {formatTime(msg.ts)}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function ChatDrawer({ pageContext = '' }) {
  // collapsed | half | full
  const [drawerState,   setDrawerState]   = useState('collapsed');
  const [messages,      setMessages]      = useState([]);
  const [inputValue,    setInputValue]    = useState('');
  const [isLoading,     setIsLoading]     = useState(false);
  const [unreadReply,   setUnreadReply]   = useState(0);
  const [llmStatus,     setLlmStatus]     = useState({ available: false, model: null, model_ready: false });
  const [lastIntent,    setLastIntent]    = useState(null);
  // Pending destructive action: { text, confirmed } — shows confirm/cancel before executing
  const [pendingAction, setPendingAction] = useState(null);
  // Pending destructive MCP tool call proposed by the backend (Gemini picked a
  // destructive MCP tool). Shape: { token, tool, params, summary }. When set,
  // a confirm/cancel card is rendered below the messages.
  const [pendingMcpAction, setPendingMcpAction] = useState(null);

  // ── Floating-card panel size/mode (persisted in localStorage) ────────────
  // panelMode: 'floating' (bottom-right card) | 'fullscreen' (full right drawer)
  const [panelMode,   setPanelMode]   = useState('floating');
  const [panelWidthPx,  setPanelWidthPx]  = useState(FLOAT_DEFAULT_W);
  const [panelHeightPx, setPanelHeightPx] = useState(FLOAT_DEFAULT_H);

  // Load persisted size/mode once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIZE_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.mode === 'floating' || saved.mode === 'fullscreen') {
        setPanelMode(saved.mode);
      }
      if (typeof saved.width === 'number') {
        setPanelWidthPx(Math.max(FLOAT_MIN_W, Math.min(FLOAT_MAX_W, saved.width)));
      }
      if (typeof saved.height === 'number') {
        setPanelHeightPx(Math.max(FLOAT_MIN_H, Math.min(FLOAT_MAX_H, saved.height)));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify({
        mode:   panelMode,
        width:  panelWidthPx,
        height: panelHeightPx,
      }));
    } catch { /* ignore */ }
  }, [panelMode, panelWidthPx, panelHeightPx]);

  // Resize handler — drags top-left corner, grows up/left
  const startResize = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = panelWidthPx;
    const startH = panelHeightPx;

    const onMove = (ev) => {
      // Dragging left/up increases size (handle is top-left)
      const dx = startX - ev.clientX;
      const dy = startY - ev.clientY;
      const nextW = Math.max(FLOAT_MIN_W, Math.min(FLOAT_MAX_W, startW + dx));
      const nextH = Math.max(FLOAT_MIN_H, Math.min(FLOAT_MAX_H, startH + dy));
      setPanelWidthPx(nextW);
      setPanelHeightPx(nextH);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [panelWidthPx, panelHeightPx]);

  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const sendControllerRef = useRef(null);

  // ── Fetch LLM status on mount ────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const checkLLM = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/llm-status`, {
          signal: controller.signal,
        });
        if (res.ok) setLlmStatus(await res.json());
      } catch (err) {
        if (err.name === 'AbortError') return;
        /* Ollama not up yet */
      }
    };
    checkLLM();
    const interval = setInterval(checkLLM, 30_000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  // ── Abort pending send on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => sendControllerRef.current?.abort();
  }, []);

  // ── Width calculation (right-side panel) ────────────────────────────────

  const isCollapsed  = drawerState === 'collapsed';
  const isFullscreenMode = panelMode === 'fullscreen';
  // Kept for legacy expand icon state — now tracks fullscreen mode toggle
  const isFull = isFullscreenMode;

  // ── Scroll to bottom on new messages ────────────────────────────────────

  useLayoutEffect(() => {
    if (!isCollapsed) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard shortcut: Ctrl+/ ────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setDrawerState((prev) => (prev === 'collapsed' ? 'half' : 'collapsed'));
        // Clear unread badge when opening
        setUnreadReply(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Focus input when opening ─────────────────────────────────────────────

  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isCollapsed]);

  // ── Send message ─────────────────────────────────────────────────────────

  // Simple client-side destructive keyword check (mirrors backend intent patterns)
  const DESTRUCTIVE_PATTERNS = [
    /\bbounce\b/i, /\breboot\b/i, /\brestart\b/i, /\breset\b/i,
    /\bdisconnect\b.*\bclient\b/i, /\bkick\b.*\bclient\b/i,
    /\bpoe\b.*\bbounce\b/i, /\bbounce\b.*\bport\b/i,
  ];

  const sendMessage = useCallback(async (overrideText) => {
    // IconButton passes a click event as the first arg; only real strings override input.
    const raw = typeof overrideText === 'string' ? overrideText : inputValue;
    const text = raw.trim();
    if (!text || isLoading) return;

    // If not already confirmed and text matches a destructive pattern, gate it
    if (typeof overrideText !== 'string' && DESTRUCTIVE_PATTERNS.some((p) => p.test(text))) {
      setInputValue('');
      setPendingAction(text);
      // Show the user's message in the chat immediately
      const userMsg = { id: generateId(), role: 'user', content: text, ts: Date.now() };
      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      return;
    }

    const userMsg = {
      id:      generateId(),
      role:    'user',
      content: text,
      ts:      Date.now(),
    };

    setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
    setInputValue('');
    setIsLoading(true);
    // Keep focus on input so user can type next message immediately
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      // Abort any previous in-flight send request
      sendControllerRef.current?.abort();
      const controller = new AbortController();
      sendControllerRef.current = controller;

      const sessionId = localStorage.getItem(SESSION_KEY);
      const headers   = { 'Content-Type': 'application/json' };
      if (sessionId) headers['X-Session-ID'] = sessionId;

      // Build history from current messages for LLM context
      const history = messages.slice(-10).map((m) => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await fetch(`${API_BASE}/chat/message`, {
        method:  'POST',
        headers,
        body:    JSON.stringify({ message: text, context: pageContext, history }),
        signal:  controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      const assistantMsg = {
        id:          generateId(),
        role:        'assistant',
        content:     json.reply ?? '(no reply)',
        intent:      json.intent,
        via:         json.via ?? 'regex',
        model:       json.model ?? null,
        data:        json.data ?? null,
        destructive: json.destructive ?? false,
        ts:          Date.now(),
      };

      if (json.intent) setLastIntent(json.intent);
      setMessages((prev) => [...prev, assistantMsg].slice(-MAX_MESSAGES));

      // Backend wants explicit confirmation before running a destructive MCP tool.
      // Stash the pending-action payload; the confirm card below renders from it.
      if (json.intent === 'confirm_mcp_action' && json.pending_action?.token) {
        setPendingMcpAction({
          token:   json.pending_action.token,
          tool:    json.pending_action.tool,
          params:  json.pending_action.params || {},
          summary: json.pending_action.summary || json.reply || '',
        });
      }

      // Badge if drawer is collapsed
      if (isCollapsed) {
        setUnreadReply((c) => c + 1);
        toast(assistantMsg.content.slice(0, 80) + (assistantMsg.content.length > 80 ? '…' : ''), {
          icon: '🤖',
          duration: 4000,
          style: { maxWidth: 320, fontSize: '0.8rem' },
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const errMsg = {
        id:      generateId(),
        role:    'system',
        content: `Error: ${err.message}`,
        ts:      Date.now(),
      };
      setMessages((prev) => [...prev, errMsg].slice(-MAX_MESSAGES));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [inputValue, isLoading, isCollapsed, pageContext, messages]);

  // ── Enter key handling ───────────────────────────────────────────────────

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Tab strip click ──────────────────────────────────────────────────────

  const handleTabClick = () => {
    if (isCollapsed) {
      setDrawerState('half');
      setUnreadReply(0);
    } else {
      setDrawerState('collapsed');
    }
  };

  // ── Cycle height buttons ─────────────────────────────────────────────────

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    setPanelMode((prev) => (prev === 'fullscreen' ? 'floating' : 'fullscreen'));
    // Ensure drawer is open in a visible state
    setDrawerState((prev) => (prev === 'collapsed' ? 'half' : prev));
  };

  const collapseDrawer = (e) => {
    e.stopPropagation();
    setDrawerState('collapsed');
  };

  // ── Clear chat ───────────────────────────────────────────────────────────

  const clearChat = (e) => {
    e.stopPropagation();
    setMessages([]);
  };

  // ── Chip click: send directly ────────────────────────────────────────────

  const handleChipClick = (label) => {
    setInputValue(label);
    inputRef.current?.focus();
  };

  // ── Destructive action: confirm / cancel ─────────────────────────────────

  const confirmDestructive = () => {
    const text = pendingAction;
    setPendingAction(null);
    sendMessage(text);
  };

  const cancelDestructive = () => {
    setPendingAction(null);
    const cancelMsg = {
      id:      generateId(),
      role:    'system',
      content: 'Action cancelled.',
      ts:      Date.now(),
    };
    setMessages((prev) => [...prev, cancelMsg].slice(-MAX_MESSAGES));
  };

  // ── MCP destructive action: confirm / cancel ────────────────────────────
  // Triggered when the backend returned intent="confirm_mcp_action". Confirming
  // POSTs the token back to /api/chat/mcp-confirm; the server holds the real
  // tool+params so the client can't tamper with what actually runs.
  const confirmMcpAction = useCallback(async () => {
    const action = pendingMcpAction;
    if (!action || isLoading) return;
    setPendingMcpAction(null);
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      const headers   = { 'Content-Type': 'application/json' };
      if (sessionId) headers['X-Session-ID'] = sessionId;

      const res = await fetch(`${API_BASE}/chat/mcp-confirm`, {
        method:  'POST',
        headers,
        body:    JSON.stringify({ token: action.token }),
      });
      const json = await res.json().catch(() => ({}));

      const assistantMsg = {
        id:          generateId(),
        role:        'assistant',
        content:     json.reply ?? (res.ok ? 'Done.' : `Error: HTTP ${res.status}`),
        intent:      json.intent ?? 'mcp_tool_result',
        via:         'gemini+mcp',
        data:        json.data ?? null,
        destructive: true,
        ts:          Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg].slice(-MAX_MESSAGES));
    } catch (err) {
      const errMsg = {
        id:      generateId(),
        role:    'system',
        content: `Error confirming action: ${err.message}`,
        ts:      Date.now(),
      };
      setMessages((prev) => [...prev, errMsg].slice(-MAX_MESSAGES));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [pendingMcpAction, isLoading]);

  const cancelMcpAction = () => {
    setPendingMcpAction(null);
    const cancelMsg = {
      id:      generateId(),
      role:    'system',
      content: 'Cancelled.',
      ts:      Date.now(),
    };
    setMessages((prev) => [...prev, cancelMsg].slice(-MAX_MESSAGES));
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating toggle button (visible when collapsed) ─────────────── */}
      {isCollapsed && (
        <Box
          component="button"
          type="button"
          onClick={() => { setDrawerState('half'); setUnreadReply(0); }}
          aria-label={`Open network assistant${unreadReply > 0 ? `, ${unreadReply} unread` : ''}`}
          sx={{
            position:  'fixed',
            bottom:    24,
            right:     24,
            zIndex:    1400,
            width:     56,
            height:    56,
            borderRadius: '50%',
            border:    'none',
            background: `linear-gradient(135deg, ${ORANGE} 0%, var(--color-primary-light) 100%)`,
            boxShadow: '0 4px 20px rgba(255,102,0,0.55), 0 0 0 0 rgba(255,102,0,0.4)',
            display:   'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor:    'pointer',
            animation: 'chat-fab-pulse 2.5s ease-in-out infinite',
            '@keyframes chat-fab-pulse': {
              '0%, 100%': { boxShadow: '0 4px 20px rgba(255,102,0,0.55), 0 0 0 0 rgba(255,102,0,0.4)' },
              '50%':      { boxShadow: '0 4px 28px rgba(255,102,0,0.7), 0 0 0 10px rgba(255,102,0,0)' },
            },
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'scale(1.08)' },
          }}
        >
          <RouterIcon sx={{ color: '#fff', fontSize: 26 }} />
          {unreadReply > 0 && (
            <Box sx={{
              position: 'absolute', top: -3, right: -3,
              width: 20, height: 20, borderRadius: '50%',
              bgcolor: 'var(--color-error)', border: '2px solid var(--bg-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {unreadReply > 9 ? '9+' : unreadReply}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ── Chat panel (floating card OR fullscreen right drawer) ─────────── */}
      <Box
        component="aside"
        role="complementary"
        aria-label="Network assistant chat"
        sx={isFullscreenMode ? {
          // Fullscreen right-edge drawer (legacy behavior)
          position:      'fixed',
          right:         0,
          top:           TOPBAR_HEIGHT,
          bottom:        0,
          width:         { xs: '100vw', sm: PANEL_WIDTH_WIDE },
          zIndex:        1300,
          display:       isCollapsed ? 'none' : 'flex',
          flexDirection: 'column',
          bgcolor:       SURFACE_BG,
          borderLeft:    `2px solid ${ORANGE}`,
          boxShadow:     '-8px 0 40px rgba(0,0,0,0.6)',
          overflow:      'hidden',
          pointerEvents: isCollapsed ? 'none' : 'auto',
          visibility:    isCollapsed ? 'hidden' : 'visible',
        } : {
          // Floating bottom-right card
          position:      'fixed',
          right:         `${FLOAT_MARGIN}px`,
          bottom:        `${FLOAT_MARGIN}px`,
          width:         `${panelWidthPx}px`,
          height:        `${panelHeightPx}px`,
          maxWidth:      `calc(100vw - ${FLOAT_MARGIN * 2}px)`,
          maxHeight:     `calc(100vh - ${FLOAT_MARGIN * 2}px)`,
          zIndex:        1300,
          display:       isCollapsed ? 'none' : 'flex',
          flexDirection: 'column',
          bgcolor:       SURFACE_BG,
          border:        `1px solid ${BORDER_CLR}`,
          borderRadius:  3,
          boxShadow:     '0 16px 48px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.4)',
          overflow:      'hidden',
          pointerEvents: isCollapsed ? 'none' : 'auto',
          visibility:    isCollapsed ? 'hidden' : 'visible',
        }}
      >
        {/* Resize handle (floating mode only) — top-left corner */}
        {!isFullscreenMode && !isCollapsed && (
          <Box
            onMouseDown={startResize}
            role="separator"
            aria-label="Resize chat panel"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 16,
              height: 16,
              cursor: 'nwse-resize',
              zIndex: 10,
              // Visual corner hint
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 4,
                left: 4,
                width: 8,
                height: 8,
                borderTop: `2px solid ${ORANGE}`,
                borderLeft: `2px solid ${ORANGE}`,
                borderTopLeftRadius: 2,
                opacity: 0.7,
              },
              '&:hover::before': { opacity: 1 },
            }}
          />
        )}
      {/* ── Panel header ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: 52, minHeight: 52, display: 'flex', alignItems: 'center',
          px: 2, gap: 1.5, flexShrink: 0, userSelect: 'none',
          background: 'linear-gradient(90deg, rgba(255,102,0,0.12) 0%, rgba(13,17,23,0.98) 60%)',
          borderBottom: `1px solid ${BORDER_CLR}`,
        }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: '8px',
          bgcolor: 'rgba(255,102,0,0.15)',
          border: '1.5px solid rgba(255,102,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <RouterIcon sx={{ color: ORANGE, fontSize: 17 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              Network Assistant
            </Typography>
            {llmStatus.available && (
              <Chip
                label={llmStatus.model_ready ? (
                  llmStatus.via === 'gemini' ? 'Gemini'
                  : llmStatus.via === 'claude' ? 'Claude'
                  : llmStatus.via === 'ollama' ? `Ollama`
                  : 'AI'
                ) : 'Loading…'}
                size="small"
                sx={{
                  height: 15, fontSize: '0.6rem', fontWeight: 700,
                  bgcolor: llmStatus.model_ready ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  color:   llmStatus.model_ready ? 'var(--color-success)' : 'var(--color-warning)',
                  border:  `1px solid ${llmStatus.model_ready ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  borderRadius: '4px', '& .MuiChip-label': { px: 0.6 },
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.65rem' }}>
            {(() => {
              // Show actual LLM used in last assistant message, fall back to status
              const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.via && m.via !== 'regex');
              const via   = lastAssistant?.via   ?? llmStatus.via;
              const model = lastAssistant?.model  ?? llmStatus.model;
              if (!llmStatus.available && !lastAssistant) return 'Aruba Central API';
              if (via === 'gemini') return `Gemini · ${model ?? ''}`;
              if (via === 'claude') return `Claude · ${model?.replace('claude-', '').replace(/-\d{8}$/, '') ?? ''}`;
              if (via === 'ollama') return `Ollama · ${model?.split(':')[0] ?? model ?? ''}`;
              return 'Aruba Central API';
            })()}
          </Typography>
        </Box>

        {messages.length > 0 && (
          <Tooltip title="Clear chat" placement="left">
            <IconButton size="small" onClick={clearChat} sx={{ color: 'text.secondary', p: 0.5 }}>
              <DeleteOutlineIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={isFull ? 'Shrink' : 'Expand'} placement="left">
          <IconButton size="small" onClick={toggleFullScreen} sx={{ color: 'text.secondary', p: 0.5 }}>
            {isFull ? <CloseFullscreenIcon sx={{ fontSize: 15 }} /> : <OpenInFullIcon sx={{ fontSize: 15 }} />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Close (Ctrl+/)" placement="left">
          <IconButton size="small" onClick={collapseDrawer} sx={{ color: 'text.secondary', p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Messages area ──────────────────────────────────────────────────── */}
      {!isCollapsed && (
        <Box
          sx={{
            flex:       1,
            overflowY:  'auto',
            px:         2,
            py:         1.5,
            display:    'flex',
            flexDirection: 'column',
            // Keep messages anchored to bottom
            justifyContent: messages.length === 0 ? 'center' : 'flex-start',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': {
              background:   'rgba(255,255,255,0.15)',
              borderRadius: 2,
            },
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
              <RouterIcon sx={{ fontSize: 40, mb: 1, color: 'rgba(255,102,0,0.3)' }} />
              <Typography variant="body2">
                Ask me anything about your Aruba network.
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                Device status, clients, alerts, configuration tips...
              </Typography>
            </Box>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Destructive action confirmation */}
          {pendingAction && !isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1, px: 0.5 }}>
              <Box
                sx={{
                  px: 1.5, py: 1,
                  borderRadius: '4px 16px 16px 16px',
                  bgcolor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  fontSize: '0.83rem',
                  color: 'text.primary',
                }}
              >
                ⚠️ This action may affect network connectivity. Are you sure you want to proceed?
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  component="button"
                  onClick={confirmDestructive}
                  sx={{
                    flex: 1, py: 0.5, borderRadius: 1, border: 'none', cursor: 'pointer',
                    bgcolor: 'var(--color-error)', color: '#fff',
                    fontSize: '0.78rem', fontWeight: 600,
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  Yes, proceed
                </Box>
                <Box
                  component="button"
                  onClick={cancelDestructive}
                  sx={{
                    flex: 1, py: 0.5, borderRadius: 1,
                    border: `1px solid ${BORDER_CLR}`, cursor: 'pointer',
                    bgcolor: 'transparent', color: 'text.secondary',
                    fontSize: '0.78rem', fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Cancel
                </Box>
              </Box>
            </Box>
          )}

          {/* MCP destructive tool confirmation (issued by backend) */}
          {pendingMcpAction && !isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1, px: 0.5 }}>
              <Box
                sx={{
                  px: 1.5, py: 1,
                  borderRadius: '4px 16px 16px 16px',
                  bgcolor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  fontSize: '0.83rem',
                  color: 'text.primary',
                }}
              >
                <Box sx={{ fontWeight: 700, mb: 0.5, color: 'var(--color-error)' }}>
                  ⚠️ Confirm destructive action
                </Box>
                <Box sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  {pendingMcpAction.summary}
                </Box>
                <Box sx={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                  bgcolor: 'rgba(0,0,0,0.25)',
                  px: 0.75, py: 0.5, borderRadius: 0.5,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>
                  {pendingMcpAction.tool}
                  {Object.keys(pendingMcpAction.params).length > 0 &&
                    ` ${JSON.stringify(pendingMcpAction.params)}`}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  component="button"
                  onClick={confirmMcpAction}
                  sx={{
                    flex: 1, py: 0.5, borderRadius: 1, border: 'none', cursor: 'pointer',
                    bgcolor: 'var(--color-error)', color: '#fff',
                    fontSize: '0.78rem', fontWeight: 600,
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  Confirm
                </Box>
                <Box
                  component="button"
                  onClick={cancelMcpAction}
                  sx={{
                    flex: 1, py: 0.5, borderRadius: 1,
                    border: `1px solid ${BORDER_CLR}`, cursor: 'pointer',
                    bgcolor: 'transparent', color: 'text.secondary',
                    fontSize: '0.78rem', fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Cancel
                </Box>
              </Box>
            </Box>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1 }}>
              <Box
                sx={{
                  width:        28,
                  height:       28,
                  borderRadius: '50%',
                  bgcolor:      'rgba(255,102,0,0.15)',
                  border:       `1px solid rgba(255,102,0,0.3)`,
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  flexShrink:   0,
                  mt:           0.25,
                }}
              >
                <RouterIcon sx={{ fontSize: 16, color: ORANGE }} />
              </Box>
              <Box
                sx={{
                  px:           1.5,
                  py:           1,
                  borderRadius: '4px 16px 16px 16px',
                  bgcolor:      PAPER_BG,
                  border:       `1px solid ${BORDER_CLR}`,
                }}
              >
                <ThinkingDots />
              </Box>
            </Box>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* ── Input area (hidden when collapsed) ─────────────────────────── */}
      {!isCollapsed && (
        <Box
          sx={{
            display:     'flex',
            flexDirection: 'column',
            gap:         0.75,
            px:          2,
            pt:          0.75,
            pb:          1,
            borderTop:   `1px solid ${BORDER_CLR}`,
            flexShrink:  0,
            bgcolor:     SURFACE_BG,
          }}
        >
          {/* Suggestion / follow-up chips — only show when input is empty */}
          {!inputValue && (
            <Box
              sx={{
                display:    'flex',
                flexWrap:   'wrap',
                gap:        0.5,
                pb:         0.25,
              }}
            >
              {(lastIntent && FOLLOWUP_CHIPS[lastIntent]
                ? FOLLOWUP_CHIPS[lastIntent]
                : SUGGESTION_CHIPS
              ).map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  onClick={() => handleChipClick(label)}
                  sx={{
                    height:     22,
                    fontSize:   '0.7rem',
                    cursor:     'pointer',
                    bgcolor:    'rgba(255,102,0,0.10)',
                    color:      'rgba(255,255,255,0.75)',
                    border:     `1px solid rgba(255,102,0,0.25)`,
                    '& .MuiChip-label': { px: 1 },
                    '&:hover': {
                      bgcolor: 'rgba(255,102,0,0.22)',
                      color:   '#fff',
                    },
                    transition: 'background-color 0.15s',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Input row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <TextField
              inputRef={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your network... (Enter to send, Shift+Enter for newline)"
              aria-label="Chat message"
              multiline
              maxRows={3}
              fullWidth
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize:    '0.85rem',
                  bgcolor:     PAPER_BG,
                  borderRadius: 2,
                  '& fieldset': { borderColor: BORDER_CLR },
                  '&:hover fieldset': { borderColor: 'rgba(255,102,0,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: ORANGE },
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
              }}
            />
            <Tooltip title="Send (Enter)">
              <span>
                <IconButton
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  sx={{
                    bgcolor:   inputValue.trim() && !isLoading ? ORANGE : 'var(--border-default)',
                    color:     '#fff',
                    width:     36,
                    height:    36,
                    flexShrink: 0,
                    '&:hover': {
                      bgcolor: inputValue.trim() && !isLoading
                        ? 'var(--color-primary-hover)'
                        : 'rgba(255,255,255,0.10)',
                    },
                    '&.Mui-disabled': {
                      color:  'rgba(255,255,255,0.3)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                    transition: 'background-color 0.15s',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  ) : (
                    <SendIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}
      </Box>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default ChatDrawer;
