"use client";

import api from "@/app/lib/axios";
import { AppDispatch, RootState } from "@/app/store";
import {
  setApplications,
  setError,
  setLoading,
} from "@/app/store/applicationsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// status badge colors
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

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector(
    (state: RootState) => state.applications,
  );

  useEffect(() => {
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
  }, [dispatch]);

  // derive counts from the list
  const counts = {
    SAVED: list.filter((a) => a.status === "SAVED").length,
    APPLIED: list.filter((a) => a.status === "APPLIED").length,
    INTERVIEW: list.filter((a) => a.status === "INTERVIEW").length,
    OFFER: list.filter((a) => a.status === "OFFER").length,
    REJECTED: list.filter((a) => a.status === "REJECTED").length,
  };

  //5 most recetn

  const recent = list.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center juistify-center h-64">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* page header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black text-text-primary">
          Dashboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Your job search at a glance
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-5 gap-4 mb-10">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div
            key={status}
            className="bg-surface border border-border rounded p-5 flex flex-col gap-2"
          >
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${config.color}`}
            >
              {config.label}
            </span>
            <span className="font-display text-3xl font-black text-text-primary">
              {counts[status as keyof typeof counts]}
            </span>
          </div>
        ))}
      </div>

      {/* recent applications */}
      <div>
        <h2 className="font-display text-base font-black text-text-primary mb-4">
          Recent Applications
        </h2>

        {recent.length === 0 ? (
          <div className="bg-surface border border-border rounded p-8 text-center">
            <p className="text-sm text-text-muted">No applications yet.</p>
            <a
              href="/applications/new"
              className="text-sm text-accent font-semibold hover:underline mt-2 inline-block"
            >
              Add your first one
            </a>
          </div>
        ) : (
          <div>
            {recent.map((app, index) => (
              <div
                key={app.id}
                className={`flex items-center justify-between px-6 py-4 ${index !== recent.length - 1 ? "border-b border-border" : ""}`}
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {app.company}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{app.role}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* status badge */}
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm ${
                      statusConfig[app.status].color
                    } ${statusConfig[app.status].bg}`}
                  >
                    {statusConfig[app.status].label}
                  </span>

                  {/* date */}
                  <span className="font-mono textxs text-text-muted">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LAST DIV */}
    </div>
  );
}
