"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginPortalPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-100 px-4">
      {/* Pattern dots */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />

      {/* Decorative bubbles */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/18 blur-[2px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-white/12 blur-[2px]" />
      <div className="pointer-events-none absolute -bottom-44 left-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/10 blur-[2px]" />

      {/* ✅ dua kartu sama ukuran + center */}
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 place-items-center gap-8 py-12 lg:grid-cols-2">
        {/* ================================= LEFT CARD (SAMA UKURAN) ================================= */}
        <section className="w-full max-w-[520px] px-2">
          <div className="flex min-h-[640px] flex-col overflow-hidden rounded-[2.25rem] border border-white/25 bg-white/10 shadow-2xl backdrop-blur-sm">
            {/* header kecil */}
            <div className="relative px-7 pt-7 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-extrabold">
                  E kama
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                    Portal
                  </span>
                </div>

                <div className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold">
                  ⚡ Jajan tanpa antre
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight">
                Siap Jajan?
                <br />
                <span className="text-white/90">Klik &amp; Berangkat!</span>
              </h1>

              <p className="mt-3 text-sm text-white/90">
                Pilih peranmu dulu ya. <b>Siswa</b> buat pesan makanan,{" "}
                <b>Admin</b> buat stan.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">
                  Snack
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">
                  Makan
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">
                  Minum
                </span>
              </div>
            </div>

            {/* isi tengah: gambar */}
            <div className="flex flex-1 items-center justify-center px-7 py-6">
              <div className="relative h-[260px] w-full max-w-[360px]">
                <Image
                  src="/image/mage.png"
                  alt="Kantin Illustration"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* footer caption (nempel bawah) */}
            <div className="px-7 pb-7">
              <div className="rounded-3xl border border-white/25 bg-white/15 p-5 text-white">
                <p className="text-lg font-extrabold">
                  Biar jajan makin sat-set ✨
                </p>
                <p className="mt-1.5 text-xs text-white/90">
                  E kantin Wikusama, solusi kantin modern masa kini.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= RIGHT CARD (SAMA UKURAN) ================================= */}
        <section className="w-full max-w-[520px] px-2">
          <div className="flex min-h-[640px] flex-col overflow-hidden rounded-[2.25rem] border border-white/30 bg-white shadow-2xl">
            {/* Header */}
            <div className="relative bg-red-500 px-7 py-7 text-white">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:16px_16px]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-white/90">
                    E kama • Portal
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold leading-tight">
                    Mau Masuk Sebagai?
                  </h2>
                  <p className="mt-1 text-xs text-white/90">Pilih role Anda</p>
                </div>

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-1 ring-white/30">
                  <Image
                    src="/image/mage.png"
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-7 pb-7 pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Siswa */}
                <Link
                  href="/siswa/login"
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-100 opacity-80" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500 text-base font-extrabold text-white shadow-md">
                      S
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900">
                        Siswa
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Pesan cepat, cek status.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-red-600">
                    Masuk{" "}
                  </div>
                </Link>

                {/* Admin */}
                <Link
                  href="/admin/login"
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-100 opacity-90" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-base font-extrabold text-white shadow-md">
                      A
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900">
                        Admin
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Kelola stan &amp; pesanan.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-red-600">
                    Masuk{" "}
                  </div>
                  {}
                </Link>
              </div>

              {/* Register Box */}
              <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-extrabold text-slate-800">
                  Baru di E kama?
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Daftar dulu biar bisa jajan lebih sat-set!
                </p>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/siswa/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white shadow-md hover:bg-red-600 active:scale-95 transition"
                  >
                    Daftar Siswa
                  </Link>
                  <Link
                    href="/admin/register"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-red-200 bg-white px-4 py-3 text-sm font-extrabold text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50 active:scale-95 transition"
                  >
                    Daftar Admin
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer nempel bawah */}
            <div className="mt-auto border-t border-slate-100 bg-white px-7 py-4 text-center text-xs text-slate-500">
              E Kama — jajan modern, sekolah makin keren 🔥
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
