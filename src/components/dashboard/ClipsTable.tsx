import { useState } from "react";
import { Play, Download, Edit, Share2, Upload, MoreHorizontal, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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

const ClipsTable = () => {
  const [clips, setClips] = useState(mockClips);

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
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Open in Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 mr-2" />
                            Post to Social Media
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ClipsTable;