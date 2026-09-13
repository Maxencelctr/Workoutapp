// Split out from auth.ts so middleware (edge runtime) can read the cookie
// name without pulling in bcrypt/Prisma, which aren't edge-compatible.
export const SESSION_COOKIE = "reprank_session";
