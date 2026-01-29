"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/siswa/cart-provider";

const SIDEBAR_BG = "/image/ha.jpeg"; // ✅ sidebar background (taruh di public)
const MAIN_BG = "/image/dw.jpeg"; // ✅ background area kanan (taruh di public)

const navItems = [
  { href: "/siswa/dashboard", label: "Home", icon: "⌂" },
  { href: "/siswa/dashboard/menu", label: "Menu", icon: "𓎩" },
  { href: "/siswa/dashboard/diskon", label: "Diskon", icon: "%" },
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
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("siswa");
    } catch {}
    router.replace("/siswa/login");
  }

  return (
    // ✅ MAIN BG (area ungu) + overlay biar konten kebaca
    <div className="relative min-h-screen overflow-hidden">
      {/* ===== MAIN BACKGROUND IMAGE (KANAN/SELURUH HALAMAN) ===== */}
      <Image
        src={MAIN_BG}
        alt="Main Background"
        fill
        priority
        className="object-cover"
      />
      {/* overlay putih biar UI tetap kebaca */}
      <div className="absolute inset-0 bg-white/" />

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="relative z-10 min-h-screen">
        {/* ===== SIDEBAR (FIXED) ===== */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[280px] z-40 flex-col overflow-hidden border-r border-red-100 shadow-xl">
          {/* ✅ BACKGROUND FOTO SIDEBAR */}
          <div className="absolute inset-0">
            <Image
              src={SIDEBAR_BG}
              alt="Sidebar Background"
              fill
              priority
              className="object-cover"
            />
            {/* overlay biar tulisan tetap kebaca */}
            <div className="absolute inset-0 bg-white/93 backdrop-blur-[px]" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 flex h-full flex-col bg-transparent">
            {/* Brand */}
            <div className="h-16 px-6 flex items-center gap-3 border-b border-red-100">
              <div className="relative h-10 w-10 rounded-2xl bg-red-100 ring-1 ring-red-200 overflow-hidden">
                <Image
                  src="/image/mage.png"
                  alt="Logo"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-extrabold text-red-600">EKama</p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Dashboard Siswa
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                      active
                        ? "bg-red-100/90 text-yellow-600"
                        : "text-slate-700 hover:bg-red-50/80",
                    ].join(" ")}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Cart */}
            <div className="p-4 border-t border-red-100">
              <div className="rounded-2xl bg-white/70 backdrop-blur p-4 ring-1 ring-red-100">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Keranjang</span>
                  <span className="text-red-600">{totalQty} item</span>
                </div>
                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  {formatRupiah(totalPrice)}
                </p>
                <button
                  onClick={open}
                  className="mt-3 w-full rounded-xl bg-red-500 py-2.5 text-sm font-extrabold text-white hover:bg-red-600 transition"
                >
                  Buka Keranjang
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="ml-0 lg:ml-[280px] h-screen flex flex-col">
          {/* HEADER (STICKY) */}
          <header className="sticky top-0 z-30 px-6 py-4">
            <div className="flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-xl px-6 py-4 ring-1 ring-red-100 shadow-lg">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Siswa Panel
                </p>
                <h1 className="text-xl font-extrabold text-slate-900">
                  Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={open}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-red-600 transition"
                >
                  🛒 Keranjang
                  {totalQty > 0 && (
                    <span className="ml-2 rounded-full bg-white/20 px-2 text-xs">
                      {totalQty}
                    </span>
                  )}
                </button>

                {/* SINGLE LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-extrabold text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* CONTENT SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-6 via-red-500 to-rose-4" />

              <Image
                src="/image/rjj.jpeg"
                alt="Promo Banner"
                fill
                className="object-cover opacity-75"
                priority
              />

              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-10 text-white">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold opacity-90">
                    EKama • Kantin Digital
                  </p>
                  <h2 className="mt-2 text-4xl font-extrabold leading-tight">
                    Jajan cepat, <br /> Mudah & Praktis
                  </h2>
                  <p className="mt-3 text-base opacity-90">
                    Pesan makanan favoritmu langsung dari dashboard.
                  </p>
                </div>

                <div className="relative w-full max-w-[360px] shrink-0">
                  <Image
                    src="/image/esj.png"
                    alt="EKama Mascot"
                    width={360}
                    height={240}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </section>

            {/* PAGE CONTENT */}
            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-red-100">
              {children}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
