import React, { useEffect, useState } from "react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string; // <-- Accept videoId not url!
  title: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const VideoModal: React.FC<VideoModalProps> = ({
  open,
  onClose,
  videoId,
  title,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open || !videoId) return;
    setVideoSrc(""); setError("");
    const fetchSignedUrl = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
          setError("No admin token found, please login.");
          return;
        }
        const res = await fetch(
          `${API_URL}/workout-library/signed-url/${videoId}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get signed URL");
        setVideoSrc(data.signedUrl); // This is the URL with token param
      } catch (err: any) {
        setError(err.message || "Failed to load video.");
      }
    };
    fetchSignedUrl();
  }, [open, videoId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 shadow-2xl max-w-[650px] w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-primary"
        >
          ×
        </button>
        <h3 className="text-white text-lg mb-3">{title}</h3>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <video
            src={videoSrc}
            controls
            autoPlay
            className="w-full"
            style={{ maxHeight: "60vh", background: "#000" }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoModal;
