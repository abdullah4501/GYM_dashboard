import React, { useState } from 'react';
import { Upload, BookOpen, Eye, Edit, Trash2, Search, Plus, Download } from 'lucide-react';
import FileUpload from './FileUpload';

interface EbookData {
  id: string;
  title: string;
  category: string;
  pages: number;
  downloads: number;
  uploadDate: string;
  status: 'published' | 'draft';
  cover: string;
  description: string;
}

const EbookManagement: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const ebooks: EbookData[] = [
    {
      id: '1',
      title: 'Complete Nutrition Guide',
      category: 'Nutrition',
      pages: 85,
      downloads: 523,
      uploadDate: '2024-01-15',
      status: 'published',
      cover: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'A comprehensive guide to nutrition for fitness enthusiasts.'
    },
    {
      id: '2',
      title: 'Home Workout Blueprint',
      category: 'Workouts',
      pages: 67,
      downloads: 892,
      uploadDate: '2024-01-12',
      status: 'published',
      cover: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'Transform your home into a complete fitness center.'
    },
    {
      id: '3',
      title: 'Mental Health & Fitness',
      category: 'Wellness',
      pages: 92,
      downloads: 234,
      uploadDate: '2024-01-10',
      status: 'draft',
      cover: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      description: 'The connection between physical fitness and mental wellbeing.'
    },
  ];

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">E-Book Management</h1>
          <p className="text-gray-400">Upload and manage your fitness e-books</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Upload E-Book</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search e-books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="">All Categories</option>
            <option value="nutrition">Nutrition</option>
            <option value="workouts">Workouts</option>
            <option value="wellness">Wellness</option>
            <option value="supplements">Supplements</option>
          </select>
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* E-Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEbooks.map((ebook) => (
          <div key={ebook.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors duration-200">
            <div className="relative group">
              <img
                src={ebook.cover}
                alt={ebook.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ebook.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                  {ebook.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{ebook.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{ebook.category}</p>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{ebook.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{ebook.pages} pages</span>
                <span>{ebook.downloads} downloads</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
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
          type="ebook"
          onClose={() => setShowUpload(false)}
          onUpload={(file, metadata) => {
            console.log('Uploading e-book:', file, metadata);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
};

export default EbookManagement;