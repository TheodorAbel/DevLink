export const ROLES = {
  ADMIN: "admin",
  EMPLOYER: "employer",
  SEEKER: "seeker",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
