import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="mb-8">
      <div className="relative bg-card rounded-2xl shadow-lg overflow-hidden hover-lift">
        {/* Video Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-dashboard-chart-primary/20 to-dashboard-chart-secondary/20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Play Button Overlay */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play className="h-8 w-8 ml-1" fill="currentColor" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-1">Live Stream Preview</h3>
              <p className="text-sm opacity-80">Click to view full stream</p>
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          {/* Live Indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">LIVE</span>
          </div>
          
          {/* Duration */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="text-white text-sm font-mono">2:34:15</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;