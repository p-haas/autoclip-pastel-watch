import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Users, Heart } from "lucide-react";

// Mock data for the charts
const generateMockData = (points: number = 20) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 100) + 20 + Math.sin(i * 0.5) * 30,
  }));
};

const commentsData = generateMockData();
const subscribersData = generateMockData();
const likesData = generateMockData();

const ChartCard = ({ 
  title, 
  data, 
  color, 
  icon: Icon, 
  currentValue 
}: {
  title: string;
  data: any[];
  color: string;
  icon: any;
  currentValue: number;
}) => {
  const colorClass = `dashboard-${color}`;
  
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift chart-animate">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${colorClass}/20 to-${colorClass}/10`}>
            <Icon className={`h-5 w-5 text-${colorClass}`} />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{title}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{currentValue}</p>
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
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
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
};

const AnalyticsCharts = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Live Analytics</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Comments per second"
          data={commentsData}
          color="chart-primary"
          icon={TrendingUp}
          currentValue={42}
        />
        
        <ChartCard
          title="New subscribers per minute"
          data={subscribersData}
          color="chart-secondary"
          icon={Users}
          currentValue={18}
        />
        
        <ChartCard
          title="Likes per minute"
          data={likesData}
          color="chart-accent"
          icon={Heart}
          currentValue={156}
        />
      </div>
    </section>
  );
};

export default AnalyticsCharts;