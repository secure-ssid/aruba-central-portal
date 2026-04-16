import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'aruba_session_id';
const MAX_EVENTS = 100;

const EventFeedContext = createContext({
  events: [],
  connected: false,
  alerts: null,
  alertsConnected: false,
});

export function useEventFeed() {
  return useContext(EventFeedContext);
}

/**
 * Hook that exposes SSE alert connection state.
 * Components can use this to decide whether to enable polling fallback.
 */
export function useAlertSSE() {
  const { alerts, alertsConnected } = useContext(EventFeedContext);
  return { alerts, alertsConnected };
}

export default function EventFeedProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);
  const retryTimerRef = useRef(null);

  // ── Alert SSE state ──────────────────────────────────────────────────────
  const [alerts, setAlerts] = useState(null);
  const [alertsConnected, setAlertsConnected] = useState(false);
  const alertEsRef = useRef(null);
  const alertRetryTimerRef = useRef(null);

  // ── Existing event stream ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    function connect() {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) return; // No session yet — will retry when parent re-renders after login

      const url = `/api/stream/events?session=${encodeURIComponent(sessionId)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      es.onmessage = (e) => {
        if (cancelled) return;
        try {
          const event = JSON.parse(e.data);
          setEvents((prev) => {
            const next = [event, ...prev];
            return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
          });
        } catch {
          // keepalive comment lines are not valid JSON — ignore
        }
      };

      es.onerror = () => {
        if (cancelled) return;
        setConnected(false);
        es.close();
        // Reconnect after 5s
        retryTimerRef.current = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(retryTimerRef.current);
      esRef.current?.close();
    };
  }, []);

  // ── Alert SSE stream ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    function connectAlerts() {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) return;

      const url = `/api/alerts/stream?session=${encodeURIComponent(sessionId)}`;
      const es = new EventSource(url);
      alertEsRef.current = es;

      es.onopen = () => {
        if (!cancelled) setAlertsConnected(true);
      };

      // Listen for named "alert" events
      es.addEventListener('alert', (e) => {
        if (cancelled) return;
        try {
          const data = JSON.parse(e.data);
          setAlerts(data);
        } catch {
          // Malformed data — ignore
        }
      });

      // Heartbeat events keep the connection alive — no action needed
      es.addEventListener('heartbeat', () => {
        // Connection is alive — nothing to do
      });

      es.onerror = () => {
        if (cancelled) return;
        setAlertsConnected(false);
        es.close();
        // Reconnect after 5s
        alertRetryTimerRef.current = setTimeout(connectAlerts, 5000);
      };
    }

    connectAlerts();

    return () => {
      cancelled = true;
      clearTimeout(alertRetryTimerRef.current);
      alertEsRef.current?.close();
    };
  }, []);

  return (
    <EventFeedContext.Provider value={{ events, connected, alerts, alertsConnected }}>
      {children}
    </EventFeedContext.Provider>
  );
}
