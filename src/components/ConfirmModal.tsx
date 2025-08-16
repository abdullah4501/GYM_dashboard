import React from "react";

const ConfirmModal = ({ open, onClose, onConfirm, title = "Are you sure?", description }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#232323] rounded-xl p-8 shadow-2xl max-w-[450px] w-full flex flex-col items-center">
        <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-[#ccc] text-base mb-6 text-center">{description}</p>
        )}
        <div className="flex gap-3 w-full justify-center">
          <button
            className="bg-[#ff3c33] hover:bg-[#e03228] text-white px-7 py-2 rounded font-semibold transition-all duration-150"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="bg-[#2E2E2E] hover:bg-[#444] text-[#fff] px-7 py-2 rounded font-semibold transition-all duration-150"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
