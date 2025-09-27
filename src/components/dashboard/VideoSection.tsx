import { Play, Twitch } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import demoVideo from "@/assets/demo-video.mp4";

const VideoSection = ({ isConnected, setIsConnected }: { isConnected: boolean; setIsConnected: (value: boolean) => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsDialogOpen(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <section className="mb-8">
      <div className="relative bg-card rounded-2xl shadow-lg overflow-hidden hover-lift">
        {!isConnected ? (
          /* Twitch Connection State */
          <div className="relative aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Connect Button Overlay */}
            <div className="relative z-10 flex flex-col items-center gap-4 text-white">
              <div className="w-20 h-20 bg-purple-600/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-300/30">
                <Twitch className="h-8 w-8" />
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-1">Connect to Twitch</h3>
                <p className="text-sm opacity-80">Connect your Twitch account to start streaming</p>
              </div>
              <Button 
                onClick={handleConnectClick}
                variant="outline" 
                className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
              >
                <Twitch className="mr-2 h-4 w-4" />
                Connect to Twitch
              </Button>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        ) : (
          /* Connected - Video Player */
          <div className="relative aspect-video">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
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
        )}
      </div>

      {/* Twitch Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Twitch className="h-5 w-5 text-purple-600" />
              Connect to Twitch
            </DialogTitle>
            <DialogDescription>
              Enter your Twitch credentials to connect your account and start streaming.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your Twitch username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              disabled={!credentials.username || !credentials.password || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection;