"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api, postForm } from "@/lib/api";

type MenuItem = {
  id_menu?: number;
  id?: number;
  ID?: number;
  Id?: number;
  nama_makanan?: string;
  jenis?: "makanan" | "minuman" | string;
  harga?: string | number;
  deskripsi?: string;
  foto?: string;
  gambar?: string;
  image?: string;
  [key: string]: any;
};

function formatRupiah(value: string | number | undefined) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return String(value ?? "");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getId(item: MenuItem) {
  return item.id_menu ?? item.id ?? item.ID ?? item.Id;
}

function getFotoUrl(item: MenuItem) {
  const url = item.foto || item.gambar || item.image;
  if (!url) return "";

  if (typeof url === "string" && url.startsWith("http")) return url;

  const cleaned = String(url).replace(/^\/+/, "");
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "https://ukk-p2.smktelkom-mlg.sch.id/api/";
  const root = base.replace(/\/api\/?$/, "/");
  return root + cleaned;
}

// ✅ ambil gambar lama dari URL dan ubah jadi File
async function urlToFile(url: string, filename = "foto.jpg") {
  const res = await fetch(url);
  const blob = await res.blob();

  const contentType = blob.type || "image/jpeg";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
    ? "webp"
    : contentType.includes("jpg") || contentType.includes("jpeg")
    ? "jpg"
    : "jpg";

  const finalName = filename.includes(".") ? filename : `${filename}.${ext}`;
  return new File([blob], finalName, { type: contentType });
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // search backend
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // modal/form state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState<"makanan" | "minuman">("makanan");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [existingFotoUrl, setExistingFotoUrl] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchList(search = "") {
    setLoading(true);
    setError("");

    try {
      const res: any = await postForm<any>("showmenu", { search });
      const list = res?.data || res?.result || res || [];
      setItems(Array.isArray(list) ? list : []);
      setActiveSearch(search);
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "Gagal load daftar menu (showmenu).");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setNama("");
    setJenis("makanan");
    setHarga("");
    setDeskripsi("");
    setFoto(null);
    setEditingId(null);
    setExistingFotoUrl("");
  }

  function openCreate() {
    setMode("create");
    resetForm();
    setOpen(true);
  }

  async function openEdit(item: MenuItem) {
    const id = getId(item);
    if (!id) {
      alert("ID menu tidak ditemukan di item ini.");
      return;
    }

    setMode("edit");
    setEditingId(id);
    setOpen(true);

    setNama(String(item.nama_makanan ?? ""));
    setJenis(
      (String(item.jenis ?? "makanan") as any) === "minuman" ? "minuman" : "makanan",
    );
    setHarga(String(item.harga ?? ""));
    setDeskripsi(String(item.deskripsi ?? ""));
    setFoto(null);

    setExistingFotoUrl(getFotoUrl(item));

    try {
      const detail: any = await api<any>(`detail_menu/${id}`, { method: "GET" });
      const d = detail?.data ?? detail;
      if (d) {
        setNama(String(d.nama_makanan ?? item.nama_makanan ?? ""));
        setJenis(
          (String(d.jenis ?? item.jenis ?? "makanan") as any) === "minuman"
            ? "minuman"
            : "makanan",
        );
        setHarga(String(d.harga ?? item.harga ?? ""));
        setDeskripsi(String(d.deskripsi ?? item.deskripsi ?? ""));
        const urlDetail = getFotoUrl(d);
        if (urlDetail) setExistingFotoUrl(urlDetail);
      }
    } catch {
      // ignore
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!nama || !harga || !jenis) {
      alert("Nama, jenis, dan harga wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        if (!foto) {
          alert("Foto wajib diupload untuk tambah menu.");
          return;
        }

        await postForm("tambahmenu", {
          nama_makanan: nama,
          jenis,
          harga,
          deskripsi,
          foto,
        });
        alert("Menu berhasil ditambahkan!");
      } else {
        if (!editingId) {
          alert("ID menu tidak ditemukan.");
          return;
        }

        let fotoToSend: File | undefined = foto ?? undefined;

        if (!fotoToSend && existingFotoUrl) {
          try {
            fotoToSend = await urlToFile(existingFotoUrl, `menu-${editingId}`);
          } catch {
            // ignore
          }
        }

        await postForm(`updatemenu/${editingId}`, {
          nama_makanan: nama,
          jenis,
          harga,
          deskripsi,
          foto: fotoToSend ?? undefined,
        });

        alert("Menu berhasil diupdate!");
      }

      setOpen(false);
      resetForm();
      await fetchList(activeSearch);
    } catch (e: any) {
      alert(`Gagal menyimpan menu: ${e?.message ?? "Unknown error"}`);
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm("Yakin hapus menu ini?");
    if (!ok) return;

    setDeletingId(id);
    try {
      await api(`hapus_menu/${id}`, { method: "DELETE" });
      alert("Menu berhasil dihapus!");
      await fetchList(activeSearch);
    } catch (e: any) {
      alert(`Gagal hapus: ${e?.message ?? "Unknown error"}`);
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="relative overflow-hidden rounded-[2.5rem] bg-red-500 p-5 md:p-7">
      {/* Background pattern like login */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/20" />

      <div className="relative mx-auto max-w-6xl space-y-5">
        {/* HEADER CARD */}
        <div className="rounded-[2rem] bg-white px-6 py-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-extrabold text-red-600">
                🍔 KantinKu • Admin Stan
              </div>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
                Data Makanan & Minuman
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Tambah, edit, hapus menu + upload foto (style login merah).
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full rounded-2xl border-2 border-red-100 bg-white px-4 py-3 text-sm outline-none focus:border-red-300 sm:w-72"
                />
                <button
                  type="button"
                  onClick={() => fetchList(query)}
                  className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-red-600"
                >
                  Cari
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    fetchList("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={openCreate}
                  className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-red-600"
                >
                  + Tambah Menu
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <div className="font-extrabold">Gagal memuat data</div>
              <div className="mt-1">{error}</div>
              <button
                onClick={() => fetchList(activeSearch)}
                className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-rose-700"
              >
                Coba lagi
              </button>
            </div>
          ) : null}
        </div>

        {/* LIST CARD (LOGIN STYLE) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full rounded-[2rem] bg-white p-10 text-center text-slate-600 shadow-2xl">
              Memuat data...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full rounded-[2rem] bg-white p-10 text-center text-slate-600 shadow-2xl">
              Data menu kosong.
            </div>
          ) : (
            items.map((it, idx) => {
              const id = getId(it);
              const fotoUrl = getFotoUrl(it);

              return (
                <div
                  key={id ?? idx}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl transition hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.35)]"
                >
                  {/* FOTO BESAR */}
                  <div className="relative h-52 w-full bg-slate-100">
                    {fotoUrl ? (
                      <Image
                        src={fotoUrl}
                        alt={it.nama_makanan ?? "menu"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                        No Image
                      </div>
                    )}

                    {/* overlay + badge */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900">
                      {String(it.jenis || "-").toUpperCase()}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-end justify-between gap-3">
                        <div className="text-lg font-extrabold text-white drop-shadow">
                          {it.nama_makanan ?? "-"}
                        </div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-red-600 shadow">
                          {formatRupiah(it.harga)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5">
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {it.deskripsi || "—"}
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(it)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={!id || deletingId === id}
                        onClick={() => id && handleDelete(id)}
                        className="rounded-2xl bg-red-500 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        {deletingId === id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER COUNT */}
        <div className="rounded-[2rem] bg-white px-6 py-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-slate-900">Ringkasan</div>
            <div className="text-sm text-slate-600">
              {loading ? "Loading..." : `${items.length} item • search: "${activeSearch || "all"}"`}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-7 py-5">
              <div className="text-xl font-extrabold text-slate-900">
                {mode === "create" ? "Tambah Menu" : "Edit Menu"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Isi data menu. (Style sama kayak card login)
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-7 py-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-extrabold text-slate-700">
                    Nama
                  </label>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="contoh: rujak"
                    className="w-full rounded-2xl border-2 border-red-100 px-4 py-3 text-sm outline-none focus:border-red-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold text-slate-700">
                    Jenis
                  </label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as any)}
                    className="w-full rounded-2xl border-2 border-red-100 px-4 py-3 text-sm outline-none focus:border-red-300"
                  >
                    <option value="makanan">makanan</option>
                    <option value="minuman">minuman</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold text-slate-700">
                    Harga
                  </label>
                  <input
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="contoh: 10000"
                    className="w-full rounded-2xl border-2 border-red-100 px-4 py-3 text-sm outline-none focus:border-red-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold text-slate-700">
                    Foto {mode === "create" ? "(wajib)" : "(opsional)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border-2 border-red-100 px-4 py-2 text-xs text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-red-500 file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-white hover:file:bg-red-600"
                  />
                </div>
              </div>

              {mode === "edit" && existingFotoUrl ? (
                <div>
                  <div className="mb-2 text-xs font-extrabold text-slate-700">
                    Foto Saat Ini
                  </div>
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={existingFotoUrl}
                      alt="foto lama"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Jika tidak upload foto baru, foto ini akan dipakai.
                  </p>
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-xs font-extrabold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="contoh: makanan khas..."
                  className="w-full resize-none rounded-2xl border-2 border-red-100 px-4 py-3 text-sm outline-none focus:border-red-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:bg-red-600 active:scale-[0.99] disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : mode === "create"
                    ? "Tambah Menu"
                    : "Update Menu"}
                </button>
              </div>

              <div className="pb-1 text-[11px] font-semibold text-slate-400">
                Tips: saat edit, kalau tidak upload foto baru, sistem akan mencoba mengirim ulang foto lama.
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
