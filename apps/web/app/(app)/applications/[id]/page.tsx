"use client";

import api from "@/app/lib/axios";
import { AppDispatch, RootState } from "@/app/store";
import {
  removeApplication,
  updateApplication,
} from "@/app/store/applicationsSlice";
import {
  ArrowLeft,
  BookmarkX,
  Delete,
  Trash,
  Trash2,
  X,
  CopyX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const statusOptions = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;
type Status = (typeof statusOptions)[number];

const inputClass =
  "w-full bg-bg border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5";

export default function ApplicationDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const params = useParams();
  const id = params.id as string;

  //    if user navigated from the list, its already there — no fetch needed
  //    if they hit the url directly, list will be empty and we fetch from api
  const existing = useSelector((state: RootState) =>
    state.applications.list.find((a) => a.id === id),
  );

  // form field state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("APPLIED");
  const [url, setUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  const [notes, setNotes] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  //   populating the state
  useEffect(() => {
    if (existing) {
      // 1 - already in redux, just populating the form
      setCompany(existing.company);
      setRole(existing.role);
      setStatus(existing.status as Status);
      setUrl(existing.url ?? "");
      setSalary(existing.salary?.toString() ?? "");
      setAppliedAt(
        String(existing.appliedAt ?? new Date().toISOString()).split("T")[0] ?? ""
      );
      setNotes(existing.notes ?? "");
    } else {
      // 2 - not in redux - fetching from api
      async function fetchApplications() {
        try {
          const { data } = await api.get("/applications/${id}");
          setCompany(data.company);
          setRole(data.role);
          setStatus(data.status as Status);
          setUrl(data.url ?? "");
          setSalary(data.salary?.toString() ?? "");
          setAppliedAt(
            data.appliedAt?.split("T")[0] ??
              new Date().toISOString().split("T")[0],
          );
          setNotes(data.notes ?? "");
        } catch {
          // 404  - not found stae
          setNotFound(true);
        }
      }
      fetchApplications();
    }
  }, [id, existing]);

  // SAVE HANDLER
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        company,
        role,
        status,
        appliedAt,
        // only includes optional fields if they have values
        ...(url ? { url } : { url: null }),
        ...(salary ? { salary: parseInt(salary) } : { salary: null }),
        ...(notes ? { notes } : { notes: null }),
      };

      const { data } = await api.patch(`/applications/${id}`, payload);
      // updateApplication finds the item by id in redux and replaces witht the updated version from server. no need for full refetch.
      dispatch(updateApplication(data));
      toast.success("Application updated successfully");
      router.push("/applications");
    } catch {
      setError("Failed to save changes");
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  }

  // DELETE HANDLER
  // confirm action - DELETE /applications/:id - dispatch removeApplication(removes from redux by id) - redirecting back to /applications
  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete the application?, This action cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      await api.delete(`/applications/${id}`);

      //removeApplication filtert the item from the redux list
      dispatch(removeApplication(id));
      toast.success("Application deleted successfully");
      router.push("/applications");
    } catch {
      setError("Failed to delete application");
    } finally {
      setDeleting(false);
    }
  }

  //   NOT FOUND
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm text-text-muted">Application not found.</p>
        <Link
          href="/applications"
          className="text-sm text-accent font-semibold hover:underline"
        >
          Back to applications
        </Link>
      </div>
    );
  }

  //   -----RETURNN------
  return (
    <div className="max-w-2xl p-5">
      {/* header */}
      <div className="mb-8">
        <Link
          href="/applications"
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          Back to applications
        </Link>
        {/*
         * We show the company + role as the page title once loaded.
         * Falls back to "Application" while the form is still populating.
         */}
        <h1 className="font-display text-2xl font-black text-text-primary">
          {company || "Application"}
        </h1>
        {role && <p className="text-sm text-text-muted mt-1">{role}</p>}
      </div>

      {/* FORM CARD */}
      <div className="bg-surface border border-border rounded p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* company */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Company <span className="text-status-rejected">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="ex. Google"
              required
            />
          </div>

          {/* ROLE */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Role <span className="text-status-rejected">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className={inputClass}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* JOB URL */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Job URL{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {/* SALARY */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Salary{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="95000"
              className={inputClass}
            />
          </div>

          {/* applied at */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Date applied
            </label>
            <input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* NOTES */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Notes{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruiter contact, interview notes..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* ERROR */}
          {error && <p className="text-xs text-status-rejected">{error}</p>}

          {/* BUTTONS */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-[#EFE6DE] text-sm font-semibold px-6 py-3 rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
              <Link
                href="/applications"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </Link>
            </div>

            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-status-rejected hover:opacity-70 disabled:opacity-50 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              <CopyX size={14} strokeWidth={2} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </div>

      {/* last div */}
    </div>
  );

  //
}
