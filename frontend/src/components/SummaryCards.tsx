import type { Stats } from "@/lib/types";

interface Props {
  stats: Stats | null;
}

export default function SummaryCards({ stats }: Props) {
  const cards = [
    { label: "Total", value: stats?.total ?? 0 },
    { label: "In transit", value: stats?.in_transit ?? 0 },
    { label: "Delivered", value: stats?.delivered ?? 0 },
    { label: "Pending", value: stats?.pending ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
