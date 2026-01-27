"use client";

import { useEffect, useMemo, useState } from "react";
import { getRoleToken } from "@/lib/auth";

type OrderRow = {
  id_order?: number;
  id?: number;
  ID?: number;

  status?: string;
  created_at?: string;
  tanggal?: string;
  date?: string;

  total?: number | string;
  total_bayar?: number | string;
  grand_total?: number | string;
  subtotal?: number | string;
  total_harga?: number | string;

  nama_siswa?: string;
  siswa?: any;
  user?: any;

  [key: string]: any;
};

const API_BASE = "https://ukk-p2.smktelkom-mlg.sch.id/api/";
const MAKER_ID = "1";

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "/")}${path.replace(/^\/+/, "")}`;
}

async function safeJson(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function requireStandToken() {
  const token = getRoleToken("stand");
  if (!token) throw new Error("Token admin/stan tidak ada. Login admin dulu.");
  return token;
}

function pickOrderId(r: OrderRow) {
  return Number(r.id_order ?? r.id ?? r.ID ?? 0) || null;
}

function pickDate(r: OrderRow) {
  return r.created_at ?? r.tanggal ?? r.date ?? "";
}

function pickStatus(r: OrderRow) {
  return String(r.status ?? "-");
}

function pickSiswa(r: OrderRow) {
  return (
    r.nama_siswa ||
    r?.siswa?.username ||
    r?.siswa?.nama ||
    r?.user?.username ||
    r?.user?.name ||
    "-"
  );
}

function pickTotal(r: OrderRow): number {
  const v =
    r.total ??
    r.total_bayar ??
    r.grand_total ??
    r.subtotal ??
    r.total_harga ??
    0;

  const n = Number(v ?? 0);
  return Number.isNaN(n) ? 0 : n;
}

function formatRupiah(value: string | number | undefined) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return String(value ?? "");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("belum")) return "bg-slate-100 text-slate-700 border-slate-200";
  if (s.includes("dimasak")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("diantar")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (s.includes("sampai") || s.includes("selesai") || s.includes("siap"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";

  return "bg-purple-50 text-purple-700 border-purple-200";
}

function toMonthStart(valueYYYYMM: string) {
  // input month => "2026-01" => endpoint butuh "2026-01-01"
  if (!valueYYYYMM) return "";
  return `${valueYYYYMM}-01`;
}

function pickList(data: any): OrderRow[] {
  const list =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.result) ? data.result :
    Array.isArray(data?.items) ? data.items :
    Array.isArray(data?.payload) ? data.payload :
    [];

  return Array.isArray(list) ? (list as OrderRow[]) : [];
}

async function fetchOrderByMonth(dateYYYYMMDD: string) {
  const token = requireStandToken();

  const res = await fetch(joinUrl(API_BASE, `showorderbymonth/${dateYYYYMMDD}`), {
    method: "GET",
    headers: {
      makerID: MAKER_ID,
      Authorization: `Bearer ${token}`,
    } as any,
  });

  const raw = await res.text();
  const data: any = await safeJson(raw);

  if (!res.ok) {
    throw new Error(data?.message || data?.msg || raw || `HTTP ${res.status}`);
  }

  return pickList(data);
}

export default function RekapPemesananPage() {
  // default: bulan ini
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [month, setMonth] = useState(defaultMonth);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const dateStart = toMonthStart(month);
      const list = await fetchOrderByMonth(dateStart);
      setRows(list);
    } catch (e: any) {
      setRows([]);
      setErr(e?.message || "Gagal memuat rekap pemesanan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const id = String(pickOrderId(r) ?? "");
      const status = pickStatus(r).toLowerCase();
      const siswa = pickSiswa(r).toLowerCase();
      const date = String(pickDate(r)).toLowerCase();
      const total = String(pickTotal(r)).toLowerCase();

      return (
        id.includes(q) ||
        status.includes(q) ||
        siswa.includes(q) ||
        date.includes(q) ||
        total.includes(q)
      );
    });
  }, [rows, search]);

  const stats = useMemo(() => {
    const totalOrder = rows.length;

    let totalOmzet = 0;
    let selesai = 0;
    let proses = 0;

    for (const r of rows) {
      totalOmzet += pickTotal(r);
      const s = pickStatus(r).toLowerCase();
      if (s.includes("sampai") || s.includes("selesai")) selesai++;
      else proses++;
    }

    return { totalOrder, totalOmzet, selesai, proses };
  }, [rows]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#000000_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-red-500/10 blur-[2px]" />
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-red-500/10 blur-[2px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-500/5 blur-[2px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
          {/* Header stripe */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-500 px-8 py-8">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:16px_16px]" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-black">KantinKu • Dashboard</p>
                <h1 className="mt-1 text-3xl font-extrabold text-black">
                  Rekap Pemesanan
                </h1>
                <p className="mt-1 text-sm text-black">
                  Data diambil dari endpoint <b>showorderbymonth</b>.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <label className="text-xs font-extrabold text-black">Pilih Bulan</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:ring-4 focus:ring-white/30 sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 pb-10 pt-6">
            {/* Error */}
            {err ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {err}
                <button
                  type="button"
                  onClick={load}
                  className="ml-3 rounded-xl bg-rose-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-rose-700"
                >
                  Coba Lagi
                </button>
              </div>
            ) : null}

            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Order"
                value={loading ? "..." : String(stats.totalOrder)}
                hint="Jumlah order dalam bulan ini"
              />
              <StatCard
                title="Selesai"
                value={loading ? "..." : String(stats.selesai)}
                hint="Status sampai/selesai"
              />
              <StatCard
                title="Dalam Proses"
                value={loading ? "..." : String(stats.proses)}
                hint="Selain selesai"
              />
              <StatCard
                title="Omzet"
                value={loading ? "..." : formatRupiah(stats.totalOmzet)}
                hint="Ambil dari field total/total_bayar"
              />
            </div>

            {/* Toolbar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-lg">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400">
                  🔎
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID / status / nama siswa / tanggal..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-800 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={load}
                  disabled={loading}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                >
                  {loading ? "Memuat..." : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  disabled={loading}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Daftar Rekap Bulan {month}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Endpoint: showorderbymonth/{toMonthStart(month)}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {loading ? "Memuat..." : `${filtered.length} data`}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-extrabold text-slate-600">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Siswa</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Raw (debug)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="px-6 py-10 text-slate-500" colSpan={6}>
                          Memuat data...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td className="px-6 py-10 text-slate-500" colSpan={6}>
                          Tidak ada data pada bulan ini.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r, idx) => {
                        const id = pickOrderId(r) ?? idx;
                        const status = pickStatus(r);
                        const date = pickDate(r);
                        const total = pickTotal(r);

                        return (
                          <tr key={id} className="border-t border-slate-100">
                            <td className="px-6 py-4 font-extrabold text-slate-900">
                              {id}
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                              {pickSiswa(r)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={[
                                  "inline-flex rounded-full border px-3 py-1 text-xs font-extrabold",
                                  statusBadge(status),
                                ].join(" ")}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {date ? String(date) : "-"}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700">
                              {formatRupiah(total)}
                            </td>

                            <td className="px-6 py-4 text-xs text-slate-500">
                              <details>
                                <summary className="cursor-pointer select-none font-extrabold text-slate-600 hover:text-slate-800">
                                  Lihat
                                </summary>
                                <pre className="mt-2 max-w-[420px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-700">
{JSON.stringify(r, null, 2)}
                                </pre>
                              </details>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
                Kalau omzet masih 0, buka “Raw” lalu sesuaikan fungsi <b>pickTotal()</b> dengan nama field total dari backend kamu.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard(props: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-extrabold text-slate-500">{props.title}</div>
      <div className="mt-2 text-xl font-extrabold text-slate-900">{props.value}</div>
      <div className="mt-1 text-xs text-slate-500">{props.hint}</div>
    </div>
  );
}
