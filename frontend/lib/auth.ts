// /lib/auth.ts
export type Role = "siswa" | "stand";

export function saveRoleSession(role: Role, payload: any) {
  localStorage.setItem(`${role}_session`, JSON.stringify(payload));

  // ✅ dari response kamu tokennya di access_token
  const token =
    payload?.access_token ||
    payload?.token ||
    payload?.data?.token ||
    payload?.data?.access_token;

  if (token) localStorage.setItem(`${role}_token`, token);
}

export function getRoleToken(role: Role) {
  return localStorage.getItem(`${role}_token`);
}

export function isLoggedIn(role: Role) {
  return !!localStorage.getItem(`${role}_session`);
}

export function logoutRole(role: Role) {
  localStorage.removeItem(`${role}_session`);
  localStorage.removeItem(`${role}_token`);
}

/** ✅ Tambahan: ambil session object */
export function getRoleSession<T = any>(role: Role): T | null {
  const raw = localStorage.getItem(`${role}_session`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** ✅ Tambahan: ambil nama admin dari session (fleksibel) */
export function getAdminNameFromSession(session: any) {
  // kadang API return { data: {...} } / { user: {...} } / langsung object
  const root = session?.data ?? session?.user ?? session;

  // ambil prioritas nama pemilik, lalu nama stan, lalu username
  return (
    root?.nama_pemilik ||
    root?.namaPemilik ||
    root?.nama_stan ||
    root?.namaStan ||
    root?.username ||
    session?.username ||
    ""
  );
}
