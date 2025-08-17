import React, { useEffect, useState } from "react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  ebookId: string;
  mimeType: string; // 'application/pdf' | 'image/jpeg' | 'image/png'
  title: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const PreviewModal: React.FC<PreviewModalProps> = ({
  open, onClose, ebookId, mimeType, title
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchEbook = async () => {
      setLoading(true);
      setBlobUrl(null);
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/ebooks/${ebookId}/admin-fetch`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
        if (!res.ok) throw new Error("Failed to fetch ebook");
        const blob = await res.blob();
        setBlobUrl(URL.createObjectURL(blob));
      } catch (err) {
        setBlobUrl(null);
      }
      setLoading(false);
    };
    fetchEbook();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [open, ebookId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 shadow-2xl max-w-[850px] w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-primary"
        >
          ×
        </button>
        <h3 className="text-white text-lg mb-3">{title}</h3>
        {loading ? (
          <div className="text-white">Loading preview...</div>
        ) : blobUrl ? (
          mimeType === "application/pdf" ? (
            <iframe
              src={blobUrl}
              title="Ebook Preview"
              width="100%"
              height="600px"
              className="bg-black"
            />
          ) : (
            <img
              src={blobUrl}
              alt={title}
              style={{ maxHeight: "60vh", background: "#000", width: "100%", objectFit: "contain" }}
            />
          )
        ) : (
          <div className="text-white">Failed to load preview</div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
