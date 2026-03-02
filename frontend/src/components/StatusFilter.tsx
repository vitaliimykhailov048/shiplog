import type { Status } from "@/lib/types";

const TABS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface Props {
  value: Status | "all";
  onChange: (v: Status | "all") => void;
}

export default function StatusFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
      {TABS.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm transition ${
            value === t.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
