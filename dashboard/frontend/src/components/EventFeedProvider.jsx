import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'aruba_session_id';
const MAX_EVENTS = 100;

const EventFeedContext = createContext({ events: [], connected: false });

export function useEventFeed() {
  return useContext(EventFeedContext);
}

export default function EventFeedProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);
  const retryTimerRef = useRef(null);

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

  return (
    <EventFeedContext.Provider value={{ events, connected }}>
      {children}
    </EventFeedContext.Provider>
  );
}
