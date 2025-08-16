import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileVideo, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  type: 'video';
  categories: { _id: string; name: string }[];
  onClose: () => void;
  onUpload: () => void;
  initialData?: any;
}

const API_URL = import.meta.env.VITE_API_URL ;

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  categories,
  onClose,
  onUpload,
  initialData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category?._id || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [level, setLevel] = useState(initialData?.level || '');
  const [forMembersOnly, setForMembersOnly] = useState(
    initialData?.forMembersOnly !== undefined ? initialData.forMembersOnly : true
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Set file for editing (optional: prefill)
  useEffect(() => {
    setTitle(initialData?.title || '');
    setCategory(initialData?.category?._id || '');
    setDescription(initialData?.description || '');
    setLevel(initialData?.level || '');
    setForMembersOnly(
      initialData?.forMembersOnly !== undefined ? initialData.forMembersOnly : true
    );
    setSelectedFile(null);
    setSelectedThumbnail(null);
  }, [initialData]);

  // Get icon
  const getFileIcon = () => <FileVideo className="w-12 h-12 text-red-500" />;

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedThumbnail(e.target.files[0]);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    if (selectedFile) formData.append('video', selectedFile);
    if (selectedThumbnail) formData.append('thumbnail', selectedThumbnail);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('level', level);
    formData.append('forMembersOnly', forMembersOnly ? 'true' : 'false');

    try {
      if (initialData?._id) {
        // Update
        await axios.put(
          `${API_URL}/workout-library/${initialData._id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // Create
        await axios.post(`${API_URL}/workout-library`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setUploading(false);
      onUpload();
      toast.success('Video uploaded successfully!');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Upload failed';
        toast.error(errorMsg);
      } else {
        toast.error('Upload failed');
      }
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {initialData ? 'Edit Video' : 'Upload Video'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              selectedFile
                ? 'border-green-500 bg-green-50 bg-opacity-5'
                : 'border-gray-600 hover:border-red-500'
            }`}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-4">
                {getFileIcon()}
                <div className="text-left">
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                {getFileIcon()}
                <p className="text-white mt-4 mb-2">
                  Drag and drop your video here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-red-500 hover:text-red-400 underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-gray-400 text-sm">
                  Supports: MP4, MOV, AVI, WebM (Max 500MB)
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail (optional)
            </label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
            />
          </div>

          {/* Metadata Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                required
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="Enter video title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={category}
                required
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level *
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={level}
                required
                onChange={e => setLevel(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="Enter level (e.g. 1, 2, 3...)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                rows={3}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="Describe your video..."
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={forMembersOnly}
                onChange={e => setForMembersOnly(e.target.checked)}
                className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
              />
              <span className="text-gray-300">For members only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || (!selectedFile && !initialData)}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {uploading
                ? 'Uploading...'
                : initialData
                ? 'Update Video'
                : 'Upload Video'}
            </button>
          </div>

          {/* Warning */}
          {(selectedFile || initialData) && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium">Upload Guidelines:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Ensure content follows community guidelines</li>
                  <li>• Use descriptive titles for better discoverability</li>
                  <li>• Check file quality and format before uploading</li>
                </ul>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
