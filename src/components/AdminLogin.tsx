import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";

interface AdminResponse {
  admin: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
  msg?: string;
}

const AdminLogin: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

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
        window.location.href = "/dashboard"; // Update path as needed
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
              htmlFor="username"
            >
              Username*
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
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
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#282828] text-white h-[44px] px-4 rounded border-none outline-none focus:ring-2 focus:ring-primary"
              required
            />
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
