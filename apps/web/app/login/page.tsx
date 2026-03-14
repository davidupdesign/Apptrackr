"use client";

import { useState } from "react";
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

  // gives access to the redux store dispatch function
  const dispatch = useDispatch<AppDispatch>();
  // lets me navigate to other pages
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); //to not reload the browser on submit
    setError("");
    setLoading(true);

    try {
      // 1 - call PPOST /auth/login, get the token
      const { data } = await api.post("/auth/login", { email, password });

      // 2 - store the token in redux + localstorage
      dispatch(setToken(data.access_token));

      //3 - fetch user profile w/ the token
      const { data: user } = await api.get("/auth/me");

      //4 - store the user in redux
      dispatch(setUser(user));

      //5 - redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
  
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-black text-text-primary tracking-tight">
            Apptrackr
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to your account
          </p>
        </div>
  
        {/* Card */}
        <div className="bg-surface border border-border rounded p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
  
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-bg border border-border rounded-sm px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
  
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-bg border border-border rounded-sm px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors duration-150"
              />
            </div>
  
            {/* Error */}
            {error && (
              <p className="text-xs text-status-rejected">
                {error}
              </p>
            )}
  
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] rounded-sm text-sm font-semibold tracking-wide cursor-pointer disabled:cursor-not-allowed transition-colors duration-150"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
  
          </form>
        </div>
  
        {/* Register link */}
        <p className="mt-6 text-center text-xs text-text-muted">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-accent font-semibold hover:underline">
            Create one
          </a>
        </p>
  
      </div>
    </div>
  );
}
