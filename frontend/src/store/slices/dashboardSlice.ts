import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DateRange = '7d' | '30d' | '3m' | '12m' | 'all';

interface DashboardState {
  dateRange: DateRange;
}

const initialState: DashboardState = {
  dateRange: '30d',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
  },
});

export const { setDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
