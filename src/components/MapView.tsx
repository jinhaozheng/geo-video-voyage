
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
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

const GoogleMapComponent: React.FC<{ videos: Video[]; onVideoSelect: (video: Video) => void }> = ({ videos, onVideoSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current && !map.current) {
      // 初始化地图
      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: 39.9042, lng: 116.4074 }, // 北京
        zoom: 10,
        styles: [
          {
            featureType: "all",
            stylers: [{ saturation: -20 }]
          }
        ]
      });
    }
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // 清除现有标记
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // 添加视频标记
    videos.forEach((video) => {
      const marker = new google.maps.Marker({
        position: { lat: video.latitude, lng: video.longitude },
        map: map.current,
        title: video.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#8B5CF6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });

      marker.addListener('click', () => {
        onVideoSelect(video);
      });

      markers.current.push(marker);
    });

    // 如果有视频，调整地图视野以包含所有标记
    if (videos.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      videos.forEach(video => {
        bounds.extend({ lat: video.latitude, lng: video.longitude });
      });
      map.current.fitBounds(bounds);
    }
  }, [videos, onVideoSelect]);

  return <div ref={mapRef} className="w-full h-full" />;
};

const LoadingComponent = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-purple-900 flex items-center justify-center">
    <div className="text-white text-lg">加载地图中...</div>
  </div>
);

const ErrorComponent = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-purple-900 flex items-center justify-center">
    <div className="text-center text-white">
      <div className="text-lg mb-2">地图加载失败</div>
      <div className="text-sm text-white/70">请检查网络连接或Google Maps API配置</div>
    </div>
  </div>
);

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingComponent />;
    case Status.FAILURE:
      return <ErrorComponent />;
    case Status.SUCCESS:
      return null;
  }
};

const MapView: React.FC<MapViewProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoSelect = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  // 模拟视频数据（如果没有真实视频数据）
  const mockVideos = videos.length === 0 ? [
    {
      id: '1',
      url: '',
      thumbnail: '/placeholder.svg',
      latitude: 39.9042,
      longitude: 116.4074,
      title: '北京天安门广场',
      timestamp: new Date(),
      isOwn: true,
      isPublic: true,
      views: 123
    },
    {
      id: '2',
      url: '',
      thumbnail: '/placeholder.svg',
      latitude: 31.2304,
      longitude: 121.4737,
      title: '上海外滩夜景',
      timestamp: new Date(),
      isOwn: false,
      isPublic: true,
      views: 456
    }
  ] : videos;

  return (
    <div className="relative h-full">
      <Wrapper apiKey="AIzaSyAY98e-cFb2XFT4iTVxwjFJGwkkGqi8sB0" render={render}>
        <GoogleMapComponent videos={mockVideos} onVideoSelect={handleVideoSelect} />
      </Wrapper>

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
