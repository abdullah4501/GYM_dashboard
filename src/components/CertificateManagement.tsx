import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Search, Plus, Download } from 'lucide-react';
import CertificateUploadModal from './CertificateUploadModal'; 
import CertificateEditModal from './CertificateEditModal';     
import PreviewModal from './CertificatePreviewModal';                     // can reuse
import ConfirmModal from './ConfirmModal';                     // reuse
import axios from 'axios';

interface CertificateData {
  _id: string;
  name: string;
  description: string;
  pdfUrl: string | null;
  mimeType: string;
  thumbUrl: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const CertificateManagement: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editCertificate, setEditCertificate] = useState<CertificateData | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<CertificateData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const adminToken = localStorage.getItem('adminToken');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/certificates`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setCertificates(res.data.certificates || []);
    } catch {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line
  }, []);

  const filteredCertificates = certificates.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`${API_URL}/certificates/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setConfirmDeleteId(null);
      fetchCertificates();
    } catch {}
  };

  const handleDeleteClick = (id: string) => setConfirmDeleteId(id);
  const handleEdit = (cert: CertificateData) => setEditCertificate(cert);
  const handlePreview = (cert: CertificateData) => setPreviewCertificate(cert);

  // Upload modal
  const handleUploadDone = () => {
    setShowUpload(false);
    fetchCertificates();
  };

  // Edit modal
  const handleEditDone = () => {
    setEditCertificate(null);
    fetchCertificates();
  };

  const handleCancelDelete = () => setConfirmDeleteId(null);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificate Management</h1>
          <p className="text-gray-400">Upload and manage course certificates</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCertificates.map((cert) => (
          <div key={cert._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors duration-200">
            <div className="relative group">
              <img
                src={cert.thumbUrl ? IMG_URL + cert.thumbUrl : 'https://placehold.co/300x400?text=No+Thumbnail'}
                alt={cert.name}
                className="w-full h-64 object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  className="bg-white/10 rounded-full p-3"
                  onClick={() => handlePreview(cert)}
                  title="Preview"
                >
                  <Eye className="w-10 h-10 text-white" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{cert.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{cert.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{new Date(cert.createdAt).toLocaleDateString()}</span>
                <span>{(cert.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex space-x-2 justify-between">
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                  onClick={() => handlePreview(cert)}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <div className='flex col gap-2'>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors duration-200"
                    onClick={() => handleEdit(cert)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                    onClick={() => handleDeleteClick(cert._id)}
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
        <CertificateUploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={handleUploadDone}
        />
      )}
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
      />
      {/* Edit Modal */}
      {editCertificate && (
        <CertificateEditModal
          certificate={editCertificate}
          onClose={() => setEditCertificate(null)}
          onUpdate={handleEditDone}
        />
      )}
      {previewCertificate && (
        <PreviewModal
        open={!!previewCertificate}
        onClose={() => setPreviewCertificate(null)}
        certificateId={previewCertificate._id}
        mimeType={previewCertificate.mimeType}
        title={previewCertificate.name}
      />
      
      )}
    </div>
  );
};

export default CertificateManagement;
