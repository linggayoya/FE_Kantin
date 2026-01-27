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

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2">
        {/* LEFT ORNAMENT (beda dari login/register) */}
        <section className="relative hidden lg:block px-2">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/25 bg-white/10 shadow-2xl backdrop-blur-sm">
            {/* Top stripe */}
            <div className="absolute inset-x-0 top-0 h-16 bg-white/15" />

            {/* Badges */}
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-extrabold text-white">
              🍔 KantinKu
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                Portal
              </span>
            </div>

            <div className="absolute right-6 top-6 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white">
              ⚡ Jajan tanpa antre
            </div>

            {/* Big headline */}
            <div className="px-10 pt-24 text-white">
              <h1 className="text-5xl font-extrabold leading-tight">
                Siap Jajan?
                <br />
                <span className="text-white/90">Klik & Berangkat!</span>
              </h1>
              <p className="mt-4 max-w-md text-base text-white/90">
                Pilih peranmu dulu ya. <b>Siswa</b> buat pesan makanan,
                <b> Admin</b> Buat Stan
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                   Snack
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                   Makan
                </span>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                   Minum
                </span>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative px-10 pb-10 pt-8">
              <div className="relative mx-auto aspect-[16/12] w-full max-w-xl">
                <Image
                  src="/image/mage.png"
                  alt="Kantin Illustration"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Bottom caption */}
              <div className="mt-6 rounded-3xl border border-white/25 bg-white/15 p-6 text-white">
                <p className="text-xl font-extrabold">Biar jajan makin sat-set ✨</p>
                <p className="mt-2 text-sm text-white/90">
                  E kantin Wikusama, solusi Kantin modern Masa Kini
          
                </p>
              </div>
            </div>

            {/* bottom wave */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),transparent)] opacity-90" />
          </div>
        </section>

        {/* RIGHT PORTAL CARD */}
        <section className="flex items-center justify-center lg:justify-end px-2">
          <div className="relative w-full max-w-xl">
            {/* stacked shadow layers */}
            <div className="absolute -inset-2 -z-10 rotate-[-2deg] rounded-[2.9rem] bg-white/18" />
            <div className="absolute -inset-2 -z-10 rotate-[2deg] rounded-[2.9rem] bg-white/10" />

            <div className="rounded-[2.75rem] border border-white/30 bg-white shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-red-500 px-8 py-9 text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:16px_16px]" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      KantinKu • Portal
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold">
                      Mau Masuk Sebagai?
                    </h2>
                    <p className="mt-1 text-sm text-white/90">
                      Pilih role, lanjut jajan 😄
                    </p>
                  </div>

                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/20 ring-1 ring-white/30">
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
              <div className="px-8 pb-10 pt-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Siswa */}
                  <Link
                    href="/siswa/login"
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                  >
                    <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-red-100 opacity-80" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-lg font-extrabold text-white shadow-md">
                        S
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          Siswa
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Pesan cepat, cek status.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-red-600">
                      Masuk <span className="transition group-hover:translate-x-1">→</span>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      🍟 Anti antre
                    </span>
                  </Link>

                  {/* Admin */}
                  <Link
                    href="/admin/login"
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                  >
                    <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-slate-100 opacity-90" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-extrabold text-white shadow-md">
                        A
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          Admin
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Kelola stan & pesanan.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-red-600">
                      Masuk <span className="transition group-hover:translate-x-1">→</span>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      🧾 Dashboard
                    </span>
                  </Link>
                </div>

                {/* Register Box */}
                <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-extrabold text-slate-800">
                    Baru di KantinKu? 😋
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

              {/* Footer */}
              <div className="border-t border-slate-100 bg-white px-8 py-4 text-center text-xs text-slate-500">
                E Kama — jajan modern, sekolah makin keren 🔥
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
