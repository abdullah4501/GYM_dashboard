import React, { useState } from "react";
import axios from "axios";

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
}

interface Props {
  ebook: EbookData;
  onClose: () => void;
  onUpdate: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const EbookEditModal: React.FC<Props> = ({ ebook, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    title: ebook.title,
    description: ebook.description,
    price: ebook.price,
    forMembersOnly: ebook.forMembersOnly,
    isFree: ebook.isFree,
  });
  const [cover, setCover] = useState<File | null>(null);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const adminToken = localStorage.getItem("adminToken");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", String(form.price));
      fd.append("forMembersOnly", String(form.forMembersOnly));
      fd.append("isFree", String(form.isFree));
      if (cover) fd.append("cover", cover);
      if (ebookFile) fd.append("ebook", ebookFile);

      await axios.put(`${API_URL}/ebooks/${ebook._id}`, fd, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpdate();
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update ebook."
      );
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-primary"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Edit E-Book</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white mb-1">Title</label>
            <input
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Description</label>
            <textarea
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Price</label>
            <input
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
              name="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-6">
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={handleChange}
              />
              Free
            </label>
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                name="forMembersOnly"
                checked={form.forMembersOnly}
                onChange={handleChange}
              />
              Members Only
            </label>
          </div>
          <div>
            <label className="block text-white mb-1">Replace Cover Image</label>
            <input
              className="block w-full"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setCover(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Replace eBook File</label>
            <input
              className="block w-full"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EbookEditModal;
