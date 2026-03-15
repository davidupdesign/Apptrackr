"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "../store/authSlice";
import api from "../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch(setToken(data.access_token));
      const { data: user } = await api.get("/auth/me");
      dispatch(setUser(user));
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-2xl"
        style={{ minHeight: '600px' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
  
        {/* LEFT */}
        <div
          className="hidden lg:flex flex-col justify-between bg-accent"
          style={{ width: '45%', padding: '48px' }}
        >
          <span className="font-display text-base font-black text-[#EFE6DE]">
            Apptrackr
          </span>
  
          <div>
            <h2 className="font-display text-5xl font-black text-[#EFE6DE] leading-[1.1] mb-4">
              Track every<br />opportunity.
            </h2>
            <p className="text-sm text-[#EFE6DE]/60 leading-relaxed">
              From first application to final offer —<br />
              stay on top of your job search.
            </p>
          </div>
  
          <span className="font-mono text-xs text-[#EFE6DE]/30">v1.0</span>
        </div>
  
        {/* RIGHT */}
        <div
          className="flex-1 bg-surface flex items-center justify-center"
          style={{ padding: '48px' }}
        >
          <div className="w-full" style={{ maxWidth: '360px' }}>
  
            {/* Mobile wordmark */}
            <div className="lg:hidden mb-8">
              <span className="font-display text-2xl font-black text-text-primary">
                Apptrackr
              </span>
            </div>
  
            {/* Heading */}
            <div style={{ marginBottom: '32px' }}>
              <h1 className="font-display text-3xl font-black text-text-primary">
                Welcome back
              </h1>
              <p className="text-sm text-text-muted" style={{ marginTop: '8px' }}>
                Sign in to your account
              </p>
            </div>
  
            {/* Form */}
            <form onSubmit={handleSubmit}>
  
              <div style={{ marginBottom: '20px' }}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted" style={{ marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:placeholder:text-transparent focus:outline-none focus:border-accent transition-colors"
                  style={{ padding: '12px 14px' }}
                />
              </div>
  
              <div style={{ marginBottom: '28px' }}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted" style={{ marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:placeholder:text-transparent focus:outline-none focus:border-accent transition-colors"
                  style={{ padding: '12px 14px' }}
                />
              </div>
  
                {/* errors */}
              {error && (
                <p className="text-xs text-status-rejected" style={{ marginBottom: '16px' }}>
                  {error}
                </p>
              )}
  
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] rounded-sm text-sm font-semibold tracking-wide transition-colors cursor-pointer disabled:cursor-not-allowed"
                style={{ padding: '14px' }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
  
            </form>
  
            <p className="text-sm text-text-muted" style={{ marginTop: '24px' }}>
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-accent font-semibold hover:underline">
                Sign Up
              </a>
            </p>
  
          </div>
        </div>
  
      </motion.div>
    </div>
  );
}