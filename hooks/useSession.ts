"use client";

import { useApi } from "@/hooks/useApi";

type SessionData = {
  user?: { id: string; email?: string };
  profile?: { tenant_id: string; role: string; full_name?: string | null; avatar_url?: string | null };
};

export function useSession() {
  const { data, ...rest } = useApi<SessionData>("/api/auth/session");
  const role = data?.profile?.role ?? null;
  const fullName = data?.profile?.full_name ?? null;
  const tenantId = data?.profile?.tenant_id ?? null;
  return {
    ...rest,
    data,
    role,
    fullName,
    tenantId,
    user: data?.user,
  };
}
