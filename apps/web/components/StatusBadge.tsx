"use client";

import { useEffect, useRef, useState } from "react";

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

type Status = keyof typeof statusConfig;

interface Props {
  status: Status;

  onChange?: (newStatus: Status) => void;
}

export default function StatusBadge({ status, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statusColorClass: Record<Status, string> = {
    SAVED: "text-status-saved",
    APPLIED: "text-status-applied",
    INTERVIEW: "text-status-interview",
    OFFER: "text-status-offer",
    REJECTED: "text-status-rejected",
  };

  const colorClass = statusColorClass[status];

  return (
    <select
      value={status}
      onChange={(e) => onChange?.(e.target.value as Status)}
      disabled={!onChange}
      className={`bg-bg border border-border uppercase rounded-sm text-xs font-semibold focus:outline-none focus:border-accent transition-colors py-1.5 px-1.5 cursor-pointer ${colorClass} ${statusConfig[status].bg}`}
    >
      {(Object.keys(statusConfig) as Status[]).map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
