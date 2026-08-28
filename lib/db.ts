import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Server-only Postgres access (Neon). This is the *only* way the app
 * talks to the database — there is no anon/public key exposed to the
 * browser at all, unlike a BaaS with row-level security. Every access
 * check (owner_token verification, lock state, etc.) happens in
 * application code before a query runs.
 *
 * Lazily initialized so importing this module doesn't throw at build
 * time when DATABASE_URL isn't set yet (e.g. static pages that never
 * call `sql`).
 */
let cachedSql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (cachedSql) return cachedSql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Copy .env.local.example to .env.local and " +
        "fill in your Neon connection string."
    );
  }

  cachedSql = neon(connectionString);
  return cachedSql;
}

// Explicit return type because proxying neon()'s call through this
// wrapper loses its overload-based inference (arrayMode/fullResults are
// always left at their defaults here, so this cast reflects reality).
export function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  return getSql()(strings, ...values) as Promise<Record<string, unknown>[]>;
}
