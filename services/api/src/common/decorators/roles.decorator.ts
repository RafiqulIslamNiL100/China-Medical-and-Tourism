import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export const ROLES_KEY = "roles";

/** Restricts a route to the given roles — matches the summary text in api/openapi.yaml. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
