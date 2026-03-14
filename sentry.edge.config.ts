const loadDynamic = new Function("m", "return import(m)") as (moduleName: string) => Promise<{ init: (opts: Record<string, unknown>) => void }>;

if (process.env.SENTRY_DSN) {
  void loadDynamic("@sentry/nextjs")
    .then((sentry) => {
      sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 0.1,
      });
    })
    .catch(() => undefined);
}
