import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Users, Heart } from "lucide-react";

// Convert timestamp to seconds for calculations
const timeToSeconds = (timeStr: string) => {
  const parts = timeStr.split(':').map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hours * 3600 + minutes * 60 + seconds
};

// Convert seconds to timestamp string
const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Stream duration: 2:45:12 = 9912 seconds
const STREAM_DURATION = timeToSeconds("2:45:12");

// Mock data for the charts - updated to use real timeline
const generateMockData = (points: number = 50, maxValue: number = 100) => {
  return Array.from({ length: points }, (_, i) => {
    const timeInSeconds = (i / (points - 1)) * STREAM_DURATION;
    return {
      time: Math.floor(timeInSeconds),
      timeDisplay: secondsToTime(Math.floor(timeInSeconds)),
      value: Math.floor(Math.random() * maxValue * 0.8) + maxValue * 0.1 + Math.sin(i * 0.5) * maxValue * 0.2,
    };
  });
};

// Generate composite engagement data (same as RecapChart)
const generateCompositeData = (points: number = 50) => {
  return Array.from({ length: points }, (_, i) => {
    const timeInSeconds = (i / (points - 1)) * STREAM_DURATION;
    const baseValue = 50;
    const spike1 = i >= 35 && i <= 40 ? 40 : 0; // Around 2:34:12
    const spike2 = i >= 30 && i <= 35 ? 30 : 0; // Around 2:28:45
    const spike3 = i >= 25 && i <= 30 ? 25 : 0; // Around 2:15:33
    const spike4 = i >= 20 && i <= 25 ? 20 : 0; // Around 1:58:21
    const noise = Math.random() * 20 - 10;
    
    return {
      time: Math.floor(timeInSeconds),
      timeDisplay: secondsToTime(Math.floor(timeInSeconds)),
      value: baseValue + spike1 + spike2 + spike3 + spike4 + noise,
      composite: baseValue + spike1 + spike2 + spike3 + spike4 + noise,
    };
  });
};

// Empty data for disconnected state
const generateEmptyData = (points: number = 50) => {
  return Array.from({ length: points }, (_, i) => {
    const timeInSeconds = (i / (points - 1)) * STREAM_DURATION;
    return {
      time: Math.floor(timeInSeconds),
      timeDisplay: secondsToTime(Math.floor(timeInSeconds)),
      value: 0,
      composite: 0,
    };
  });
};

const ChartCard = ({ 
  title, 
  data, 
  color, 
  icon: Icon, 
  currentValue,
  yAxisDomain,
  yAxisTicks,
  formatValue,
  compositeData
}: {
  title: string;
  data: any[];
  color: string;
  icon: any;
  currentValue: number;
  yAxisDomain: [number, number];
  yAxisTicks: number[];
  formatValue: (value: number) => string;
  compositeData: any[];
}) => (
  <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift chart-animate">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br from-${color}/20 to-${color}/10`}>
          <Icon className={`h-5 w-5 text-${color}`} />
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-2xl font-bold text-primary mt-1">{formatValue(currentValue)}</p>
        </div>
      </div>
    </div>
    
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, STREAM_DURATION]}
            type="number"
            tickFormatter={(value) => secondsToTime(value)}
            ticks={[0, STREAM_DURATION * 0.25, STREAM_DURATION * 0.5, STREAM_DURATION * 0.75, STREAM_DURATION]}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            domain={yAxisDomain}
            ticks={yAxisTicks}
            tickFormatter={formatValue}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number, name: string) => [
              formatValue(value), 
              name === 'composite' ? 'Engagement Composite' : title
            ]}
            labelFormatter={(value) => `Time: ${secondsToTime(value)}`}
          />
          {/* Engagement composite line (lighter weight) */}
          <Line 
            type="monotone" 
            dataKey="composite" 
            data={compositeData}
            stroke="hsl(var(--primary))" 
            strokeWidth={1.5}
            dot={false}
            opacity={0.8}
            strokeDasharray="3 3"
          />
          {/* Main metric line */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={`hsl(var(--${color}))`} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: `hsl(var(--${color}))` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AnalyticsCharts = ({ isConnected }: { isConnected: boolean }) => {
  // Generate composite data (same timeline as RecapChart)
  const compositeData = isConnected ? generateCompositeData(50) : generateEmptyData(50);
  
  // Generate data with appropriate scales for each metric
  const commentsData = isConnected ? generateMockData(50, 1000) : generateEmptyData();
  const subscribersData = isConnected ? generateMockData(50, 1000) : generateEmptyData();
  const viewersData = isConnected ? generateMockData(50, 200000) : generateEmptyData();

  // Scale composite data to fit each chart's Y-axis
  const scaleCompositeForChart = (maxValue: number) => {
    return compositeData.map(point => ({
      ...point,
      composite: (point.composite / 100) * maxValue * 0.8 // Scale composite (0-100) to chart range
    }));
  };

  // Format functions for different scales
  const formatNumber = (value: number) => value.toString();
  const formatViewers = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Live Analytics</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Comments"
          data={commentsData}
          color="dashboard-chart-primary"
          icon={TrendingUp}
          currentValue={isConnected ? 420 : 0}
          yAxisDomain={[0, 1000]}
          yAxisTicks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
          formatValue={formatNumber}
          compositeData={scaleCompositeForChart(1000)}
        />
        
        <ChartCard
          title="New subscribers"
          data={subscribersData}
          color="dashboard-chart-secondary"
          icon={Users}
          currentValue={isConnected ? 180 : 0}
          yAxisDomain={[0, 1000]}
          yAxisTicks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
          formatValue={formatNumber}
          compositeData={scaleCompositeForChart(1000)}
        />
        
        <ChartCard
          title="Viewers"
          data={viewersData}
          color="dashboard-chart-accent"
          icon={Heart}
          currentValue={isConnected ? 156000 : 0}
          yAxisDomain={[0, 200000]}
          yAxisTicks={[0, 50000, 100000, 150000, 200000]}
          formatValue={formatViewers}
          compositeData={scaleCompositeForChart(200000)}
        />
      </div>
    </section>
  );
};

export default AnalyticsCharts;