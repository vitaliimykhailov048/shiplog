import type { Status } from "@/lib/types";

const LABELS: Record<Status, string> = {
  pending: "Pending",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const CLASSES: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  in_transit: "bg-blue-50 text-blue-700 ring-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${CLASSES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
