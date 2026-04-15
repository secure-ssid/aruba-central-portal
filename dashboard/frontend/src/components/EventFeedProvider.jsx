import React, { createContext, useContext } from 'react';

const EventFeedContext = createContext({ events: [] });

export function useEventFeed() {
  return useContext(EventFeedContext);
}

export default function EventFeedProvider({ children }) {
  return (
    <EventFeedContext.Provider value={{ events: [] }}>
      {children}
    </EventFeedContext.Provider>
  );
}
