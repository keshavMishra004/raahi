"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
  //     setError("Please fill out all fields before continuing.");
  //     return;
  //   }
  //   if (form.password !== form.confirmPassword) {
  //     setError("password doesn't match!");
  //     return;
  //   }

  //   setError("");
  //   alert("✅ Account Created Successfully!");
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
    setError("Please fill out all fields before continuing.");
    return;
  }
  if (form.password !== form.confirmPassword) {
    setError("password doesn't match!");
    return;
  }

  // Send signup request to backend
  try {
    const res = await fetch("http://localhost:5100/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Signup failed");
    } else {
      setError("");
      alert("✅ Account Created Successfully!");
      // Optionally redirect or clear form here
    }
  } catch (err) {
    setError("Network error. Please try again.");
  }
};

  const handleGoogleLogin = () => {
    alert("Google login clicked (connect OAuth here)");
  };

  const handleFacebookLogin = () => {
    alert("Facebook login clicked (connect OAuth here)");
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        src="/img/hot-arb.jpg"
        alt="Background"
        fill
        className="object-cover pointer-events-none"
      />

      {/* Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#054972]">
          Create your Free Account
        </h2>

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullname" className="text-gray-700 text-base font-medium">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-[#054972] focus:ring-1 focus:ring-[#054972] outline-none text-base bg-white transition"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-700 text-base font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-[#054972] focus:ring-1 focus:ring-[#054972] outline-none text-base bg-white transition"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-gray-700 text-base font-medium">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:border-[#054972] focus:ring-1 focus:ring-[#054972] outline-none text-base bg-white transition"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y- right-3 flex items-center text-gray-500"
              aria-label="Toggle Password"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="confirmPassword" className="text-gray-700 text-base font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:border-[#054972] focus:ring-1 focus:ring-[#054972] outline-none text-base bg-white transition"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              aria-label="Toggle Confirm Password"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Error box */}
          {error && (
            <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-300 text-sm rounded-md px-3 py-2">
              <span>❗</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#ff6c2d] hover:bg-[#ff5a0a] text-white py-3 rounded-md font-semibold transition text-base shadow"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3 w-full mb-2">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-1/2 border border-gray-300 py-2 rounded-md bg-white hover:bg-gray-100 transition text-base font-medium shadow-sm"
            type="button"
          >
            <Image src="/img/google.png" alt="Google" width={20} height={20} />
            Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2 w-1/2 border border-gray-300 py-2 rounded-md bg-white hover:bg-gray-100 transition text-base font-medium shadow-sm"
            type="button"
          >
            <Image src="/img/facebook.png" alt="Facebook" width={20} height={20} />
            Facebook
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#054972] hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}