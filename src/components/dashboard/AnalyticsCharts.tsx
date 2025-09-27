import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Users, Heart } from "lucide-react";

// Mock data for the charts - updated to fit the new scales
const generateMockData = (points: number = 20, maxValue: number = 100) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * maxValue * 0.8) + maxValue * 0.1 + Math.sin(i * 0.5) * maxValue * 0.2,
  }));
};

// Generate composite engagement data (same as RecapChart)
const generateCompositeData = (points: number = 20) => {
  return Array.from({ length: points }, (_, i) => {
    const baseValue = 50;
    const spike1 = i >= 15 && i <= 20 ? 40 : 0;
    const spike2 = i >= 35 && i <= 40 ? 60 : 0;
    const noise = Math.random() * 20 - 10;
    
    return {
      time: i,
      value: baseValue + spike1 + spike2 + noise,
      composite: baseValue + spike1 + spike2 + noise,
    };
  });
};

// Empty data for disconnected state
const generateEmptyData = (points: number = 20) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    value: 0,
    composite: 0,
  }));
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
            domain={[0, 19]}
            ticks={[0, 5, 10, 15, 19]}
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
          />
          {/* Engagement composite line (lighter weight) */}
          <Line 
            type="monotone" 
            dataKey="composite" 
            data={compositeData}
            stroke="hsl(var(--primary))" 
            strokeWidth={1}
            dot={false}
            opacity={0.6}
            strokeDasharray="2 2"
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
  // Generate composite data (same as RecapChart)
  const compositeData = isConnected ? generateCompositeData(20) : generateEmptyData(20);
  
  // Generate data with appropriate scales for each metric
  const commentsData = isConnected ? generateMockData(20, 1000) : generateEmptyData();
  const subscribersData = isConnected ? generateMockData(20, 1000) : generateEmptyData();
  const viewersData = isConnected ? generateMockData(20, 200000) : generateEmptyData();

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