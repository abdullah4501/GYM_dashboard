// EbookUploadModal.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface EbookUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const EbookUploadModal: React.FC<EbookUploadModalProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    isFree: false,
    forMembersOnly: false,
  });
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [ebookPreview, setEbookPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers for text fields and checkboxes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEbookFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEbookFile(file);
      setEbookPreview(
        file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null // <-- Use null instead of undefined!
      );
    } else {
      setEbookFile(null);
      setEbookPreview(null);
    }
  };
  

  // Handle cover file
  const handleCoverFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return setError("Title is required");
    if (!ebookFile) return setError("Ebook file is required");
    if (!coverFile) return setError("Cover image is required");

    const allowedEbookTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];
    if (!allowedEbookTypes.includes(ebookFile.type)) {
      return setError("Ebook file must be PDF or image (JPG, PNG)");
    }

    if (!["image/jpeg", "image/png"].includes(coverFile.type)) {
      return setError("Cover image must be JPG or PNG");
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price ? form.price : "0");
    data.append("isFree", String(form.isFree));
    data.append("forMembersOnly", String(form.forMembersOnly));
    data.append("ebook", ebookFile);
    data.append("cover", coverFile);

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API_URL}/ebooks`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpload();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Failed to upload e-book"
      );
    }
    setLoading(false);
  };

  // Close preview object URLs on modal close/unmount
  React.useEffect(() => {
    return () => {
      if (ebookPreview) URL.revokeObjectURL(ebookPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [ebookPreview, coverPreview]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-[650px] max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-red-400"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Upload E-Book</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white block mb-1" htmlFor="title">Title*</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded p-2 border-none outline-none"
              required
              maxLength={140}
            />
          </div>
          <div>
            <label className="text-white block mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded p-2 border-none outline-none resize-none"
              rows={3}
              maxLength={2000}
            />
          </div>
          <div>
            <label className="text-white block mb-1">Ebook File* (PDF/JPG/PNG)</label>
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png"
              onChange={handleEbookFile}
              className="w-full !text-white"
              required
            />
            {ebookFile && (
              <div className="mt-1 text-gray-300 text-sm">
                File: {ebookFile.name} ({Math.round(ebookFile.size / 1024)} KB)
              </div>
            )}
          </div>
          <div>
            <label className="text-white block mb-1">Cover Image* (JPG/PNG)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleCoverFile}
              className="w-full !text-white"
              required
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="cover preview"
                className="mt-2 rounded w-28 h-36 object-cover border"
              />
            )}
          </div>
          <div>
            <label className="text-white block mb-1" htmlFor="price">Price (in Euro)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-gray-700 !text-white rounded p-2 border-none outline-none"
              disabled={form.isFree}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-white flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={handleChange}
                className="form-checkbox accent-red-500"
              />
              Free
            </label>
            <label className="text-white flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="forMembersOnly"
                checked={form.forMembersOnly}
                onChange={handleChange}
                className="form-checkbox accent-red-500"
              />
              For Members Only
            </label>
          </div>
          {error && (
            <div className="text-red-400 text-sm mb-2">{error}</div>
          )}
          <button
            type="submit"
            className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EbookUploadModal;
