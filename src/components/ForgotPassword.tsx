import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMsg("");
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Something went wrong");
            setMsg("OTP sent to your email! Please check your inbox.");
            setTimeout(() => {
                navigate(`/admin/reset-password?email=${encodeURIComponent(email)}`);
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            <section className="w-full py-[90px] h-full bg-black flex items-center">
                <div className="container w-full mx-auto">
                    <div className="max-w-lg mx-auto bg-[#232323] rounded-2xl px-9 py-10 shadow-md">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                            <label className="block text-white text-[18px] font-[600] mb-2">
                                Enter your admin email to reset password:
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Admin email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                            />
                            {msg && <div className="text-green-500 text-base">{msg}</div>}
                            {error && <div className="text-red-400 text-base">{error}</div>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ff3c33] hover:bg-[#e03228] text-white font-[700] text-[16px] h-[46px] rounded"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                            <div className="flex justify-end">
                                <Link
                                    to="/login"
                                    className="text-white underline text-[15px] font-semibold"
                                >
                                    Login?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForgotPassword;
