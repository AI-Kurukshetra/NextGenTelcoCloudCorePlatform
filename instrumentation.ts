export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const loadDynamic = new Function("m", "return import(m)") as (moduleName: string) => Promise<{ init: (opts: Record<string, unknown>) => void }>;
    const sentry = await loadDynamic("@sentry/nextjs").catch(() => null);
    if (sentry && process.env.SENTRY_DSN) {
      sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 0.1,
        environment: process.env.NODE_ENV,
      });
    }
  }
}
