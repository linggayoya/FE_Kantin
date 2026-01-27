"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutRole } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/admin/dashboard/order", label: "Orders", icon: "🗒" },
  { href: "/admin/dashboard/menu", label: "Menu", icon: "𓎩" },
  { href: "/admin/dashboard/diskon-menu", label: "Menu Diskon", icon: "𓎩" },
  { href: "/admin/dashboard/data-siswa", label: "Students", icon: "𐀪 " },
  { href: "/admin/dashboard/diskon", label: "Discounts", icon: "°/•" },
  { href: "/admin/dashboard/profil-stan", label: "Stan Profile", icon: "⾕" },
  { href: "/admin/dashboard/rekap-pemesanan", label: "Rekap Pesanan", icon: "⊞" },
  { href: "/admin/dashboard/rekap-pemasukan", label: "Rekap Pemasukan", icon: "$" },

];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logoutRole("stand");
    router.replace("/admin/login");
  }

  return (
    <div className="relative min-h-screen bg-red-500">
      {/* Background pattern + bubbles */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/10" />
      <div className="pointer-events-none fixed -right-40 top-20 h-[560px] w-[560px] rounded-full bg-white/10" />
      <div className="pointer-events-none fixed -bottom-52 left-1/3 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-white/10" />

      {/* ====== GRID WRAPPER ====== */}
      <div className="relative mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[288px_1fr] lg:gap-8 lg:px-6 lg:py-8">
        {/* ====== SIDEBAR ====== */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-[2.25rem] bg-white p-6 shadow-2xl ring-1 ring-white/40">
            {/* Brand */}
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-red-100 ring-1 ring-red-200">
                <Image
                  src="/image/mage.png"
                  alt="Admin Avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="leading-tight">
                <p className="text-base font-extrabold text-slate-900">E kama</p>
                <p className="text-xs font-semibold text-slate-500">Admin Stan</p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="mt-7 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                      active
                        ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white shadow-md hover:bg-red-600 active:scale-[0.99] transition"
              >
                Logout
              </button>

              <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">
                KantinKu • Admin Stan
              </p>
            </div>
          </div>
        </aside>

        {/* ====== MAIN ====== */}
        <div className="min-w-0 space-y-6">
          {/* TOPBAR (konsisten untuk semua page) */}
          <header className="rounded-[2.25rem] bg-white px-7 py-6 shadow-2xl ring-1 ring-white/40">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">Admin Panel</p>
                <h1 className="mt-1 truncate text-xl font-extrabold text-slate-900">
                  Dashboard Stan
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/dashboard/profil-stan"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  Edit Profil
                </Link>

                {/* Mobile menu button (opsional) */}
                <button
                  type="button"
                  className="rounded-2xl bg-white/20 px-4 py-2 text-sm font-extrabold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 lg:hidden"
                  onClick={() => alert("Kalau mau, aku buatin menu mobile drawer 😄")}
                >
                  Menu
                </button>
              </div>
            </div>

            {/* Mobile chips */}
            <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          {/* CONTENT: jangan dibungkus card putih lagi biar selaras dg page */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
