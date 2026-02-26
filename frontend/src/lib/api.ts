import { clearToken, getToken, setToken } from "./auth";
import type { Shipment, ShipmentInput, Stats, Status } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("invalid credentials");
  const data = (await res.json()) as { access_token: string };
  setToken(data.access_token);
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "registration failed");
  }
  const data = (await res.json()) as { access_token: string };
  setToken(data.access_token);
}

export function listShipments(opts: { status?: Status; q?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.status) params.set("status", opts.status);
  if (opts.q) params.set("q", opts.q);
  const qs = params.toString();
  return request<Shipment[]>(`/api/shipments${qs ? `?${qs}` : ""}`);
}

export function getShipment(id: number) {
  return request<Shipment>(`/api/shipments/${id}`);
}

export function createShipment(input: ShipmentInput) {
  return request<Shipment>("/api/shipments", { method: "POST", body: JSON.stringify(input) });
}

export function updateShipment(id: number, input: Partial<ShipmentInput>) {
  return request<Shipment>(`/api/shipments/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteShipment(id: number) {
  return request<void>(`/api/shipments/${id}`, { method: "DELETE" });
}

export function getStats() {
  return request<Stats>("/api/shipments/stats");
}
