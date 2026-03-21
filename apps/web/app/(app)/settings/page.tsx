"use client";

import { useTheme } from "@/app/hooks/useTheme";
import api from "@/app/lib/axios";
import { AppDispatch, RootState } from "@/app/store";
import { logout, setUser } from "@/app/store/authSlice";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// ─── section wrapper ───────────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-10 mb-10 last:border-0 last:mb-0 last:pb-0">
      <div className="mb-6">
        <h2 className="font-display text-base font-black text-text-primary">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── input ─────────────────────────────────────────────────────────
const inputClass =
  "w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5";

// ─── page ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const applications = useSelector(
    (state: RootState) => state.applications.list,
  );

  // account form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // populate from redux on mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // ── save profile (name + email) ──
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.patch("/auth/me", { name, email });
      dispatch(setUser(data));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  // ── save password ──
  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword) return;
    setSavingPassword(true);
    try {
      await api.patch("/auth/me", { currentPassword, password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  // ── delete account ──
  async function handleDeleteAccount() {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This will permanently delete all your applications and cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await api.delete("/auth/me");
      dispatch(logout());
      router.push("/login");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  }

  // ── logout ──
  function handleLogout() {
    dispatch(logout());
    router.push("/login");
  }

  // ── stats from redux ──
  const stats = {
    SAVED: applications.filter((a) => a.status === "SAVED").length,
    APPLIED: applications.filter((a) => a.status === "APPLIED").length,
    INTERVIEW: applications.filter((a) => a.status === "INTERVIEW").length,
    OFFER: applications.filter((a) => a.status === "OFFER").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const statusColors: Record<string, string> = {
    SAVED: "text-status-saved",
    APPLIED: "text-status-applied",
    INTERVIEW: "text-status-interview",
    OFFER: "text-status-offer",
    REJECTED: "text-status-rejected",
  };

  //   theme picker
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl p-5">
      {/* page header */}
      <div className="mb-10">
        <h1 className="font-display text-2xl font-black text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* ── SECTION 1: ACCOUNT ── */}
      <Section title="Account" description="Update your personal information">
        {/* avatar placeholder */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-border flex items-center justify-center">
            <span className="font-display text-xl font-black text-accent">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {user?.name}
            </p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>
        </div>

        {/* profile form */}
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] text-sm font-semibold px-6 py-3 rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        {/* divider */}
        <div className="border-t border-border my-8" />

        {/* password form */}
        <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-text-primary">
            Change password
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] text-sm font-semibold px-6 py-3 rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </Section>

      {/* ── SECTION 2: APPEARANCE ── */}
      <Section title="Appearance" description="Customize how Apptrackr looks">
        {/* theme toggle */}
        <div className="relative -py-1">
          <div className="flex items-center gap-1 bg-bg rounded-sm">
            <button
              onClick={() => {
                setTheme("light");
              }}
              title="Light mode"
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                theme === "light"
                  ? "text-accent bg-surface"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Sun size={20} />
            </button>

            <button
              onClick={() => {
                setTheme("system");
              }}
              title="System (auto)"
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                theme === "system"
                  ? "text-accent bg-surface"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Monitor size={20} />
            </button>

            <button
              onClick={() => {
                setTheme("dark");
              }}
              title="Dark mode"
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                theme === "dark"
                  ? "text-accent bg-surface"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Moon size={20} />
            </button>
          </div>
        </div>
      </Section>

      {/* ── SECTION 3: STATS ── */}
      <Section title="Stats" description="Your job search at a glance">
        <div className="flex flex-col gap-4">
          {/* account created */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-text-muted">Member since</span>
            <span className="font-mono text-sm text-text-primary">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>

          {/* total */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-text-muted">Total applications</span>
            <span className="font-display text-sm font-black text-text-primary">
              {applications.length}
            </span>
          </div>

          {/* per status */}
          {Object.entries(stats).map(([status, count]) => (
            <div
              key={status}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <span className={`text-sm font-semibold ${statusColors[status]}`}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </span>
              <span className="font-display text-sm font-black text-text-primary">
                {count}
              </span>
            </div>
          ))}
        </div>
        {/* divider */}
        <div className="border-t border-border my-8" />
        {/* delete account */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Delete account
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Permanently delete your account and all your applications. This
            cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-status-rejected hover:opacity-80 text-white text-sm font-semibold px-6 py-3 rounded-sm transition-opacity cursor-pointer"
          >
            Delete account
          </button>
        </div>
      </Section>

      {/* ── LOGOUT ── */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-status-rejected transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </div>
  );
}
