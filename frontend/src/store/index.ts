import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardSlice';
import { setTokenAccessor, setUnauthorizedHandler } from '../api/client';
import { logout } from './slices/authSlice';

// ─── Store Configuration ────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Token strings and user objects are serializable, no need to ignore
      },
    }),
  devTools: import.meta.env.DEV,
});

// ─── Wire up API client to read token from Redux store ──────
setTokenAccessor(() => store.getState().auth.accessToken);
setUnauthorizedHandler(() => store.dispatch(logout()));

// ─── Type Exports ───────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
