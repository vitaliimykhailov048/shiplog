"use client";

import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import ShipmentForm from "@/components/ShipmentForm";
import { createShipment } from "@/lib/api";

export default function NewShipmentPage() {
  const router = useRouter();

  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">New shipment</h1>
          <p className="text-sm text-slate-500">Add a parcel to track.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <ShipmentForm
            submitLabel="Create"
            onSubmit={async (values) => {
              await createShipment(values);
              router.push("/");
            }}
          />
        </div>
      </main>
    </div>
  );
}
