"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import ShipmentCard from "@/components/ShipmentCard";
import StatusFilter from "@/components/StatusFilter";
import SummaryCards from "@/components/SummaryCards";
import { getStats, listShipments } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Shipment, Stats, Status } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [status, setStatus] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([
      listShipments({ status: status === "all" ? undefined : status, q: query || undefined }),
      getStats(),
    ])
      .then(([list, s]) => {
        if (!active) return;
        setShipments(list);
        setStats(s);
        setError(null);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "failed to load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [status, query, router]);

  const empty = useMemo(() => !loading && shipments.length === 0, [loading, shipments.length]);

  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Shipments</h1>
            <p className="text-sm text-slate-500">Track parcels and update statuses.</p>
          </div>
        </div>

        <SummaryCards stats={stats} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilter value={status} onChange={setStatus} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracking, city..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm sm:w-72"
          />
        </div>

        <div className="mt-4">
          {error && (
            <div className="mb-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          )}
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">Loading...</div>
          ) : empty ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white py-10 text-center">
              <p className="text-sm text-slate-500">No shipments yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {shipments.map((s) => (
                <ShipmentCard key={s.id} shipment={s} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
