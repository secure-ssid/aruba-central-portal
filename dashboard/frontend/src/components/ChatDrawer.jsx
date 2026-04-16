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
} from '@mui/material';
import SendIcon             from '@mui/icons-material/Send';
import CloseIcon            from '@mui/icons-material/Close';
import OpenInFullIcon       from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon  from '@mui/icons-material/CloseFullscreen';
import RouterIcon           from '@mui/icons-material/Router';
import KeyboardIcon         from '@mui/icons-material/Keyboard';
import DeleteOutlineIcon    from '@mui/icons-material/DeleteOutline';
import toast                from 'react-hot-toast';

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

const ORANGE      = 'var(--color-primary)';
const PAPER_BG    = 'var(--bg-paper)';
const SURFACE_BG  = 'var(--bg-surface-dark)';
const BORDER_CLR  = 'var(--border-default)';

// Quick-action suggestion chips shown when input is empty
const SUGGESTION_CHIPS = [
  'Show devices',
  'AP status',
  'Show alerts',
  'Site health',
  'Show clients',
  'Help',
];

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
  ping_test:          '#0EA5E9',
  traceroute:         '#0EA5E9',
  help:               'var(--text-muted)',
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

function DataTable({ data }) {
  // Accept an array of objects or a plain object
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return null;

  const keys = Object.keys(rows[0]);
  if (!keys.length) return null;

  return (
    <Box
      sx={{
        mt: 1,
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: 200,
        borderRadius: 1,
        border: `1px solid ${BORDER_CLR}`,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {keys.map((k) => (
              <TableCell
                key={k}
                sx={{
                  color:         'text.secondary',
                  fontSize:      '0.7rem',
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  borderBottom:  `1px solid ${BORDER_CLR}`,
                  bgcolor:       PAPER_BG,
                  py: 0.5,
                }}
              >
                {k}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={ri}>
              {keys.map((k) => (
                <TableCell
                  key={k}
                  sx={{
                    fontSize:  '0.75rem',
                    color:     'text.primary',
                    border:    'none',
                    py:        0.5,
                  }}
                >
                  {row[k] === null || row[k] === undefined
                    ? '—'
                    : String(row[k])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
            {msg.via === 'ollama' && (
              <Chip
                label={msg.model ? `🧠 ${msg.model.split(':')[0]}` : '🧠 AI'}
                size="small"
                sx={{
                  height: 18, fontSize: '0.6rem', fontWeight: 600,
                  bgcolor: 'rgba(99,102,241,0.2)', color: '#818CF8',
                  border: '1px solid rgba(99,102,241,0.3)', borderRadius: 1,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
          </Box>
        )}

        <Box
          sx={{
            px:              1.5,
            py:              1,
            borderRadius:    isUser
              ? '16px 16px 4px 16px'
              : '4px 16px 16px 16px',
            bgcolor:         isUser ? ORANGE : PAPER_BG,
            border:          isUser ? 'none' : `1px solid ${BORDER_CLR}`,
            color:           isUser ? '#fff' : 'text.primary',
            wordBreak:       'break-word',
            whiteSpace:      'pre-wrap',
            fontSize:        '0.85rem',
            lineHeight:      1.5,
          }}
        >
          {msg.content}
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
  const [drawerState, setDrawerState] = useState('collapsed');
  const [messages,    setMessages]    = useState([]);
  const [inputValue,  setInputValue]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [unreadReply, setUnreadReply] = useState(0);
  const [llmStatus,   setLlmStatus]   = useState({ available: false, model: null, model_ready: false });

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
  const isFull       = drawerState === 'full';
  // Responsive width: full viewport on xs screens, fixed width on sm+
  const panelWidth   = isCollapsed
    ? 0
    : {
        xs: '100vw',
        sm: isFull ? PANEL_WIDTH_WIDE : PANEL_WIDTH_OPEN,
      };

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

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

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
        id:      generateId(),
        role:    'assistant',
        content: json.reply ?? '(no reply)',
        intent:  json.intent,
        via:     json.via ?? 'regex',
        model:   json.model ?? null,
        data:    json.data ?? null,
        ts:      Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg].slice(-MAX_MESSAGES));

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
    setDrawerState((prev) => (prev === 'full' ? 'half' : 'full'));
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

  // ── Chip click: fill input ───────────────────────────────────────────────

  const handleChipClick = (label) => {
    setInputValue(label);
    inputRef.current?.focus();
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

      {/* ── Right-side chat panel ──────────────────────────────────────────── */}
      <Box
        component="aside"
        role="complementary"
        aria-label="Network assistant chat"
        sx={{
          position:      'fixed',
          right:         0,
          top:           TOPBAR_HEIGHT,
          bottom:        0,
          width:         panelWidth,
          zIndex:        1300,
          display:       'flex',
          flexDirection: 'column',
          bgcolor:       SURFACE_BG,
          borderLeft:    `2px solid ${ORANGE}`,
          boxShadow:     '-8px 0 40px rgba(0,0,0,0.6)',
          transition:    'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow:      'hidden',
          // Hide completely when collapsed (width=0) so it doesn't intercept clicks
          pointerEvents: isCollapsed ? 'none' : 'auto',
          visibility:    isCollapsed ? 'hidden' : 'visible',
        }}
      >
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
                label={llmStatus.model_ready ? (llmStatus.model || 'AI') : 'Loading…'}
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
            {llmStatus.available && llmStatus.model_ready ? `AI · ${llmStatus.model}` : 'Aruba Central API'}
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
          {/* Suggestion chips — only show when input is empty */}
          {!inputValue && (
            <Box
              sx={{
                display:    'flex',
                flexWrap:   'wrap',
                gap:        0.5,
                pb:         0.25,
              }}
            >
              {SUGGESTION_CHIPS.map((label) => (
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
                  onClick={sendMessage}
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
