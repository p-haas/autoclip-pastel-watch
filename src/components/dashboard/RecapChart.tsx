import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Activity } from "lucide-react";

// Mock data combining all metrics
const generateRecapData = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const baseValue = 50;
    const spike1 = i >= 15 && i <= 20 ? 40 : 0;
    const spike2 = i >= 35 && i <= 40 ? 60 : 0;
    const noise = Math.random() * 20 - 10;
    
    return {
      time: i,
      composite: baseValue + spike1 + spike2 + noise,
      comments: 30 + Math.sin(i * 0.3) * 15 + noise * 0.5,
      subscribers: 20 + Math.cos(i * 0.2) * 10 + noise * 0.3,
      likes: 40 + Math.sin(i * 0.4) * 20 + noise * 0.7,
    };
  });
};

// Empty data for disconnected state
const generateEmptyRecapData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    time: i,
    composite: 0,
    comments: 0,
    subscribers: 0,
    likes: 0,
  }));
};

const RecapChart = ({ isConnected }: { isConnected: boolean }) => {
  const recapData = isConnected ? generateRecapData() : generateEmptyRecapData();
  
  // Mock clip markers based on timestamps from ClipsTable
  const clipMarkers = isConnected ? [
    { time: 12, composite: 85, timestamp: "2:34:12" }, // Comments spike
    { time: 8, composite: 78, timestamp: "2:28:45" },  // Likes surge  
    { time: 6, composite: 72, timestamp: "2:15:33" },  // Subscriber peak
    { time: 4, composite: 68, timestamp: "1:58:21" }   // Comments spike
  ] : [];
  return (
    <section className="mb-8">
      <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Engagement Composite</h2>
            <p className="text-muted-foreground">Combined metrics with generated clip markers</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recapData}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(value) => `Time: ${value}s`}
              />
              
              {/* Individual metric lines */}
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="hsl(var(--dashboard-chart-primary))" 
                strokeWidth={1}
                dot={false}
                opacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="subscribers" 
                stroke="hsl(var(--dashboard-chart-secondary))" 
                strokeWidth={1}
                dot={false}
                opacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="hsl(var(--dashboard-chart-accent))" 
                strokeWidth={1}
                dot={false}
                opacity={0.6}
              />
              
              {/* Main composite line */}
              <Line 
                type="monotone" 
                dataKey="composite" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
              
              {/* Clip markers */}
              {clipMarkers.map((marker, index) => (
                <Line
                  key={`clip-${index}`}
                  type="monotone"
                  dataKey="composite"
                  data={[marker]}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={0}
                  dot={{ 
                    r: 6, 
                    fill: 'hsl(var(--destructive))', 
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-dashboard-chart-primary"></div>
            <span className="text-muted-foreground">Comments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-dashboard-chart-secondary"></div>
            <span className="text-muted-foreground">Subscribers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-dashboard-chart-accent"></div>
            <span className="text-muted-foreground">Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground font-medium">Composite Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Generated Clips</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecapChart;