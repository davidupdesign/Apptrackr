"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { logout } from "@/app/store/authSlice";
import { LayoutDashboard, BriefcaseBusiness, LogOut } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

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

      {/* bottom */}
      <div className="px-6 py-6 border-t border-border">
        {user && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-status-rejected transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>

    </aside>
  );
}