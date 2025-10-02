import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Search, Plus, BookOpen } from 'lucide-react';
import EbookUploadModal from './EbookUploadModal';
import EbookEditModal from './EbookEditModal';
import PreviewModal from './PreviewModal';
import axios from 'axios';
import ConfirmModal from './ConfirmModal';

interface EbookData {
  _id: string;
  title: string;
  description: string;
  coverUrl: string;
  ebookUrl: string | null;
  mimeType: string;
  price: number;
  forMembersOnly: boolean;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const EbookManagement: React.FC = () => {
  const [ebooks, setEbooks] = useState<EbookData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEbook, setEditEbook] = useState<EbookData | null>(null);
  const [previewEbook, setPreviewEbook] = useState<EbookData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const adminToken = localStorage.getItem('adminToken');

  // Fetch all ebooks
  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/ebooks`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setEbooks(res.data.ebooks || []);
    } catch (err) {
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
    // eslint-disable-next-line
  }, []);

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete ebook
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`${API_URL}/ebooks/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setConfirmDeleteId(null);
      fetchEbooks();
    } catch (err) {
      // toast error
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  // Handlers for modals
  const handleEdit = (ebook: EbookData) => setEditEbook(ebook);
  const handlePreview = (ebook: EbookData) => setPreviewEbook(ebook);

  // Upload modal done
  const handleUploadDone = () => {
    setShowUpload(false);
    fetchEbooks();
  };

  // Edit modal done
  const handleEditDone = () => {
    setEditEbook(null);
    fetchEbooks();
  };

  const handleCancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
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
      {/* Search */}
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
        </div>
      </div>

      {/* E-Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEbooks.map((ebook) => (
          <div key={ebook._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors duration-200">
            <div className="relative group">
              <img
                src={ebook.coverUrl ? IMG_URL + ebook.coverUrl : 'https://placehold.co/300x400?text=No+Cover'}
                alt={ebook.title}
                className="w-full h-64 object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  className="bg-white/10 rounded-full p-3"
                  onClick={() => handlePreview(ebook)}
                  title="Preview"
                >
                  <BookOpen className="w-10 h-10 text-white" />
                </button>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${ebook.forMembersOnly ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {ebook.forMembersOnly ? 'Members Only' : 'Public'}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${ebook.isFree ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>
                  {ebook.isFree ? 'Free' : 'Paid'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{ebook.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{ebook.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{new Date(ebook.createdAt).toLocaleDateString()}</span>
                <span>€ {ebook.price || 0}</span>
              </div>
              <div className="flex space-x-2 justify-between">
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                  onClick={() => handlePreview(ebook)}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <div className='flex col gap-2'>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                    onClick={() => handleEdit(ebook)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                    onClick={() => handleDeleteClick(ebook._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <EbookUploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={handleUploadDone}
        />
      )}
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete E-Book"
        description="Are you sure you want to delete this e-book? This action cannot be undone."
      />
      {/* Edit Modal */}
      {editEbook && (
        <EbookEditModal
          ebook={editEbook}
          onClose={() => setEditEbook(null)}
          onUpdate={handleEditDone}
        />
      )}
      {previewEbook && (
        <PreviewModal
          open={!!previewEbook}
          onClose={() => setPreviewEbook(null)}
          ebookId={previewEbook._id}
          mimeType={previewEbook.mimeType}
          title={previewEbook.title}
        />
      )}
    </div>
  );
};

export default EbookManagement;
