import React, { useState, useRef } from 'react';
import { Upload, X, FileVideo, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  type: 'video' | 'ebook' | 'image';
  onClose: () => void;
  onUpload: (file: File, metadata: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ type, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate actual upload
    setTimeout(() => {
      setUploadProgress(100);
      const formData = new FormData(e.currentTarget);
      const metadata = Object.fromEntries(formData.entries());
      onUpload(selectedFile, metadata);
      clearInterval(progressInterval);
    }, 2000);
  };

  const getFileIcon = () => {
    if (type === 'video') return <FileVideo className="w-12 h-12 text-red-500" />;
    if (type === 'ebook') return <FileText className="w-12 h-12 text-red-500" />;
    return <Upload className="w-12 h-12 text-red-500" />;
  };

  const getAcceptedTypes = () => {
    if (type === 'video') return 'video/*';
    if (type === 'ebook') return '.pdf,.epub,.mobi';
    return 'image/*';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            Upload {type === 'ebook' ? 'E-Book' : type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive 
                ? 'border-red-500 bg-red-50 bg-opacity-5' 
                : 'border-gray-600 hover:border-red-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-4">
                {getFileIcon()}
                <div className="text-left">
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
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
                  Drag and drop your {type} here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-red-500 hover:text-red-400 underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-gray-400 text-sm">
                  {type === 'video' && 'Supports: MP4, MOV, AVI, WebM (Max 500MB)'}
                  {type === 'ebook' && 'Supports: PDF, EPUB, MOBI (Max 50MB)'}
                  {type === 'image' && 'Supports: JPG, PNG, GIF, WebP (Max 10MB)'}
                </p>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedTypes()}
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Uploading...</span>
                <span className="text-white text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder={`Enter ${type} title`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              >
                <option value="">Select a category</option>
                {type === 'video' && (
                  <>
                    <option value="hiit">HIIT</option>
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="nutrition">Nutrition</option>
                  </>
                )}
                {type === 'ebook' && (
                  <>
                    <option value="nutrition">Nutrition</option>
                    <option value="workouts">Workouts</option>
                    <option value="wellness">Wellness</option>
                    <option value="supplements">Supplements</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder={`Describe your ${type}...`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="fitness, workout, beginner"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-gray-300">Featured content</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  defaultChecked
                />
                <span className="ml-2 text-gray-300">Publish immediately</span>
              </label>
            </div>
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
              disabled={!selectedFile || uploading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {uploading ? 'Uploading...' : `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>
          </div>

          {/* Warning */}
          {selectedFile && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium">Upload Guidelines:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Ensure content follows community guidelines</li>
                  <li>• Use descriptive titles and tags for better discoverability</li>
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