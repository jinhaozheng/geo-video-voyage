
import React from 'react';
import { Play, MapPin, Clock, Eye, Globe, Lock } from 'lucide-react';

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  latitude: number;
  longitude: number;
  title: string;
  timestamp: Date;
  isOwn: boolean;
  isPublic: boolean;
  views: number;
}

interface VideoListProps {
  videos: Video[];
  title: string;
  emptyMessage: string;
}

const VideoList: React.FC<VideoListProps> = ({ videos, title, emptyMessage }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-20"></div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="mb-4">
              <Play className="h-16 w-16 text-white/50 mx-auto" />
            </div>
            <p className="text-white/70 text-lg">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                {/* 视频缩略图 */}
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors duration-300">
                      <Play className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  
                  {/* 隐私标识 */}
                  <div className="absolute top-3 right-3">
                    {video.isPublic ? (
                      <div className="bg-green-500 p-1 rounded-full">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="bg-orange-500 p-1 rounded-full">
                        <Lock className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 视频信息 */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-3 line-clamp-2">{video.title}</h3>
                  
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>位置已记录</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(video.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
