import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/models';
import type { TokenPair } from '../../types/api';

// ─── State Shape ────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Persist helpers ────────────────────────────────────────
const loadFromStorage = (): Partial<AuthState> => {
  try {
    const accessToken = localStorage.getItem('rms_access_token');
    const refreshToken = localStorage.getItem('rms_refresh_token');
    const userStr = localStorage.getItem('rms_user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken && !!user,
    };
  } catch {
    return {};
  }
};

const saveToStorage = (state: AuthState): void => {
  if (state.accessToken) {
    localStorage.setItem('rms_access_token', state.accessToken);
  }
  if (state.refreshToken) {
    localStorage.setItem('rms_refresh_token', state.refreshToken);
  }
  if (state.user) {
    localStorage.setItem('rms_user', JSON.stringify(state.user));
  }
};

const clearStorage = (): void => {
  localStorage.removeItem('rms_access_token');
  localStorage.removeItem('rms_refresh_token');
  localStorage.removeItem('rms_user');
};

// ─── Initial State ──────────────────────────────────────────
const persisted = loadFromStorage();

const initialState: AuthState = {
  user: persisted.user ?? null,
  accessToken: persisted.accessToken ?? null,
  refreshToken: persisted.refreshToken ?? null,
  isAuthenticated: persisted.isAuthenticated ?? false,
  isLoading: false,
};

// ─── Slice ──────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after successful login or register.
     * Saves user + tokens to state and localStorage.
     */
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; tokens: TokenPair }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      saveToStorage(state);
    },

    /**
     * Update tokens after a refresh.
     */
    tokenRefreshed: (state, action: PayloadAction<TokenPair>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveToStorage(state);
    },

    /**
     * Update user profile data.
     */
    userUpdated: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveToStorage(state);
    },

    /**
     * Set loading state during auth operations.
     */
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Clear all auth state and localStorage.
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      clearStorage();
    },
  },
});

export const {
  loginSuccess,
  tokenRefreshed,
  userUpdated,
  setAuthLoading,
  logout,
} = authSlice.actions;

// ─── Selectors ──────────────────────────────────────────────
import type { RootState } from '../index';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;
