"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import ShipmentForm from "@/components/ShipmentForm";
import { deleteShipment, getShipment, updateShipment } from "@/lib/api";
import type { Shipment } from "@/lib/types";

export default function EditShipmentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    getShipment(id)
      .then(setShipment)
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load"));
  }, [id]);

  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">Edit shipment</h1>
          <p className="text-sm text-slate-500">Update status or details.</p>
        </div>

        {error && (
          <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        )}

        {shipment && (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <ShipmentForm
              initial={shipment}
              submitLabel="Save changes"
              onSubmit={async (values) => {
                await updateShipment(id, values);
                router.push("/");
              }}
              onDelete={async () => {
                await deleteShipment(id);
                router.push("/");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
