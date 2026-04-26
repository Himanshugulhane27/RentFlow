import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ─── State Shape ────────────────────────────────────────────
type Theme = 'light' | 'dark' | 'system';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: Theme;
  isDarkMode: boolean;
}

const getPersistedTheme = (): Theme => {
  const stored = localStorage.getItem('rms_theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  // Enforce consistent default theme (light) if not present
  localStorage.setItem('rms_theme', 'light');
  return 'light';
};

const resolveIsDark = (theme: Theme): boolean => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (isDark: boolean): void => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// ─── Initial State ──────────────────────────────────────────
const initialTheme = getPersistedTheme();
const initialIsDark = resolveIsDark(initialTheme);

// Apply theme immediately on load
applyTheme(initialIsDark);

const initialState: UiState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: initialTheme,
  isDarkMode: initialIsDark,
};

// ─── Slice ──────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle sidebar open/closed (mobile).
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    /**
     * Set sidebar open state directly.
     */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    /**
     * Toggle sidebar collapsed (desktop — icon-only mode).
     */
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    /**
     * Set theme preference.
     */
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.isDarkMode = resolveIsDark(action.payload);
      localStorage.setItem('rms_theme', action.payload);
      applyTheme(state.isDarkMode);
    },

    /**
     * Quick toggle between light and dark.
     */
    toggleDarkMode: (state) => {
      const newTheme: Theme = state.isDarkMode ? 'light' : 'dark';
      state.theme = newTheme;
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('rms_theme', newTheme);
      applyTheme(state.isDarkMode);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setTheme,
  toggleDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;
