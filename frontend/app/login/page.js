"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import userApi from "../../utils/userAxios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await userApi.post("/user/login", {
        email: form.email,
        password: form.password,
      });
      // Save token to localStorage
      localStorage.setItem("user_token", res.data.token);
      // Redirect to home/dashboard
      window.location.href = "/";
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      }}
    >
      {/* Glass card */}
      <div className="backdrop-blur-md bg-white/70 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email/Phone number"
              className="w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm flex items-center gap-1">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social login */}
        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-2 w-1/2 border rounded-md py-2 bg-white/80">
            <Image
              src="/img/google.png"
              alt="Google"
              width={20}
              height={20}
              className="inline"
            />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 w-1/2 border rounded-md py-2 bg-white/80">
            <Image
              src="/img/facebook.png"
              alt="Facebook"
              width={20}
              height={20}
              className="inline"
            />
            Facebook
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            SignUp
          </a>
        </p>
      </div>
    </div>
  );
}
