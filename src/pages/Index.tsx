
import React, { useState } from 'react';
import { MapPin, Video, Users, User } from 'lucide-react';
import MapView from '../components/MapView';
import VideoCapture from '../components/VideoCapture';
import VideoList from '../components/VideoList';
import TabNavigation from '../components/TabNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'capture' | 'my-videos' | 'public-videos'>('map');
  const [videos, setVideos] = useState<any[]>([]);

  const handleVideoSaved = (newVideo: any) => {
    setVideos(prev => [...prev, newVideo]);
    setActiveTab('map'); // 返回地图查看新添加的视频
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">视频地图</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-white/80">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">发现身边的精彩瞬间</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <div className="h-[calc(100vh-180px)]">
            <MapView videos={videos} />
          </div>
        )}
        
        {activeTab === 'capture' && (
          <div className="p-4">
            <VideoCapture onVideoSaved={handleVideoSaved} />
          </div>
        )}
        
        {activeTab === 'my-videos' && (
          <div className="p-4">
            <VideoList 
              videos={videos.filter(v => v.isOwn)} 
              title="我的视频"
              emptyMessage="还没有拍摄任何视频，去拍摄第一个吧！"
            />
          </div>
        )}
        
        {activeTab === 'public-videos' && (
          <div className="p-4">
            <VideoList 
              videos={videos.filter(v => v.isPublic)} 
              title="公众视频"
              emptyMessage="还没有公众视频，成为第一个分享者吧！"
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
