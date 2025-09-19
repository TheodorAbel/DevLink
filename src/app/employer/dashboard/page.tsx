import EmployerDashboardApp from "@/components/employer/EmployerDashboardApp";
import RoleGuard from "@/components/RoleGuard";

export default function EmployerDashboard() {
  return (
    <RoleGuard allowedRole="employer">
      <EmployerDashboardApp />
    </RoleGuard>
  );
}
