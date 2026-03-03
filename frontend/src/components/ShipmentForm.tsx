"use client";

import { useState } from "react";
import type { ShipmentInput, Status } from "@/lib/types";

const STATUSES: { value: Status; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface Props {
  initial?: Partial<ShipmentInput>;
  submitLabel?: string;
  onSubmit: (values: ShipmentInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function toLocalDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ShipmentForm({ initial, submitLabel = "Save", onSubmit, onDelete }: Props) {
  const [form, setForm] = useState<ShipmentInput>({
    tracking_number: initial?.tracking_number ?? "",
    carrier: initial?.carrier ?? "",
    origin: initial?.origin ?? "",
    destination: initial?.destination ?? "",
    status: initial?.status ?? "pending",
    eta: initial?.eta ?? null,
    notes: initial?.notes ?? null,
  });
  const [etaInput, setEtaInput] = useState(toLocalDateTime(initial?.eta));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ShipmentInput>(key: K, value: ShipmentInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const payload: ShipmentInput = {
        ...form,
        eta: etaInput ? new Date(etaInput).toISOString() : null,
        notes: form.notes?.trim() ? form.notes : null,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tracking number">
          <input
            required
            minLength={3}
            value={form.tracking_number}
            onChange={(e) => update("tracking_number", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Carrier">
          <input
            required
            value={form.carrier}
            onChange={(e) => update("carrier", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Origin">
          <input
            required
            value={form.origin}
            onChange={(e) => update("origin", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Destination">
          <input
            required
            value={form.destination}
            onChange={(e) => update("destination", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as Status)}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ETA">
          <input
            type="datetime-local"
            value={etaInput}
            onChange={(e) => setEtaInput(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={3}
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {error && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "Saving..." : submitLabel}
          </button>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this shipment?")) return;
              await onDelete();
            }}
            className="text-sm text-rose-600 hover:text-rose-700"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
