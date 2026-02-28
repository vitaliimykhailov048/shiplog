"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function Nav() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          shiplog
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link
            href="/shipments/new"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
          >
            New shipment
          </Link>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-900"
            type="button"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
