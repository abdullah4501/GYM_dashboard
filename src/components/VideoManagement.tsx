import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Search, Plus, Play } from 'lucide-react';
import FileUpload from './FileUpload';
import axios from 'axios';
import ConfirmModal from "./ConfirmModal";
import VideoModal from './VideoModal'; // Import the modal


interface VideoData {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
  } | null;
  level: string;
  description: string;
  forMembersOnly: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

interface CategoryData {
  _id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;


const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editVideo, setEditVideo] = useState<VideoData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/workout-library`);
      setVideos(res.data?.videos || []);
    } catch (err) {
      setVideos([]); // on error, fallback to empty
      console.error("Failed to fetch videos:", err);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/workout-categories`);
      setCategories(res.data?.categories || []);
    } catch (err) {
      setCategories([]);
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const filteredVideos = Array.isArray(videos)
    ? videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.category?.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    )
    : [];


  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    await axios.delete(`${API_URL}/workout-library/${id}`);
    fetchVideos();
  };


  const handlePlay = (video: VideoData) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  // Handle edit
  const handleEdit = (video: VideoData) => setEditVideo(video);

  // Handle upload/edit completion
  const handleUploadDone = () => {
    setShowUpload(false);
    setEditVideo(null);
    fetchVideos();
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    await axios.delete(`${API_URL}/workout-library/${confirmDeleteId}`);
    setConfirmDeleteId(null);
    fetchVideos();
  };
  const handleCancelDelete = () => setConfirmDeleteId(null);

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

      {/* Search */}
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
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            onChange={e => setSearchTerm(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (

          <div key={video._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors duration-200">
            <div className="relative group">
              <img
                src={
                  video.thumbnailUrl
                    ? `${API_URL.replace('/api', '')}${video.thumbnailUrl}`
                    : 'https://placehold.co/320x240?text=No+Thumbnail'
                }
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={e => { e.stopPropagation(); handlePlay(video); }}
                >
                  <Play className="w-12 h-12 text-white" />
                </button>
              </div>

              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${video.forMembersOnly ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                  {video.forMembersOnly ? 'Members Only' : 'Public'}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 text-sm rounded">
                Level: {video.level}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-3">
                {video.category?.name || 'No Category'}
              </p>
              <p className="text-gray-500 text-xs mb-2">{video.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                  onClick={() => handleEdit(video)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                  onClick={() => handleDeleteClick(video._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit Modal */}
      {(showUpload || editVideo) && (
        <FileUpload
          key={editVideo ? editVideo._id : 'new'}
          type="video"
          categories={categories}
          onClose={() => { setShowUpload(false); setEditVideo(null); }}
          onUpload={handleUploadDone}
          initialData={editVideo}
        />
      )}
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
      />
      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videoId={activeVideo?._id || ''}  // <-- ✅ use activeVideo
        title={activeVideo?.title || ''}
      />



    </div>
  );
};

export default VideoManagement;
