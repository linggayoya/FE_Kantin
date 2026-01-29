"use client";

import { useEffect, useMemo, useState } from "react";
import { getRoleToken } from "@/lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ukk-p2.smktelkom-mlg.sch.id/api/";
const MAKER_ID = process.env.NEXT_PUBLIC_MAKER_ID ?? "1";

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

type OrderRow = {
  id_order?: number;
  id?: number;

  status?: string;
  nama_makanan?: string;
  jumlah?: number | string;
  harga?: number | string;
  total?: number | string;

  nama_stan?: string;
  nama_kantin?: string;

  created_at?: string;
  tanggal?: string;

  [key: string]: any;
};

function pickId(r: OrderRow) {
  return r.id_order ?? r.id ?? (r as any).ID ?? null;
}

function pickDate(r: OrderRow) {
  return r.created_at ?? r.tanggal ?? (r as any).date ?? "";
}

function pickStan(r: OrderRow) {
  return r.nama_stan || r.nama_kantin || (r as any).stan || "-";
}

function formatRupiah(value: any) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return String(value ?? "");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function statusMeta(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("belum"))
    return {
      label: status || "Belum Konfirmasi",
      cls: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
      dot: "bg-slate-400",
    };

  if (s.includes("dimasak"))
    return {
      label: status || "Dimasak",
      cls: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
      dot: "bg-amber-500",
    };

  if (s.includes("diantar"))
    return {
      label: status || "Diantar",
      cls: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
      dot: "bg-sky-500",
    };

  if (s.includes("sampai"))
    return {
      label: status || "Sampai",
      cls: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
      dot: "bg-emerald-500",
    };

  return {
    label: status || "Status",
    cls: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
  };
}

async function fetchOrdersByStatus(statusPath: string) {
  const token = getRoleToken("siswa");
  if (!token) throw new Error("Token siswa tidak ada. Login siswa dulu.");

  const res = await fetch(joinUrl(API_BASE, `showorder/${statusPath}`), {
    method: "GET",
    headers: {
      makerID: MAKER_ID,
      Authorization: `Bearer ${token}`,
    } as any,
  });

  const raw = await res.text();
  const data: any = await safeJson(raw);

  if (!res.ok) {
    throw new Error(data?.message || data?.msg || `HTTP ${res.status}`);
  }

  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.result)
    ? data.result
    : Array.isArray(data?.items)
    ? data.items
    : [];

  return Array.isArray(list) ? (list as OrderRow[]) : [];
}

export default function PesananSayaPage() {
  const tabs = useMemo(
    () => [
      { key: "belum dikonfirm", label: "Belum" },
      { key: "dimasak", label: "Dimasak" },
      { key: "diantar", label: "Diantar" },
      { key: "sampai", label: "Sampai" },
    ],
    []
  );

  const [active, setActive] = useState(tabs[0].key);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const statusPath = encodeURIComponent(active);
      const list = await fetchOrdersByStatus(statusPath);
      setRows(list);
    } catch (e: any) {
      setRows([]);
      setError(e?.message || "Gagal memuat pesanan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const TabBtn = ({
    active: isActive,
    children,
    onClick,
  }: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-2 text-sm font-extrabold transition",
        "ring-1 ring-inset",
        isActive
          ? "bg-red-600 text-white ring-red-600 shadow-sm"
          : "bg-white/90 text-slate-700 ring-slate-200 hover:bg-red-50 hover:ring-red-200",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ef4444_1px,transparent_0)] [background-size:18px_18px] opacity-[0.06]" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/10 blur-2xl" />

        <div className="relative p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700 ring-1 ring-red-100">
                🧾 Pesanan Siswa
              </div>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
                Pesanan Saya
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Pantau status pesanan kamu secara real-time.
              </p>
            </div>

            <button
              type="button"
              onClick={load}
              className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-extrabold text-red-600 hover:bg-red-50"
            >
              ⟳ Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <TabBtn
                key={t.key}
                active={t.key === active}
                onClick={() => setActive(t.key)}
              >
                {t.label}
              </TabBtn>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            {loading ? "Memuat..." : `Total: ${rows.length} pesanan`}
          </div>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          <div className="font-extrabold">Gagal memuat pesanan</div>
          <div className="mt-1">{error}</div>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-rose-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : null}

      {/* Modern Card List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 text-sm text-slate-500">
            Memuat data...
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 text-sm text-slate-500">
            Belum ada pesanan pada status ini.
          </div>
        ) : (
          rows.map((r, idx) => {
            const id = pickId(r) ?? `row-${idx}`;
            const statusText = String(r.status ?? active);
            const meta = statusMeta(statusText);

            const qty = r.jumlah != null ? String(r.jumlah) : "-";
            const amount =
              r.total != null ? r.total : r.harga != null ? r.harga : null;

            return (
              <div
                key={id}
                className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/5 blur-2xl" />

                <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        Order <span className="text-red-600">#{id}</span>
                      </div>

                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold",
                          meta.cls,
                        ].join(" ")}
                      >
                        <span className={["h-2 w-2 rounded-full", meta.dot].join(" ")} />
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-2 grid gap-1 text-sm">
                      <div className="text-slate-600">
                        Stan: <span className="font-semibold">{pickStan(r)}</span>
                      </div>

                      <div className="text-slate-900">
                        {r.nama_makanan ? (
                          <span className="font-semibold">{r.nama_makanan}</span>
                        ) : (
                          <span className="text-slate-500">
                            (Nama menu belum ada di response)
                          </span>
                        )}
                      </div>

                      {pickDate(r) ? (
                        <div className="text-xs text-slate-500">{pickDate(r)}</div>
                      ) : null}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="relative flex w-full flex-col items-start gap-2 md:w-auto md:items-end">
                    <div className="flex w-full items-center justify-between gap-6 md:w-auto md:justify-end">
                      <div className="text-sm text-slate-600">
                        Qty:{" "}
                        <span className="font-semibold text-slate-900">{qty}</span>
                      </div>

                      {amount != null ? (
                        <div className="text-lg font-extrabold text-slate-900">
                          {formatRupiah(amount)}
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-slate-500">—</div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const oid = pickId(r);
                        if (!oid) return alert("ID order tidak ditemukan dari backend.");
                        window.location.href = `/siswa/dashboard/nota/${oid}`;
                      }}
                      className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-700 active:scale-[0.99] transition"
                    >
                      🧾 Cetak Nota
                    </button>

                    {/* subtle hint */}
                    <div className="text-[11px] text-slate-400">
                      Klik untuk unduh/lihat nota
                    </div>
                  </div>
                </div>

                {/* bottom divider / micro */}
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-red-100 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
