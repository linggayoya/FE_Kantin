"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { saveRoleSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Isi dulu ya 😊");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("password", password);

      const res = await fetch("https://ukk-p2.smktelkom-mlg.sch.id/api/login_stan", {
        method: "POST",
        headers: { makerID: "1" },
        body: formData,
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || "Username / password salah 😢";
        alert(msg);
        return;
      }

      if (data?.access_token) {
        saveRoleSession("stand", data);
        router.replace("/admin/dashboard");
        return;
      }

      alert("Login gagal: token tidak ditemukan 😢");
    } catch (err) {
      console.error(err);
      alert("Server error 😭");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-red-500">
      {/* top bar */}
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* slot logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <Image
              src="/image/logo.png" // slot gambar logo
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-white font-semibold tracking-wide">Login Admin</span>
        </div>

        {/* language switch (dummy) */}
        <div className="rounded-xl bg-white/15 px-3 py-2 text-sm text-white backdrop-blur flex items-center gap-2">
          <span className="opacity-90">🌐</span>
          <span className="font-medium">Bahasa Indonesia</span>
          <span className="opacity-80">▾</span>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT (welcome + illustration) */}
          <section className="text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Selamat datang di <br />
              <span className="drop-shadow">Portal Admin</span>
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              Masuk untuk kelola stan & pesanan. Pastikan username & password benar ya 😎
            </p>

            {/* slot illustration */}
            <div className="mt-10">
              <div className="relative w-full max-w-md aspect-[13/10] rounded-3xl bg-white/0 backdrop-blur border border-white/0 overflow-hidden">
                <Image
                  src="/image/esj.png" // slot ilustrasi (ganti kalau mau khusus admin)
                  alt="Ilustrasi Admin"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
            </div>
          </section>

          {/* RIGHT (login card) */}
          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-black/5 overflow-hidden">
              {/* card header */}
              <div className="px-8 pt-10 pb-6">
                <h2 className="text-4xl font-extrabold text-gray-900">Masuk</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Masuk menggunakan <span className="font-medium">username</span> dan{" "}
                  <span className="font-medium">password</span> admin yang terdaftar.
                </p>
              </div>

              {/* form */}
              <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Username</label>
                  <div className="mt-2 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      👤
                    </span>
                    <input
                      type="text"
                      placeholder="Masukkan username admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      autoComplete="username"
                      className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3 text-base outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/15 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="mt-2 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🗝️
                    </span>
                    <input
                      type="password"
                      placeholder="Masukkan password admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3 text-base outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/15 disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-2xl bg-red-500 py-4 text-lg font-extrabold text-white shadow-lg hover:bg-red-600 active:scale-[0.99] transition disabled:opacity-60"
                >
                  {loading ? "Tunggu ya..." : "Lanjut"}
                </button>

                {/* secondary actions */}
                <div className="pt-2 space-y-3">
                  <Link
                    href="/admin/register"
                    className="block w-full text-center rounded-2xl border border-red-200 py-3 font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    Daftar Admin
                  </Link>

                  <button
                    type="button"
                    onClick={() => alert("Login admin dengan benar ya 😄")}
                    className="block w-full text-center py-2 font-semibold text-green-600 hover:underline"
                  >
                    Login dengan Benar Ya !
                  </button>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Dengan masuk, kamu menyetujui{" "}
                    <span className="text-green-700 font-semibold">Ketentuan Penggunaan</span> dan{" "}
                    <span className="text-green-700 font-semibold">Kebijakan Privasi</span>.
                  </p>

                  <button
                    type="button"
                    onClick={() => alert("Butuh bantuan? Hubungi admin sekolah ya 🙂")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      ?
                    </span>
                    Butuh bantuan?
                  </button>
                </div>
              </form>

              {/* footer */}
              <div className="px-8 py-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>© {new Date().getFullYear()} SMK Telkom</span>
                <button
                  type="button"
                  className="font-semibold text-green-700 hover:underline"
                  onClick={() => alert("Pengaturan cookie 🙂")}
                >
                  Pengaturan cookie
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
