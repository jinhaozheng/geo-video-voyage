
import React, { useState, useRef } from 'react';
import { Camera, Square, MapPin, Globe, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';

interface VideoCaptureProps {
  onVideoSaved: (video: any) => void;
}

const VideoCapture: React.FC<VideoCaptureProps> = ({ onVideoSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 获取用户媒体权限并开始录制
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // 停止所有轨道
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // 获取位置信息
      getCurrentLocation();
      
      toast.success('开始录制视频');
    } catch (error) {
      console.error('无法访问摄像头:', error);
      toast.error('无法访问摄像头，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('录制完成');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('无法获取位置:', error);
          // 使用模拟位置
          setLocation({
            lat: 39.9042 + Math.random() * 0.01,
            lng: 116.4074 + Math.random() * 0.01
          });
        }
      );
    }
  };

  const saveVideo = () => {
    if (!recordedVideo || !title.trim()) {
      toast.error('请填写视频标题');
      return;
    }

    const newVideo = {
      id: Date.now().toString(),
      url: recordedVideo,
      thumbnail: recordedVideo, // 在实际应用中，这里应该是视频缩略图
      latitude: location?.lat || 39.9042,
      longitude: location?.lng || 116.4074,
      title: title.trim(),
      timestamp: new Date(),
      isOwn: true,
      isPublic,
      views: 0
    };

    onVideoSaved(newVideo);
    
    // 重置状态
    setRecordedVideo(null);
    setTitle('');
    setIsPublic(false);
    
    toast.success('视频保存成功！');
  };

  const discardVideo = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    setTitle('');
    toast.info('已丢弃视频');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">拍摄视频</h2>
        
        {/* 视频预览区域 */}
        <div className="relative mb-6 bg-black rounded-xl overflow-hidden">
          {!recordedVideo ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
          ) : (
            <video
              src={recordedVideo}
              controls
              className="w-full h-64 object-cover"
            />
          )}
          
          {/* 录制状态指示器 */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">录制中</span>
            </div>
          )}
          
          {/* 位置信息 */}
          {location && (
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
              <MapPin className="h-3 w-3" />
              <span>已定位</span>
            </div>
          )}
        </div>

        {/* 录制控制按钮 */}
        {!recordedVideo && (
          <div className="flex justify-center mb-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
              >
                <Camera className="h-8 w-8" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Square className="h-8 w-8" />
              </button>
            )}
          </div>
        )}

        {/* 视频信息编辑 */}
        {recordedVideo && (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">视频标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="为你的视频添加一个标题..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
              />
            </div>

            {/* 隐私设置 */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                {isPublic ? (
                  <Globe className="h-5 w-5 text-green-400" />
                ) : (
                  <Lock className="h-5 w-5 text-orange-400" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {isPublic ? '公开视频' : '私人视频'}
                  </p>
                  <p className="text-white/60 text-sm">
                    {isPublic ? '所有人都可以看到' : '只有你可以看到'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  isPublic ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <button
                onClick={saveVideo}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Check className="h-5 w-5" />
                <span>保存视频</span>
              </button>
              <button
                onClick={discardVideo}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors duration-300"
              >
                重新录制
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCapture;
