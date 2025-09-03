import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import { Link } from "react-router-dom";

interface AdminResponse {
  admin: {
    id: string;
    email: string;
  };
  token: string;
  msg?: string;
}

const AdminLogin: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("adminToken");
    if (token) window.location.href = "/admin/dashboard";
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data: AdminResponse & { msg?: string } = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("adminToken", data.token);

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181818] p-10 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              className="block text-white text-[16px] mb-2"
              htmlFor="email"
            >
              Email*
            </label>
            <input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="text"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#282828] text-white h-[44px] px-4 rounded border-none outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label
              className="block text-white text-[16px] mb-2"
              htmlFor="password"
            >
              Password*
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#282828] text-white h-[44px] px-4 rounded border-none outline-none focus:ring-2 focus:ring-primary pr-12"
                required
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
            {/* Forgot password link */}
            <div className="flex justify-end mt-2">
              <Link
                to="/admin/forgot-password"
                className="text-white underline text-[15px]"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full bg-[#ff3c33] hover:bg-[#e03228] text-white font-semibold text-lg h-[48px] rounded transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
