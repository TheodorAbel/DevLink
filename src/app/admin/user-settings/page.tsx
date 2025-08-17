// app/admin/user-settings/page.tsx
import RoleGuard from "@/components/RoleGuard";

export default function AdminSettings() {
  return (
    <RoleGuard allowedRole="admin">
      <div className="p-4 text-xl">Admin Settings Page</div>
    </RoleGuard>
  );
}
