import { createAccessControl } from "better-auth/plugins";

export const statement = {
    user: ["create", "read", "update", "delete"], // <-- Permissions available for created roles
    equipment:["create", "read", "update", "delete"]
} as const;

export const ac = createAccessControl(statement);

export const adminRole=ac.newRole({
  user:["create", "read", "update", "delete"],
  equipment:["create", "read", "update", "delete"]
})

export const userRole=ac.newRole({
  equipment:["create","read", "update"]
})