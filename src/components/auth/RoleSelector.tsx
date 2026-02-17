"use client";

import { Role } from "@/lib/roles";
import { Briefcase, Users } from "lucide-react";

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
  roles: { value: Role; label: string; icon: React.ReactNode; description: string }[];
}

export function RoleSelector({ value, onChange, roles }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        I want to join as
      </label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isSelected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`relative p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500/50 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30"
                  : "border-slate-700 bg-slate-800/60 hover:border-indigo-500/30 hover:bg-slate-800/80"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`${isSelected ? "text-white" : "text-indigo-400"}`}>
                  {role.icon}
                </div>
                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-200"}`}>
                  {role.label}
                </span>
                <span className={`text-xs ${isSelected ? "text-cyan-100" : "text-slate-400"}`}>
                  {role.description}
                </span>
              </div>

              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500"
                  style={{ zIndex: -1 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const roleOptions = [
  {
    value: "seeker" as Role,
    label: "Seeker",
    icon: <Users className="h-6 w-6" />,
    description: "Find opportunities"
  },
  {
    value: "employer" as Role,
    label: "Employer",
    icon: <Briefcase className="h-6 w-6" />,
    description: "Post jobs"
  }
];
