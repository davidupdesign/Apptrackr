"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { logout } from "@/app/store/authSlice";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  LogOut,
  Sun,
  Monitor,
  MoonStar,
  Moon,
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { theme, setTheme } = useTheme();
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function closeThemePicker() {
    setIsClosing(true);
    setTimeout(() => {
      setThemePickerOpen(false);
      setIsClosing(false);
    }, 150);
  }

  function handleLogout() {
    dispatch(logout());
    window.location.href = "/login";
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 flex flex-col bg-surface border-r border-border">
      {/* logo */}
      <div className="px-6 pt-8 pb-6">
        <span className="font-display text-lg font-black text-text-primary">
          Apptrackr
        </span>
      </div>

      {/* nav */}
      <nav className="flex flex-col gap-1 px-3">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm border-l-2 transition-colors ${
                isActive
                  ? "text-accent bg-bg border-accent font-semibold"
                  : "text-text-muted border-transparent hover:text-text-primary"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* spaveer */}
      <div className="flex-1" />

      {/* BOTTOM */}
      <div className="px-6 py-6 border-t border-border">
        {/* user info */}
        {user && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-text-primary">
              {user.name}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
          </div>
        )}

        {/* LOGOUT + THEME BUTTON */}
        <div className="flex items-center justify-between">
          {/* logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-status-rejected transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Log out
          </button>

          {/* theme toggle */}
          <div className="relative">
            {themePickerOpen ? (
              // EXPANDED — all three options visible
              <div className={`flex items-center gap-1 bg-bg rounded-sm p-0.5 ${isClosing ? "animate-out fade-out zoom-out-95 duration-150" : "animate-in fade-in zoom-in-90 duration-150"}`}>
                <button
                  onClick={() => {
                    setTheme("light");
                    closeThemePicker();
                  }}
                  title="Light mode"
                  className={`p-1 rounded-sm transition-colors cursor-pointer ${
                    theme === "light"
                      ? "text-accent bg-surface"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Sun size={14} />
                </button>

                <button
                  onClick={() => {
                    setTheme("system");
                    closeThemePicker();
                  }}
                  title="System (auto)"
                  className={`p-1 rounded-sm transition-colors cursor-pointer ${
                    theme === "system"
                      ? "text-accent bg-surface"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Monitor size={14} />
                </button>

                <button
                  onClick={() => {
                    setTheme("dark");
                    closeThemePicker();
                  }}
                  title="Dark mode"
                  className={`p-1 rounded-sm transition-colors cursor-pointer ${
                    theme === "dark"
                      ? "text-accent bg-surface"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Moon size={14} />
                </button>
              </div>
            ) : (
              // COLLAPSED — single button showing the active mode icon
              <button
                onClick={() => setThemePickerOpen(true)}
                title="Change theme"
                className="p-1.5 bg-bg hover:bg-transparent rounded-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {/* show the icon that matches the current theme */}
                {theme === "light" && <Sun size={14} />}
                {theme === "dark" && <Moon size={14} />}
                {theme === "system" && <Monitor size={14} />}
              </button>
            )}
          </div>
        </div>
        {/* last div */}
      </div>
    </aside>
  );
}
