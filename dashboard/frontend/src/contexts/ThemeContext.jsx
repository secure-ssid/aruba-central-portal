import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ mode: 'dark', toggleTheme: () => {} });

const STORAGE_KEY = 'aruba-theme-mode';

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync data-theme attribute on <html> so CSS variables switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch { /* quota exceeded or private mode */ }
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
