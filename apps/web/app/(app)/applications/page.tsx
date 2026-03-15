"use client";

import api from "@/app/lib/axios";
import { AppDispatch, RootState } from "@/app/store";
import {
  setApplications,
  setError,
  setLoading,
} from "@/app/store/applicationsSlice";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const statusConfig = {
  SAVED: {
    label: "Saved",
    color: "text-status-saved",
    bg: "bg-status-saved/10",
  },
  APPLIED: {
    label: "Applied",
    color: "text-status-applied",
    bg: "bg-status-applied/10",
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-status-interview",
    bg: "bg-status-interview/10",
  },
  OFFER: {
    label: "Offer",
    color: "text-status-offer",
    bg: "bg-status-offer/10",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-status-rejected",
    bg: "bg-status-rejected/10",
  },
};

const tabs = [
  "ALL",
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;
type Tab = (typeof tabs)[number];

export default function ApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector(
    (state: RootState) => state.applications,
  );
  const [activeTab, setActiveTab] = useState<Tab>("ALL");

  useEffect(() => {
    // only fetches if we dont already have data
    if (list.length > 0) return;

    async function fetchApplications() {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get("/applications");
        dispatch(setApplications(data));
      } catch {
        dispatch(setError("Failed to load applications"));
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchApplications();
  }, [dispatch, list.length]);

  // filter the list based on active tab
  const filtered =
    activeTab === "ALL" ? list : list.filter((a) => a.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-black text-text-primary">
            Applications
          </h1>
          <p className="text-sm text-text-muted mt-1">{list.length} total</p>
        </div>

        <Link
          href="/applications/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-[#EFE6DE] text-sm font-semibold px-4 py-2.5 rounded-sm transition-colors"
        >
          <Plus size={15} />
          New Application
        </Link>
      </div>

      {/* filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === tab ? "text-accent border-accent" : "text-text-muted border-transparent hover:text-text-primary"}`}
          >
            {tab === "ALL" ? "All" : statusConfig[tab].label}
          </button>
        ))}
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded p-8 text-center">
          <p className="text-sm text-text-muted">No applications here yet.</p>
          {activeTab === "ALL" && (
            <Link
              href="/applications/new"
              className="text-sm text-accent font-semibold hover:underline mt-2 inline-block"
            >
              Add your first one
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded overflow-hidden">
          {filtered.map((app, index) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className={`flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors ${index !== filtered.length - 1 ? "border-b border-border" : ""}`}
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {app.company}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{app.role}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm ${statusConfig[app.status].color} ${statusConfig[app.status].bg}`}
                >
                  {statusConfig[app.status].label}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {new Date(app.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* LAST DIV */}
    </div>
  );
}
