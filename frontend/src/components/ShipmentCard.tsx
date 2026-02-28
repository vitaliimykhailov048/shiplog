import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { Shipment } from "@/lib/types";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Link
      href={`/shipments/${shipment.id}/edit`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-900">{shipment.tracking_number}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-sm text-slate-600">{shipment.carrier}</span>
          </div>
          <div className="mt-1 truncate text-sm text-slate-600">
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>ETA: {formatDate(shipment.eta)}</span>
        <span>Updated {formatDate(shipment.updated_at)}</span>
      </div>
    </Link>
  );
}
