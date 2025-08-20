import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  certificate: {
    _id: string;
    name: string;
    description: string;
    // pdfUrl: string; // not editable
  };
  onClose: () => void;
  onUpdate: () => void;
}

const CertificateEditModal: React.FC<Props> = ({ certificate, onClose, onUpdate }) => {
  const [name, setName] = useState(certificate.name);
  const [description, setDescription] = useState(certificate.description);
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null); // <-- new state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCover(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) formData.append("file", file);
      if (cover) formData.append("thumb", cover); // <-- send cover as 'thumb'

      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/certificates/${certificate._id}`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpdate();
    } catch (err: any) {
      // 👇 Check for backend response error
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-primary"
        >
          ×
        </button>
        <h3 className="text-xl font-semibold text-white mb-4">Edit Certificate</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              placeholder="Enter certificate name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Replace PDF File (optional)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleCoverChange}
              required
              className="block w-full text-white"
            />
            {cover && (
              <div className="mt-2">
                <span className="text-gray-400 text-xs">Selected:</span>
                <span className="ml-2 text-white text-xs">{cover.name}</span>
              </div>
            )}
          </div>
          {errorMsg && (
            <div className="bg-red-700 text-white px-4 py-2 rounded mb-2 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name || !cover}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateEditModal;
