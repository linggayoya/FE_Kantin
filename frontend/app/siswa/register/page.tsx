"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function RegisterSiswaPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [namaSiswa, setNamaSiswa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [notice, setNotice] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // preview foto (thumbnail)
  useEffect(() => {
    if (!foto) {
      setFotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(foto);
    setFotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const fotoLabel = useMemo(() => {
    if (!foto) return "Belum ada foto dipilih";
    return `${foto.name} • ${Math.ceil(foto.size / 1024)} KB`;
  }, [foto]);

  function openFilePicker() {
    fileRef.current?.click();
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(null);

    if (!namaSiswa || !alamat || !telp || !username || !password) {
      setNotice({ type: "error", text: "Semua field wajib diisi." });
      return;
    }

    if (!foto) {
      setNotice({ type: "error", text: "Foto wajib diupload." });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nama_siswa", namaSiswa);
      formData.append("alamat", alamat);
      formData.append("telp", telp);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("foto", foto); // key harus "foto"

      const res = await fetch(
        "https://ukk-p2.smktelkom-mlg.sch.id/api/register_siswa",
        {
          method: "POST",
          headers: { makerID: "1" },
          body: formData,
        }
      );

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }

      const isSuccess =
        res.ok &&
        (data?.status === true ||
          data?.success === true ||
          data?.code === 200 ||
          data?.message?.toLowerCase?.().includes("berhasil") ||
          data?.msg?.toLowerCase?.().includes("berhasil") ||
          (typeof data === "object" && data !== null));

      if (isSuccess) {
        setNotice({ type: "success", text: "Register berhasil! Mengarahkan..." });
        router.push("/siswa/login");
      } else {
        setNotice({ type: "error", text: "Register gagal! Coba lagi ya." });
        console.log("Register siswa gagal response:", data);
      }
    } catch (err) {
      setNotice({
        type: "error",
        text: "Register gagal! (Network / CORS / Server error)",
      });
      console.error("Error register siswa:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-red-500">
      {/* Pattern dots */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />

      {/* Big bubbles */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-[2px]" />
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-white/15 blur-[2px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-[2px]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2">
        {/* LEFT ORNAMENT PANEL */}
        <section className="relative hidden lg:block">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 shadow-2xl backdrop-blur-sm">
            {/* Header stripe */}
            <div className="absolute inset-x-0 top-0 h-16 bg-white/15" />

            {/* Floating badges */}
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              🍔 Ekama
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                siswa
              </span>
            </div>

            <div className="absolute right-6 top-6 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              🧾 Daftar Siswa
            </div>

            {/* Illustration */}
            <div className="relative px-10 pb-10 pt-24">
              <div className="relative mx-auto aspect-[16/12] w-full max-w-xl">
                <Image
                  src="/image/mage.png"
                  alt="Ekama"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Caption card */}
              <div className="mt-6 rounded-3xl border border-white/25 bg-white/15 p-6 text-white">
                <p className="text-xl font-extrabold">Buat akun siswa ✨</p>
                <p className="mt-2 text-sm text-white/90">
                  Setelah daftar, kamu bisa belanja, tambah keranjang, dan cek
                  riwayat transaksi.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                    🛒 Keranjang
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                    🍱 Menu
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                    🧾 Riwayat
                  </span>
                </div>
              </div>
            </div>

            {/* bottom wave */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[radial-gradient(closest-side,rgba(255,255,255,0.22),transparent)] opacity-90" />
          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-xl">
            {/* stacked cards */}
            <div className="absolute -inset-2 -z-10 rotate-[-2deg] rounded-[2.75rem] bg-white/20" />
            <div className="absolute -inset-2 -z-10 rotate-[2deg] rounded-[2.75rem] bg-white/10" />

            <div className="rounded-[2.5rem] border border-white/25 bg-white shadow-2xl">
              {/* Top header */}
              <div className="relative overflow-hidden rounded-t-[2.5rem] bg-red-500 px-8 py-8 text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:16px_16px]" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      Ekama• Register
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold">
                      Daftar Akun Siswa
                    </h1>
                    <p className="mt-1 text-sm text-white/90">
                      Isi data kamu dengan benar ya 😄
                    </p>
                  </div>

                  {/* mini logo */}
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/20 ring-1 ring-white/25">
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
              <div className="px-8 pb-10 pt-6">
                {/* Notice */}
                {notice && (
                  <div
                    className={[
                      "mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold",
                      notice.type === "success" &&
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                      notice.type === "error" &&
                        "border-rose-200 bg-rose-50 text-rose-700",
                      notice.type === "info" &&
                        "border-slate-200 bg-slate-50 text-slate-700",
                    ].join(" ")}
                  >
                    {notice.text}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Nama Siswa"
                      placeholder="contoh: Andi"
                      value={namaSiswa}
                      onChange={setNamaSiswa}
                      icon="🧑‍🎓"
                    />
                    <Field
                      label="No. Telepon"
                      placeholder="08xxxxxxxxxx"
                      value={telp}
                      onChange={setTelp}
                      icon="📞"
                      type="tel"
                    />
                  </div>

                  <Field
                    label="Alamat"
                    placeholder="contoh: Jl. Mawar No. 10"
                    value={alamat}
                    onChange={setAlamat}
                    icon="📍"
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Username"
                      placeholder="buat username"
                      value={username}
                      onChange={setUsername}
                      icon="🪪"
                    />
                    <Field
                      label="Password"
                      placeholder="buat password"
                      value={password}
                      onChange={setPassword}
                      icon="🔒"
                      type="password"
                    />
                  </div>

                  {/* Upload Foto (preview + tombol ganti saja) */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700">
                      Foto Siswa
                    </label>

                    {/* hidden input */}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                    />

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-red-50 ring-1 ring-red-100">
                            {fotoPreview ? (
                              <Image
                                src={fotoPreview}
                                alt="Preview foto"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-red-400">
                                🖼️
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-slate-800">
                              {foto ? "Foto dipilih" : "Upload foto"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {fotoLabel}
                            </p>
                          </div>
                        </div>

                        {/* tombol ganti/pilih */}
                        <button
                          type="button"
                          onClick={openFilePicker}
                          className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-600"
                        >
                          {foto ? "Ganti" : "Pilih Foto"}
                        </button>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        Format: JPG / PNG / WebP
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-3xl bg-red-500 py-4 text-lg font-extrabold text-white shadow-xl hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 opacity-0 blur-2xl transition group-hover:opacity-100 bg-white/30" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Daftar Sekarang <span className="text-white/90">→</span>
                        </>
                      )}
                    </span>
                  </button>

                  <p className="pt-2 text-center text-sm text-slate-600">
                    Sudah punya akun?{" "}
                    <Link
                      href="/siswa/login"
                      className="font-extrabold text-red-500 hover:underline"
                    >
                      Login di sini
                    </Link>
                  </p>
                </form>
              </div>

              {/* Bottom footer */}
              <div className="rounded-b-[2.5rem] border-t border-slate-100 bg-white px-8 py-4 text-center text-xs text-slate-500">
                Dengan daftar, kamu setuju untuk menggunakan aplikasi Ekama
                dengan baik 😊
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-extrabold text-slate-700">
        {props.label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400">
          {props.icon}
        </span>
        <input
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-800 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
        />
      </div>
    </div>
  );
}
