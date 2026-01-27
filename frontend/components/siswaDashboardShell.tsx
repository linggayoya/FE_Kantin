"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/siswa/cart-provider";

// kalau kamu punya auth util seperti admin, aktifkan:
// import { logoutRole } from "@/lib/auth";

const navItems = [
  { href: "/siswa/dashboard", label: "Home", icon: "⌂" },
  { href: "/siswa/dashboard/menu", label: "Menu", icon: "𓎩" },
  { href: "/siswa/dashboard/diskon", label: "Diskon", icon: "°/•" },
  { href: "/siswa/dashboard/pesanan", label: "Keranjang", icon: "🛒" },
  { href: "/siswa/dashboard/histori", label: "Histori", icon: "🗒" },
  { href: "/siswa/dashboard/profile", label: "Akun", icon: "👤" },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SiswaDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { open, totalQty, totalPrice } = useCart();

  const activeHref = useMemo(() => {
    const exact = navItems.find((n) => n.href === pathname)?.href;
    if (exact) return exact;

    const nested = navItems
      .filter((n) => n.href !== "/siswa/dashboard")
      .find((n) => pathname.startsWith(n.href));

    return nested?.href ?? "/siswa/dashboard";
  }, [pathname]);

  function handleLogout() {
    // opsi 1: kalau ada helper seperti admin:
    // logoutRole("siswa");

    // opsi 2: minimal clear storage/cookie yang kamu pakai
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("siswa");
    } catch {}

    router.replace("/siswa/login");
  }

  return (
    <div className="relative min-h-screen bg-red-500">
      {/* Background pattern + bubbles */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/10" />
      <div className="pointer-events-none fixed -right-40 top-20 h-[560px] w-[560px] rounded-full bg-white/10" />
      <div className="pointer-events-none fixed -bottom-52 left-1/3 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-white/10" />

      {/* GRID WRAPPER */}
      <div className="relative mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[288px_1fr] lg:gap-8 lg:px-6 lg:py-8">
        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-[2.25rem] bg-white p-6 shadow-2xl ring-1 ring-white/40">
            {/* Brand */}
            <Link href="/siswa/dashboard" className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white ring-1 ring-red-200">
                <Image
                  src="/image/mage.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="leading-tight">
                <p className="text-base font-extrabold text-slate-900">E kama</p>
                <p className="text-xs font-semibold text-slate-500">
                  Dashboard Siswa
                </p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="mt-7 space-y-1">
              {navItems.map((item) => {
                const active = item.href === activeHref;
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

            {/* Cart element */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500">Keranjang</div>
                <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600">
                  {totalQty} item
                </div>
              </div>

              <div className="mt-2 text-lg font-extrabold text-slate-900">
                {formatRupiah(totalPrice)}
              </div>

              <button
                type="button"
                onClick={open}
                className="mt-3 w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white shadow-md hover:bg-red-600 active:scale-[0.99] transition disabled:opacity-60"
              >
                Buka Keranjang
              </button>
            </div>

            {/* Logout */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white shadow-md hover:bg-slate-800 active:scale-[0.99] transition"
              >
                Logout
              </button>

              <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">
                KantinKu • Dashboard Siswa
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="min-w-0 space-y-6">
          {/* TOPBAR */}
          <header className="rounded-[2.25rem] bg-white px-7 py-6 shadow-2xl ring-1 ring-white/40">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">Siswa Panel</p>
                <h1 className="mt-1 truncate text-xl font-extrabold text-slate-900">
                  Dashboard Siswa
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={open}
                  className="relative rounded-2xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-600"
                >
                  Keranjang
                  {totalQty > 0 && (
                    <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-black">
                      {totalQty}
                    </span>
                  )}
                </button>

                {/* Logout versi mobile (karena sidebar hidden) */}
                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile chips */}
            <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-extrabold",
                    item.href === activeHref
                      ? "bg-red-500 text-white"
                      : "bg-red-50 text-red-600",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          {/* CONTENT */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
