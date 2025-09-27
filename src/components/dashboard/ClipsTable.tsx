import { useState, useEffect } from "react";
import { Play, Download, Edit, Share2, Upload, MoreHorizontal, Clock, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for clips
const mockClips = [
  {
    id: 1,
    timestamp: "2:34:12",
    duration: "0:15",
    peakMetric: "Comments Spike",
    score: 94,
    status: "Ready",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=160&h=90&fit=crop&crop=center",
    isNew: true
  },
  {
    id: 2,
    timestamp: "2:28:45", 
    duration: "0:22",
    peakMetric: "Likes Surge",
    score: 87,
    status: "Processing",
    thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f75bff?w=160&h=90&fit=crop&crop=center",
    isNew: true
  },
  {
    id: 3,
    timestamp: "2:15:33",
    duration: "0:18",
    peakMetric: "Subscriber Peak", 
    score: 82,
    status: "Ready",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=160&h=90&fit=crop&crop=center",
    isNew: false
  },
  {
    id: 4,
    timestamp: "1:58:21",
    duration: "0:12",
    peakMetric: "Comments Spike",
    score: 79,
    status: "Ready", 
    thumbnail: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=160&h=90&fit=crop&crop=center",
    isNew: false
  }
];

const ClipsTable = ({ isConnected }: { isConnected: boolean }) => {
  const [clips, setClips] = useState(isConnected ? mockClips : []);
  const [selectedClip, setSelectedClip] = useState<any>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [publishedClips, setPublishedClips] = useState<Set<number>>(new Set());

  // Update clips when connection changes
  useEffect(() => {
    setClips(isConnected ? mockClips : []);
  }, [isConnected]);

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: '𝕏' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube Shorts', icon: '▶️' },
    { id: 'facebook', name: 'Facebook', icon: '📘' }
  ];

  const handlePublish = (clip: any) => {
    setSelectedClip(clip);
    setIsPublishModalOpen(true);
    setSelectedPlatforms([]);
  };

  const handleViewAnalytics = (clip: any) => {
    console.log('Viewing analytics for clip:', clip.id);
    // Add analytics view logic here
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublishToSocial = () => {
    console.log('Publishing clip:', selectedClip.id, 'to platforms:', selectedPlatforms);
    // Mark clip as published
    setPublishedClips(prev => new Set([...prev, selectedClip.id]));
    setIsPublishModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 80) return "text-blue-600 font-semibold";
    if (score >= 70) return "text-yellow-600 font-medium";
    return "text-gray-600";
  };

  return (
    <section>
      <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">Generated Clips</h2>
              <p className="text-muted-foreground">Live-updating clips from your stream</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {clips.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Duration</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Peak Metric</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Score</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Preview</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clips.map((clip, index) => (
                  <tr 
                    key={clip.id} 
                    className={`border-b border-border hover:bg-muted/20 transition-colors ${
                      clip.isNew ? 'animate-fade-in bg-primary/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{clip.timestamp}</span>
                        {clip.isNew && (
                          <Badge variant="secondary" className="text-xs">NEW</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{clip.duration}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm">{clip.peakMetric}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-lg font-semibold ${getScoreColor(clip.score)}`}>
                        {clip.score}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <img 
                          src={clip.thumbnail} 
                          alt="Clip thumbnail"
                          className="w-20 h-11 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 text-white" fill="currentColor" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(clip.status)}>
                        {clip.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {publishedClips.has(clip.id) ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleViewAnalytics(clip)}
                          variant="outline"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handlePublish(clip)}
                          disabled={clip.status !== 'Ready'}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Clock className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No clips available</h3>
              <p className="text-sm">Connect to Twitch to start generating clips automatically</p>
            </div>
          )}
        </div>

        {/* Publish Modal */}
        <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publish Clip</DialogTitle>
            </DialogHeader>
            
            {selectedClip && (
              <div className="space-y-6">
                {/* Clip Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Clip Preview</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={selectedClip.thumbnail} 
                          alt="Clip thumbnail"
                          className="w-32 h-18 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" fill="currentColor" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-mono text-sm">Timestamp: {selectedClip.timestamp}</p>
                        <p className="font-mono text-sm">Duration: {selectedClip.duration}</p>
                        <p className="text-sm">Peak: {selectedClip.peakMetric}</p>
                        <p className="text-sm">Score: <span className={getScoreColor(selectedClip.score)}>{selectedClip.score}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Platforms</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialPlatforms.map((platform) => (
                      <div key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={() => handlePlatformToggle(platform.id)}
                        />
                        <label 
                          htmlFor={platform.id} 
                          className="flex items-center gap-2 cursor-pointer text-sm font-medium flex-1"
                        >
                          <span className="text-lg">{platform.icon}</span>
                          {platform.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPublishModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePublishToSocial}
                    disabled={selectedPlatforms.length === 0}
                  >
                    Publish to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ClipsTable;