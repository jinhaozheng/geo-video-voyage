
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Play, Clock, Eye } from 'lucide-react';

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

interface MapViewProps {
  videos: Video[];
}

const MapView: React.FC<MapViewProps> = ({ videos }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 模拟地图功能，实际项目中会使用真实的地图库
  const mockLocations = [
    { lat: 39.9042, lng: 116.4074, name: '北京' },
    { lat: 31.2304, lng: 121.4737, name: '上海' },
    { lat: 22.3193, lng: 114.1694, name: '香港' },
    { lat: 23.1291, lng: 113.2644, name: '广州' },
  ];

  return (
    <div className="relative h-full">
      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-purple-900 rounded-lg relative overflow-hidden"
      >
        {/* 地图背景效果 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-400 rounded-full blur-xl"></div>
        </div>

        {/* 模拟地图标记 */}
        {mockLocations.map((location, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              top: `${20 + index * 20}%`,
              left: `${15 + index * 20}%`,
            }}
            onClick={() => {
              // 模拟选择该位置的视频
              const locationVideos = videos.filter((_, i) => i % mockLocations.length === index);
              if (locationVideos.length > 0) {
                setSelectedVideo(locationVideos[0]);
              }
            }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              {videos.filter((_, i) => i % mockLocations.length === index).length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {videos.filter((_, i) => i % mockLocations.length === index).length}
                </div>
              )}
            </div>
            <div className="mt-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {location.name}
            </div>
          </div>
        ))}

        {/* 地图控制按钮 */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/30 transition-colors duration-300">
            <span className="text-xl">+</span>
          </button>
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/30 transition-colors duration-300">
            <span className="text-xl">-</span>
          </button>
        </div>

        {/* 当前位置指示器 */}
        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md p-3 rounded-lg text-white">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">当前位置</span>
          </div>
        </div>
      </div>

      {/* 视频详情弹窗 */}
      {selectedVideo && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-md w-full mx-4 border border-white/20">
            <div className="relative mb-4">
              <img 
                src={selectedVideo.thumbnail} 
                alt={selectedVideo.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg hover:bg-black/50 transition-colors duration-300">
                <Play className="h-12 w-12 text-white" />
              </button>
            </div>
            
            <h3 className="text-white text-lg font-semibold mb-2">{selectedVideo.title}</h3>
            
            <div className="flex items-center justify-between text-white/70 text-sm mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{selectedVideo.timestamp.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{selectedVideo.views} 次观看</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                播放视频
              </button>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
