import React, { useEffect, useState } from "react";

interface CertificatePreviewModalProps {
  open: boolean;
  onClose: () => void;
  certificateId: string;
  mimeType: string; // should always be "application/pdf"
  title: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  open,
  onClose,
  certificateId,
  mimeType,
  title,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let urlObject: string | null = null;
    const fetchCertificate = async () => {
      setLoading(true);
      setBlobUrl(null);
      try {
        const token =
          localStorage.getItem("adminToken") || localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/certificates/${certificateId}/admin-fetch`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch certificate");
        const blob = await res.blob();
        urlObject = URL.createObjectURL(blob);
        setBlobUrl(urlObject);
      } catch (err) {
        setBlobUrl(null);
      }
      setLoading(false);
    };
    fetchCertificate();

    return () => {
      if (urlObject) URL.revokeObjectURL(urlObject);
    };
  }, [open, certificateId]);

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
              title="Certificate Preview"
              width="100%"
              height="600px"
              className="bg-black rounded"
            />
          ) : (
            <div className="text-white">Not a PDF file</div>
          )
        ) : (
          <div className="text-white">Failed to load preview</div>
        )}
      </div>
    </div>
  );
};

export default CertificatePreviewModal;
