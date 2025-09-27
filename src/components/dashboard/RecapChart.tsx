import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
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
  
  // Mock clip markers with thumbnails based on timestamps from ClipsTable
  const clipMarkers = isConnected ? [
    { 
      time: 12, 
      composite: 85, 
      timestamp: "2:34:12",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: 8, 
      composite: 78, 
      timestamp: "2:28:45",
      thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f75bff?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: 6, 
      composite: 72, 
      timestamp: "2:15:33",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: 4, 
      composite: 68, 
      timestamp: "1:58:21",
      thumbnail: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=160&h=90&fit=crop&crop=center"
    }
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
        
        <div className="h-64 relative">
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
              
              {/* Vertical lines for clips */}
              {clipMarkers.map((marker, index) => (
                <ReferenceLine
                  key={`clip-line-${index}`}
                  x={marker.time}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  strokeDasharray="none"
                />
              ))}
              
              {/* Main composite line */}
              <Line 
                type="monotone" 
                dataKey="composite" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Clip previews positioned absolutely */}
          {clipMarkers.map((marker, index) => {
            const leftPosition = ((marker.time / 49) * 100); // Assuming 50 data points (0-49)
            return (
              <div
                key={`preview-${index}`}
                className="absolute top-0 transform -translate-x-1/2"
                style={{ left: `${leftPosition}%` }}
              >
                <div className="bg-card border border-destructive rounded-lg p-2 shadow-lg">
                  <img 
                    src={marker.thumbnail}
                    alt="Clip preview"
                    className="w-16 h-9 object-cover rounded"
                  />
                  <p className="text-xs text-center mt-1 font-mono">{marker.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground font-medium">Composite Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3 bg-destructive"></div>
            <span className="text-muted-foreground">Generated Clips</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecapChart;