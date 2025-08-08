import React, { useState } from 'react';
import { Upload, Video, Eye, Edit, Trash2, Search, Plus, Play } from 'lucide-react';
import FileUpload from './FileUpload';

interface VideoData {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: number;
  uploadDate: string;
  status: 'published' | 'draft';
  thumbnail: string;
}

const VideoManagement: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const videos: VideoData[] = [
    {
      id: '1',
      title: 'Full Body HIIT Workout',
      category: 'HIIT',
      duration: '25:30',
      views: 1247,
      uploadDate: '2024-01-15',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Strength Training Basics',
      category: 'Strength',
      duration: '35:45',
      views: 892,
      uploadDate: '2024-01-12',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Cardio Blast Session',
      category: 'Cardio',
      duration: '20:15',
      views: 654,
      uploadDate: '2024-01-10',
      status: 'draft',
      thumbnail: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Video Management</h1>
          <p className="text-gray-400">Upload and manage your coaching videos</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="">All Categories</option>
            <option value="hiit">HIIT</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors duration-200">
            <div className="relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  video.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                  {video.status}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 text-sm rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{video.category}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{video.views} views</span>
                <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <FileUpload
          type="video"
          onClose={() => setShowUpload(false)}
          onUpload={(file, metadata) => {
            console.log('Uploading video:', file, metadata);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
};

export default VideoManagement;