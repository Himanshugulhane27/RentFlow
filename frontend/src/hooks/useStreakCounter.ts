import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';

export function useStreakCounter(): { streakCount: number; incrementStreak: () => void } {
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('rf_streak_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const { data: trendData } = useQuery({
    queryKey: ['dashboard', 'revenue-trend'],
    queryFn: () => dashboardApi.getRevenueTrend(6),
  });

  useEffect(() => {
    // Infer a base streak from revenue trend data if not already set high enough
    if (trendData && streakCount === 0) {
      const historicalStreak = trendData.filter(d => d.revenue > 0).length;
      if (historicalStreak > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStreakCount(historicalStreak);
        localStorage.setItem('rf_streak_count', historicalStreak.toString());
      }
    }
  }, [trendData, streakCount]);

  const incrementStreak = () => {
    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    localStorage.setItem('rf_streak_count', newStreak.toString());
  };

  return { streakCount, incrementStreak };
}
