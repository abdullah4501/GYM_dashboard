import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const ResetPassword = () => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email') || "";
    const [email, setEmail] = useState(emailParam);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Something went wrong");
            setMsg("Password reset successfully! You can now log in.");
            setTimeout(() => {
                navigate("/login");
            }, 1400);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            <section className="w-full py-[90px] h-full flex items-center bg-black">
                <div className="container px-5 mx-auto ">
                    <div className="max-w-lg mx-auto bg-[#232323] rounded-2xl px-9 py-10 shadow-md">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                value={email}
                                disabled
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none text-lg font-medium opacity-80"
                            />
                            <input
                                type="text"
                                required
                                placeholder="OTP (from email)"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                            />
                            <div className="relative">
                                <input
                                    required
                                    placeholder="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="bg-[#333] w-full text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="bg-[#333] w-full text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                            {msg && <div className="text-green-500 text-base">{msg}</div>}
                            {error && <div className="text-red-400 text-base">{error}</div>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ff3c33] hover:bg-[#e03228] text-white font-[700] text-[16px] h-[46px] rounded"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                            <div className="flex justify-end">
                                <Link
                                    to="/login"
                                    className="text-white underline text-[15px] font-semibold"
                                >
                                    Go Back?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ResetPassword;
