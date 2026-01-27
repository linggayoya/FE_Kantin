"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRoleSession } from "@/lib/auth";

const cards = [
  {
    title: "Profile",
    desc: "Lihat informasi akun siswa.",
    href: "/siswa/dashboard/profile",
    badge: "Akun",
  },
  {
    title: "Menu",
    desc: "Pilih Makanan/Minuman → Order → Cetak Nota.",
    href: "/siswa/dashboard/menu",
    badge: "Order",
  },
  {
    title: "Diskon",
    desc: "Menu diskon bulanan (slide terpisah). Klik item → Order → Nota.",
    href: "/siswa/dashboard/diskon",
    badge: "Promo",
  },
  {
    title: "Histori",
    desc: "Lihat rekap order bulanan.",
    href: "/siswa/dashboard/histori",
    badge: "Rekap",
  },
];

// slot gambar (sementara hardcode). nanti bisa diganti data dari API/menu
const slots = [
  { title: "Noodle Black Beans", subtitle: "Favorit hari ini", price: "Rp 12.000", tag: "HOT", img: "/image/mage.png" },
  { title: "Japanese Noodles", subtitle: "Pedas mantap", price: "Rp 15.000", tag: "NEW", img: "/image/mage.png" },
  { title: "Indian Noodles", subtitle: "Gurih & legit", price: "Rp 14.000", tag: "BEST", img: "/image/mage.png" },
  { title: "Chicken Chili", subtitle: "Paket hemat", price: "Rp 18.000", tag: "PROMO", img: "/image/mage.png" },
  { title: "Veg Pasta", subtitle: "Sehat & enak", price: "Rp 13.000", tag: "FIT", img: "/image/mage.png" },
  { title: "Cheese Pizza", subtitle: "Cheesy banget", price: "Rp 20.000", tag: "TOP", img: "/image/mage.png" },
  { title: "Soft Drink", subtitle: "Dingin segar", price: "Rp 6.000", tag: "ICE", img: "/image/mage.png" },
  { title: "Dessert", subtitle: "Manisnya pas", price: "Rp 8.000", tag: "SWEET", img: "/image/mage.png" },
];

export default function SiswaDashboardHome() {
  const [nama, setNama] = useState<string>("");

  useEffect(() => {
    // Ambil session yang disimpan saat login:
    // saveRoleSession("siswa", { ...data, username })
    const session = getRoleSession("siswa");
    if (session?.username) setNama(session.username);
    // kalau API kamu punya field lain misal nama_siswa:
    // if (session?.nama_siswa) setNama(session.nama_siswa);
  }, []);

  return (
    <div className="space-y-6">
      {/* HERO + SLOT GAMBAR BESAR */}
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/40 bg-white p-6 shadow-2xl ring-1 ring-white/40">
        {/* dekor */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-100/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-rose-100/60 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600 ring-1 ring-red-100">
              Dashboard • E kama
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-700 ring-1 ring-slate-200">
                
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-black text-slate-900">
              Selamat datang{nama ? `, ${nama}` : ""} <span className="align-middle">👋</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm font-semibold text-slate-500">
              Pilih menu di sidebar atau gunakan shortcut di bawah. Lihat rekomendasi & promo hari ini di slot gambar.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/siswa/dashboard/menu"
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:bg-red-600 active:scale-[0.99] transition"
              >
                Buka Menu
              </Link>
              <Link
                href="/siswa/dashboard/diskon"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-50 active:scale-[0.99] transition"
              >
                Lihat Diskon
              </Link>
            </div>
          </div>

          {/* slot gambar besar */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/mi.jpeg"
              alt="Promo"
              className="h-[220px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold text-white shadow">
                Promo Hari Ini
              </div>
              <div className="mt-2 text-lg font-extrabold text-white">
                Paket Hemat • Makan + Minum
              </div>
              <div className="mt-1 text-xs font-semibold text-white/90">
                Klik Menu untuk lihat detail & pesan.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHORTCUT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white p-5 shadow-2xl ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-100/70 blur-xl opacity-0 transition group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold text-slate-900 group-hover:text-red-600">
                  {c.title}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-500">
                  {c.desc}
                </div>
              </div>

              <div className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 ring-1 ring-red-100">
                {c.badge}
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-slate-700 group-hover:text-red-600">
              Buka <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* SLOT GAMBAR BANYAK */}
      <section className="rounded-[2.25rem] bg-white p-6 shadow-2xl ring-1 ring-white/40">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Display Menu</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Slot gambar untuk rekomendasi & promo (nanti bisa diambil dari data menu).
            </p>
          </div>

          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600 ring-1 ring-red-100">
            {slots.length} slot
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((s, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
                {s.tag && (
                  <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold text-white shadow">
                    {s.tag}
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="text-sm font-extrabold text-slate-900 line-clamp-1">
                  {s.title}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500 line-clamp-1">
                  {s.subtitle}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900">{s.price}</div>

                  <Link
                    href="/siswa/dashboard/menu"
                    className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-200"
                  >
                    Lihat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INFO BANNER */}
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
        "Inovasi tiada henti dari Moklet untuk kemudahan bersama. Ekama , cara baru menikmati jam istirahat."
      </div>
    </div>
  );
}
