import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";

// Convert timestamp to seconds for calculations
const timeToSeconds = (timeStr: string) => {
  const parts = timeStr.split(':').map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
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

// Mock data combining all metrics
const generateRecapData = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const timeInSeconds = (i / 49) * STREAM_DURATION;
    const baseValue = 50;
    const spike1 = i >= 35 && i <= 40 ? 40 : 0; // Around 2:34:12
    const spike2 = i >= 30 && i <= 35 ? 30 : 0; // Around 2:28:45
    const spike3 = i >= 25 && i <= 30 ? 25 : 0; // Around 2:15:33
    const spike4 = i >= 20 && i <= 25 ? 20 : 0; // Around 1:58:21
    const noise = Math.random() * 20 - 10;
    
    return {
      time: Math.floor(timeInSeconds),
      timeDisplay: secondsToTime(Math.floor(timeInSeconds)),
      composite: baseValue + spike1 + spike2 + spike3 + spike4 + noise,
    };
  });
};

// Empty data for disconnected state
const generateEmptyRecapData = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const timeInSeconds = (i / 49) * STREAM_DURATION;
    return {
      time: Math.floor(timeInSeconds),
      timeDisplay: secondsToTime(Math.floor(timeInSeconds)),
      composite: 0,
    };
  });
};

const RecapChart = ({ isConnected }: { isConnected: boolean }) => {
  const recapData = isConnected ? generateRecapData() : generateEmptyRecapData();
  
  // Mock clip markers with thumbnails - using exact timestamps from ClipsTable
  const clipMarkers = isConnected ? [
    { 
      time: timeToSeconds("2:34:12"), 
      composite: 85, 
      timestamp: "2:34:12",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: timeToSeconds("2:28:45"), 
      composite: 78, 
      timestamp: "2:28:45",
      thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f75bff?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: timeToSeconds("2:15:33"), 
      composite: 72, 
      timestamp: "2:15:33",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=160&h=90&fit=crop&crop=center"
    },
    { 
      time: timeToSeconds("1:58:21"), 
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
                domain={[0, STREAM_DURATION]}
                type="number"
                tickFormatter={(value) => secondsToTime(value)}
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
                labelFormatter={(value) => `Time: ${secondsToTime(value)}`}
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
            const leftPosition = ((marker.time / STREAM_DURATION) * 100);
            return (
              <div
                key={`preview-${index}`}
                className="absolute top-[-50px] transform -translate-x-1/2"
                style={{ left: `${leftPosition}%` }}
              >
                <div className="bg-card border border-destructive rounded-lg p-1 shadow-lg">
                  <img 
                    src={marker.thumbnail}
                    alt="Clip preview"
                    className="w-10 h-6 object-cover rounded"
                  />
                  <p className="text-[10px] text-center mt-0.5 font-mono">{marker.timestamp}</p>
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