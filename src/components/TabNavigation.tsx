
import React from 'react';
import { MapPin, Video, User, Users } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'map' | 'capture' | 'my-videos' | 'public-videos';
  onTabChange: (tab: 'map' | 'capture' | 'my-videos' | 'public-videos') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'map', label: '地图', icon: MapPin },
    { id: 'capture', label: '拍摄', icon: Video },
    { id: 'my-videos', label: '我的', icon: User },
    { id: 'public-videos', label: '公众', icon: Users },
  ] as const;

  return (
    <nav className="bg-white/10 backdrop-blur-md border-t border-white/20 sticky bottom-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
