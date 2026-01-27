"use client";

import { useEffect, useMemo, useState } from "react";
import { getRoleToken } from "@/lib/auth";

/* ================== TYPES ================== */
type OrderRow = {
  id_order?: number;
  id?: number;
  ID?: number;
  status?: string;
  created_at?: string;
  tanggal?: string;
  [key: string]: any;
};

type NotaDetail = any;

/* ================== CONFIG ================== */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://ukk-p2.smktelkom-mlg.sch.id/api/";
const MAKER_ID = process.env.NEXT_PUBLIC_MAKER_ID ?? "1";

/* ================== HELPERS ================== */
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "/")}${path.replace(/^\/+/, "")}`;
}

async function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function pickOrderId(r: OrderRow) {
  return Number(r.id_order ?? r.id ?? r.ID ?? 0) || null;
}

function pickDate(r: OrderRow) {
  return r.created_at ?? r.tanggal ?? "-";
}

function statusBadge(status: string) {
  const s = status?.toLowerCase() || "";
  if (s.includes("belum")) return "bg-slate-100 text-slate-700";
  if (s.includes("dimasak")) return "bg-amber-100 text-amber-700";
  if (s.includes("diantar")) return "bg-blue-100 text-blue-700";
  if (s.includes("sampai"))
    return "bg-emerald-100 text-emerald-700";
  return "bg-purple-100 text-purple-700";
}

/* ================== ENDPOINT ================== */
const LIST_PATH = "getorder";
const NOTA_PATH = "cetaknota";
const UPDATE_STATUS_PATH = "updatestatus";

/* ================== API ================== */
function requireToken() {
  const token = getRoleToken("stand");
  if (!token) throw new Error("Token admin tidak ditemukan");
  return token;
}

async function fetchOrders(status: string) {
  const token = requireToken();
  const res = await fetch(joinUrl(API_BASE, `${LIST_PATH}/${status}`), {
    headers: { makerID: MAKER_ID, Authorization: `Bearer ${token}` } as any,
  });
  const data = await safeJson(await res.text());
  if (!res.ok) throw new Error(data?.message || "Gagal ambil order");
  return Array.isArray(data?.data) ? data.data : data;
}

async function fetchNota(id: number) {
  const token = requireToken();
  const res = await fetch(joinUrl(API_BASE, `${NOTA_PATH}/${id}`), {
    headers: { makerID: MAKER_ID, Authorization: `Bearer ${token}` } as any,
  });
  if (!res.ok) return null;
  return safeJson(await res.text());
}

async function updateStatus(id: number, status: string) {
  const token = requireToken();
  const body = new URLSearchParams({ status });
  const res = await fetch(joinUrl(API_BASE, `${UPDATE_STATUS_PATH}/${id}`), {
    method: "PUT",
    headers: {
      makerID: MAKER_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    } as any,
    body,
  });
  if (!res.ok) throw new Error("Gagal update status");
}

/* ================== PAGE ================== */
export default function AdminOrderPage() {
  const tabs = [
    { key: "belum dikonfirm", label: "Belum Dikonfirm" },
    { key: "dimasak", label: "Dimasak" },
    { key: "diantar", label: "Diantar" },
    { key: "sampai", label: "Sampai" },
  ];

  const [active, setActive] = useState(tabs[0].key);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [notaMap, setNotaMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const list = await fetchOrders(active);
      setRows(list);
      const ids = list.map(pickOrderId).filter(Boolean) as number[];
      const notes = await Promise.all(
        ids.map(async (id) => [id, await fetchNota(id)]),
      );
      setNotaMap(Object.fromEntries(notes));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [active]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      String(pickOrderId(r)).includes(q) ||
      String(r.status).toLowerCase().includes(q),
    );
  }, [rows, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              📦 Order Masuk
            </h1>
            <p className="text-sm text-slate-500">
              Pantau & kelola status pesanan pelanggan
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari order..."
            className="rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
          />
        </div>

        {/* TABS */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-full px-5 py-2 text-sm font-extrabold ${
                active === t.key
                  ? "bg-red-500 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-red-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-600">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  Memuat data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  Tidak ada order
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const id = pickOrderId(r)!;
                return (
                  <tr
                    key={id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-extrabold">{id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                          r.status || "",
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {pickDate(r)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {["dimasak", "diantar", "sampai"].map((s) => (
                        <button
                          key={s}
                          disabled={updating === id}
                          onClick={async () => {
                            setUpdating(id);
                            await updateStatus(id, s);
                            await load();
                            setUpdating(null);
                          }}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100"
                        >
                          {s}
                        </button>
                      ))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
