// components/AdminOtpModal.tsx
import React from "react";

const OtpModal = ({ open, onClose, onSubmit, value, onChange, loading, error }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-8 w-[95vw] max-w-[400px] shadow-xl border border-border relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-muted-foreground hover:text-primary"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Enter OTP</h2>
        <p className="text-muted-foreground mb-5 text-center text-[15px]">
          Please enter the 6-digit code sent to your email.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={value}
            onChange={onChange}
            className="w-full bg-muted text-foreground h-[46px] px-4 text-[20px] tracking-widest text-center font-semibold border border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            placeholder="••••••"
            required
          />
          {error && <div className="text-destructive text-[15px] text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[45px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[16px] rounded-lg transition-all duration-150"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
