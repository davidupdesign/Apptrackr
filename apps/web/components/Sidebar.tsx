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
  Settings,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { theme, setTheme } = useTheme();

  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    dispatch(logout());
    window.location.href = "/login";
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <aside className="relative rounded-xl w-60 h-full flex flex-col bg-accent border-r border-border">
      {/* logo */}
      <div className="px-6 pt-8 pb-6">
        <span className="font-display text-lg font-black text-white">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                isActive
                  ? "text-accent bg-white/90 font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
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

      {/* BOTTOm — user section with popup */}
      <div className="px-4 py-4 border-t border-border/40 relative" ref={popupRef}>
        {/* popup — floats above user row */}
        {popupOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-bg border border-border rounded-xl shadow-lg overflow-hidden">
            {/* theme row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Theme
              </span>
              <div className="flex items-center gap-1 bg-bg rounded-sm p-0.5">
                <button
                  onClick={() => setTheme("light")}
                  title="Light"
                  className={`p-1.5 rounded-sm transition-colors cursor-pointer ${theme === "light" ? "text-accent bg-surface" : "text-text-muted hover:text-text-primary"}`}
                >
                  <Sun size={13} />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  title="System"
                  className={`p-1.5 rounded-sm transition-colors cursor-pointer ${theme === "system" ? "text-accent bg-surface" : "text-text-muted hover:text-text-primary"}`}
                >
                  <Monitor size={13} />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  title="Dark"
                  className={`p-1.5 rounded-sm transition-colors cursor-pointer ${theme === "dark" ? "text-accent bg-surface" : "text-text-muted hover:text-text-primary"}`}
                >
                  <Moon size={13} />
                </button>
              </div>
            </div>

            {/* logout row */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-muted hover:text-status-rejected hover:bg-bg transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}

        {/* user row */}
        <button
          onClick={() => setPopupOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 rounded-sm hover:bg-bg/20 hover:rounded-xl px-3 py-2 transition-colors cursor-pointer"
        >
          {/* avatar initial */}
          <div className="w-8 h-8 rounded-full bg-bg border border-white/30 flex items-center justify-center shrink-0">
            <span className="font-display text-xs font-black text-accent">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
          {/* name + email */}
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
          {/* chevron flips when open */}
          <ChevronUp
            size={16}
            strokeWidth={3}
            className={`text-white/80 transition-transform duration-200 shrink-0 ${popupOpen ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>
    </aside>
  );
}
