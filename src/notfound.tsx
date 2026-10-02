export default function NotFoundPage() {
  return (
    <main className="bg-cream dark:bg-night text-primary dark:text-cream max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
      <span className="inline-flex items-baseline justify-center text-primary dark:text-cream" aria-hidden="true">
        <span className="font-logo-sans text-2xl sm:text-3xl font-bold tracking-[0.15em]">INEA</span>
        <span className="font-logo-script -ml-[0.85em] translate-y-[35%] text-3xl sm:text-4xl">Scents</span>
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary/60 dark:text-cream/60">404</p>
      <h1 className="display-bold font-logo-sans text-4xl sm:text-5xl font-bold uppercase tracking-tight mt-2">
        Page not found
      </h1>
      <p className="mt-4 text-base font-light text-primary/80 dark:text-cream/80">
        That scent trail went cold — the page you asked for does not exist.
      </p>
      <a
        href="#/"
        className="mt-8 inline-block border border-primary/25 dark:border-cream/25 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary/5 dark:hover:bg-cream/10 transition-colors"
      >
        Home
      </a>
    </main>
  )
}
