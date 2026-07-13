import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/** Marks a route as not requiring authentication (mirrors `security: []` in the OpenAPI spec). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
