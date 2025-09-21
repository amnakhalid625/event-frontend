import React, { useState } from "react";
import { toast } from "react-hot-toast";
import resetImg from "../assets/images/resetPass.svg";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      // 🔑 Call backend API
      const res = await axios.post("https://event-backend-eu68.vercel.app/api/auth/forgot-password", { email });

      if (res.data.success) {
        toast.success("Password reset link sent to your email!");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-primary bg-opacity-10 flex items-center justify-center p-8">
          <img
            src={resetImg}
            alt="Password Reset"
            className="w-full h-auto max-h-80 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Forgot Password?
          </h2>
          <p className="text-gray-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleReset}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-primary text-white py-3 rounded-lg font-medium transition shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Remember your password?{" "}
            <a href="/login" className="text-black hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
