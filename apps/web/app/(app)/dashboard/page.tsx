"use client";

import api from "@/app/lib/axios";
import { AppDispatch, RootState } from "@/app/store";
import {
  setApplications,
  setError,
  setLoading,
} from "@/app/store/applicationsSlice";
import StatusBadge from "@/components/StatusBadge";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
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

  const recent = list.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { data } = await api.patch(`/applications/${id}`, {
        status: newStatus,
      });
      // updating only this one application in redux, no refetching
      dispatch(setApplications(list.map((a) => (a.id === id ? data : a))));
    } catch {
      dispatch(setError("Failed to update status"));
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        {/* page header */}
        <div className="mb-8 p-5">
          <h1 className="font-display text-2xl font-black text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Your job search at a glance
          </p>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-5 gap-4 mb-10 pl-5">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-2"
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
        <div className="pl-5">
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
                <Link
                  href={`/applications/${app.id}`}
                  key={app.id}
                  onNavigate={(e) => {
                    const active = document.activeElement;
                    if (active?.tagName === 'SELECT') e.preventDefault();
                  }}
                  className={`flex items-center rounded-lg justify-between px-4 py-4 hover:bg-surface  transition-colors duration-100 cursor-pointer ${index !== recent.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {app.company}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{app.role}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* status badge */}
                    <StatusBadge
                      status={app.status}
                      onChange={(newStatus) =>
                        handleStatusChange(app.id, newStatus)
                      }
                    />

                    {/* date */}
                    <span className="font-mono textxs text-text-muted">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
              {/* <a
                href="/applications"
                className="flex m-5 mt-5 gap-2 items-center justify-end text-sm text-text-muted mt-1 cursor-pointer hover:underline hover:decoration-accent hover:decoration-2 transition-transform hover:underline-offset-4  duration-200 group "
              >
                View All Applications
                <ArrowUpLeft
                  size={16}
                  className="rotate-90 group-hover:rotate-135 group-hover:stroke-3 group-hover:text-accent transition-transform"
                />
              </a> */}

              <Link
                href="/applications"
                className="relative group flex m-5 items-center gap-2 mt-3 text-text-muted text-sm hover:text-accent transition-colors duration-300 w-fit ml-auto"
              >
                View All Applications
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpLeft
                    size={16}
                    className="rotate-90 group-hover:rotate-135 duration-300"
                  />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </div>
          )}
        </div>
        {/* cols-span-2 div */}
      </div>

      {/* ------RIGHT SIDE------ */}

      {/* <div className="col-span-1">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-170">
            <h1 className="font-display text-2xl font-black text-text-primary">
              Right Panel
            </h1>
            <p className="text-sm text-text-muted mt-1">Coming soooooooon</p>
          </div>
        </div>
      </div> */}

      {/* ------RIGHT SIDE------ */}
      <div className="col-span-1 flex flex-col gap-6 pt-32">
        {/* total count */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-display text-base font-black text-text-primary mb-4">
            Total Applications
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total Count</span>
              <span className="font-mono text-xs font-semibold text-text-primary">
                {list.length}
              </span>
            </div>
            <div className="w-full h-px bg-border" />
          </div>
        </div>

        {/* favourites */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h1 className="font-display text-base font-black text-text-primary mb-4">
            Favourites
          </h1>

          {list.filter((a) => a.isFavorite).length === 0 ? (
            <p className="text-xs text-text-muted">
              Star an application to pin it here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {list
                .filter((a) => a.isFavorite)
                .slice(0, 6)
                .map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="bg-bg border border-border rounded-lg p-3 flex flex-col gap-1.5 hover:border-accent transition-colors"
                  >
                    <p className="text-xs font-bold text-text-primary truncate">
                      {app.company}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {app.role}
                    </p>
                    <span
                      className={`text-xs font-semibold uppercase tracking-widest mt-1 ${statusConfig[app.status].color}`}
                    >
                      {statusConfig[app.status].label}
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* stats */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-display text-base font-black text-text-primary mb-4">
            Activity
          </h2>

          {(() => {
            const now = new Date();

            // start of this week (Monday)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1);
            startOfWeek.setHours(0, 0, 0, 0);

            // start of this month
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const thisWeek = list.filter(
              (a) => new Date(a.appliedAt) >= startOfWeek,
            ).length;
            const thisMonth = list.filter(
              (a) => new Date(a.appliedAt) >= startOfMonth,
            ).length;

            return (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">This week</span>
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    {thisWeek} apps
                  </span>
                </div>
                <div className="w-full h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">This month</span>
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    {thisMonth} apps
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* LAST DIV */}
    </div>
  );
}
