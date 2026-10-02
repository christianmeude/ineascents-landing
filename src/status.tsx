const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export default function StatusPage() {
  const api = API_BASE || 'preview'
  const health = API_BASE ? `${API_BASE}/health` : '#/status'
  const status = API_BASE ? `${API_BASE}/status` : '#/status'
  return (
    <main className="bg-cream dark:bg-night text-primary dark:text-cream max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
      <span className="inline-flex items-baseline justify-center text-primary dark:text-cream" aria-hidden="true">
        <span className="font-logo-sans text-2xl sm:text-3xl font-bold tracking-[0.15em]">INEA</span>
        <span className="font-logo-script -ml-[0.85em] translate-y-[35%] text-3xl sm:text-4xl">Scents</span>
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary/60 dark:text-cream/60">Status</p>
      <h1 className="display-bold font-logo-sans text-4xl sm:text-5xl font-bold uppercase tracking-tight mt-2">
        All systems normal
      </h1>
      <p className="mt-4 text-base font-light text-primary/80 dark:text-cream/80">
        Landing page is up. API base: <code className="font-mono text-sm">{api}</code>
      </p>
      <p className="mt-6 text-sm font-light">
        {API_BASE ? (
          <>
            <a href={health} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Backend /health</a>
            {' · '}
            <a href={status} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Backend /status</a>
            {' · '}
          </>
        ) : null}
        <a href="#/" className="underline underline-offset-4">Back to home</a>
      </p>
    </main>
  )
}
