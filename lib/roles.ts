import type { Role } from "@/types";

/** Roles that can be assigned to users in the UI (excludes readonly_viewer, api_service) */
export const USER_ASSIGNABLE_ROLES: Role[] = [
  "super_admin",
  "tenant_admin",
  "network_engineer",
  "billing_manager",
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  network_engineer: "Network Engineer",
  billing_manager: "Billing Manager",
  readonly_viewer: "Read-only",
  api_service: "API Service",
};

/** Roles available for invite/assign (no super_admin; that's granted separately) */
export const INVITE_ROLES: Role[] = ["tenant_admin", "network_engineer", "billing_manager"];

/** Default role for invited users when none specified */
export const DEFAULT_INVITE_ROLE: Role = "billing_manager";

export function canAccessAdmin(role: string | null | undefined): boolean {
  return role === "super_admin" || role === "tenant_admin";
}

export function getRoleLabel(role: string | null | undefined): string {
  return (role && ROLE_LABELS[role as Role]) ?? "Viewer";
}
