"use client";

import api from "@/app/lib/axios";
import { AppDispatch } from "@/app/store";
import { addApplication } from "@/app/store/applicationsSlice";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
  "w-full bg-bg border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors py-3 px-3.5";

export default function NewApplicationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  //   form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("APPLIED"); // sensible default
  const [url, setUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [appliedAt, setAppliedAt] = useState(
    new Date().toISOString().split("T")[0], // defaults to today in YYYY-MM-DD format
  );
  const [notes, setNotes] = useState("");

  // loading/errorstate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //    submit handler
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
        ...(url && { url }),
        ...(salary && { salary: parseInt(salary) }),
        ...(notes && { notes }),
      };

      const { data } = await api.post("/applications", payload);
      dispatch(addApplication(data));
      toast.success("Application added successfully");
      router.push("/applications");
    } catch {
      toast.error("Failed to add an application");
      setError("Failed to add an application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* header */}
      <div className="mb-8">
        <Link
          href="/applications"
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          Back to Applications
        </Link>

        <h1 className="font-display text-2xl font-black text-text-primary">
          New Application
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Track a new job application
        </p>
      </div>

      {/* FORM CARDD */}
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
              placeholder="ex. Apptrackr"
              required
            />
          </div>

          {/* role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Role <span className="text-status-rejected">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
              placeholder="ex. Software Engineer"
              required
            />
          </div>

          {/* status - drppdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
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

          {/* job url */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Job URL{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ex. https://..."
              className={inputClass}
            />
          </div>

          {/* salary */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Salary{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              type="number"
              step={100}
              min={0}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="ex. 95000"
              className={inputClass}
            />
          </div>

          {/* applied at */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Date applied
            </label>
            <input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* notes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Notes{" "}
              <span className="text-text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex. Notes for the interview..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* errors */}
          {error && <p className="text-xs text-status-rejected">{error}</p>}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent-hover text-[#EFE6DE] text-sm font-semibold px-4 py-2"
            >
              {loading ? "Saving..." : "Add Application"}
            </button>
            <Link
              href="/applications"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* last div */}
    </div>
  );
}
