"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoleSession, getAdminNameFromSession } from "@/lib/auth";

function CardLink({
  title,
  desc,
  href,
  badge,
}: {
  title: string;
  desc: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold text-slate-900">{title}</div>
          <p className="mt-2 text-sm text-slate-500">{desc}</p>
        </div>

        {badge ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-5 text-sm font-extrabold text-red-600 group-hover:underline">
        Buka →
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const session = getRoleSession("stand");
    if (!session?.access_token) {
      router.replace("/admin/login");
      return;
    }
    setAdminName(getAdminNameFromSession(session) || "Admin");
  }, [router]);

  return (
    <div className="space-y-6">
      {/* TOP BAR (sejajar) */}
      <div className="">
  
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       
        </div>
      </div>

      {/* HERO MERAH + SLOT GAMBAR PANJANG */}
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-600 to-rose-600 shadow-2xl">
        {/* pattern */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />

          <div className="relative p-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-extrabold">
                  🍔 KantinKu
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-extrabold">
                    admin
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
                  Dashboard Admin Stan
                </h2>
                <p className="mt-2 text-sm text-white/90 md:text-base">
                  Kelola menu, pelanggan, pesanan, rekap bulanan, dan pengaturan
                  stan kamu dari sini.
                </p>

                {/* Greeting */}
                <div className="mt-6 rounded-[2rem] border border-white/25 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-xs font-extrabold text-white/80">
                    Selamat datang 👋
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">{adminName}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Kelola Pesanan", "Kelola Menu", "Rekap Bulanan"].map(
                      (t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold"
                        >
                          {t}
                        </span>
                      ),
                    )}
                  </div>

                  <Link
                    href="/admin/dashboard/profil-stan"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-extrabold text-red-600 shadow-sm hover:bg-red-50"
                  >
                    Edit Profil Stan →
                  </Link>
                </div>
              </div>

              {/* SLOT GAMBAR PANJANG (portrait-friendly) */}
              <div className="w-full lg:w-[480px]">
                <div className="relative h-[360px] lg:h-[420px] overflow-hidden rounded-[2.25rem] border border-white/20 bg-white/10 shadow-2xl">
                  <Image
                    src="/image/mbak.jpeg" // ganti sesuai path kamu
                    alt="Banner makanan"
                    fill
                    priority
                    className="object-cover object-top"
                  />

                  {/* overlay biar teks tetap kebaca */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

                  {/* badge kecil */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold text-white ring-1 ring-white/30 backdrop-blur">
                    Ekama
                  </div>
                </div>

                <p className="mt-3 text-xs font-semibold text-white/85">
                  Foto portrait / tinggi aman • fokus logo & makanan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS (sejajar) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          "Total Pesanan (bulan ini)",
          "Total Pemasukan (bulan ini)",
          "Jumlah Menu Aktif",
          "Pelanggan Terdaftar",
        ].map((label) => (
          <div key={label} className="rounded-[2rem] bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">—</div>
            <div className="mt-1 text-xs text-slate-400">
              (nanti diisi dari API)
            </div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <div className="pt-2">
        <h2 className="text-xl font-extrabold text-slate-900">
          Menu Pengelolaan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pilih modul yang ingin kamu kelola.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <CardLink
            title="Data Siswa"
            desc="Kelola pelanggan (CRUD) yang terdaftar sebagai siswa."
            href="/admin/dashboard/data-siswa"
            badge="CRUD"
          />
          <CardLink
            title="Data Makanan & Minuman"
            desc="Tambah, ubah, dan hapus menu kantin yang dijual."
            href="/admin/dashboard/menu"
            badge="CRUD"
          />
          <CardLink
            title="Order"
            desc="Kelola pesanan masuk dan ubah status (dimasak/diantar/sampai)."
            href="/admin/dashboard/order"
            badge="Status"
          />
          <CardLink
            title="Rekap Pemesanan per Bulan"
            desc="Lihat semua data pemesanan berdasarkan bulan."
            href="/admin/dashboard/rekap-pemesanan"
            badge="Bulanan"
          />
          <CardLink
            title="Rekap Pemasukan per Bulan"
            desc="Lihat total pemasukan per bulan dari pesanan."
            href="/admin/dashboard/rekap-pemasukan"
            badge="Bulanan"
          />
          <CardLink
            title="Profil Stan"
            desc="Ubah data stan kamu (nama stan, kontak, dll)."
            href="/admin/dashboard/profil-stan"
            badge="Edit"
          />
          <CardLink
            title="Diskon Bulanan"
            desc="Atur diskon berdasarkan bulan/momen tertentu."
            href="/admin/dashboard/diskon"
            badge="Promo"
          />
        </div>
      </div>

      {/* NOTE */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="text-sm font-extrabold text-slate-900">Catatan</div>
        <p className="mt-1 text-sm text-slate-500">
          Halaman ini baru UI. Setelah ini kita lanjut buat halaman
          masing-masing (CRUD, rekap, profil, diskon) dan baru sambungkan ke
          API.
        </p>
      </div>
    </div>
  );
}
