"use client";

import api from "@/app/lib/axios";
import { AppDispatch } from "@/app/store";
import { setToken, setUser } from "@/app/store/authSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      // 1 - register user and gettting back the token
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      dispatch(setToken(data.access_token));

      // 2 - fetch user profile
      const { data: user } = await api.get("/auth/me");
      dispatch(setUser(user));

      //3 -redirecting to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-4xl min-h-[600px] flex rounded-xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-between bg-accent w-[45%] p-12">
          <span className="font-display text-base font-black text-[#EFE6DE]">
            Apptrackr
          </span>

          <div>
            <h2 className="font-display text-5xl font-black text-[#EFE6DE] leading-[1.1] mb-4">
              Start tracking
              <br />
              from day one.
            </h2>
            <p className="text-sm text-[#EFE6DE]/60 leading-relaxed">
              Create your account and take control
              <br />
              of your job search today.
            </p>
          </div>

          <span className="font-mono text-xs text-[#EFE6DE]/30">v1.0</span>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-surface flex items-center justify-center p-12">
          <div className="w-full max-w-[360px]">
            {/* mobil wordmark */}
            <div className="lg:hidden mb-8">
              <span className="font-display text-2xl font-black text-text-primary">
                Apptrackr
              </span>
            </div>

            {/* heading */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-black text-text-primary">
                Create account
              </h1>
              <p className="text-sm text-text-muted mt-2">
                Get started for free
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit}>
              {/* name */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="David K."
                  required
                  className="w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5"
                />
              </div>

              {/* email */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5"
                />
              </div>

              {/* password */}
              <div className="mb-7">
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5"
                />
              </div>

              {/* errors */}
              {error && (
                <p className="text-xs text-status-rejected mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] rounded-sm text-sm font-semibold tracking-wide transition-colors cursor-pointer disabled:cursor-not-allowed py-3.5"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-text-muted mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
