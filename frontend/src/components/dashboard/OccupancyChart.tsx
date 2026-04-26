import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyData {
  month: string;
  occupancy: number;
}

interface OccupancyChartProps {
  data: OccupancyData[];
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-hsl(var(--text-tertiary))">
        No occupancy data available
      </div>
    );
  }

  // We have to use raw colors for Recharts if CSS vars don't resolve directly in SVG props.
  // But Recharts supports CSS variables in strokes and fills in modern browsers.
  const brandColor = 'hsl(var(--brand-500))';

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={brandColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={brandColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--surface-border))" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'hsl(var(--text-tertiary))' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'hsl(var(--text-tertiary))' }} 
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--surface-0))', 
              borderColor: 'hsl(var(--surface-border))',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--elevation-2)'
            }}
            itemStyle={{ color: 'hsl(var(--brand-600))', fontWeight: 600 }}
            labelStyle={{ color: 'hsl(var(--text-secondary))', marginBottom: 4 }}
          />
          <Area 
            type="monotone" 
            dataKey="occupancy" 
            stroke={brandColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOccupancy)" 
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
