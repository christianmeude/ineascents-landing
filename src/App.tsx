import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LegalPage, { PRIVACY_VERSION } from './legal'
import StatusPage from './status'
import NotFoundPage from './notfound'

// L6: single source for the business page URL (was triplicated).
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61580331093927'

// L7: hash mini-router (no router dep, Vercel-static safe).
type LegalRoute = 'home' | 'privacy' | 'terms' | 'status' | 'notfound'

function useLegalRoute(): LegalRoute {
  const read = (): LegalRoute => {
    const h = window.location.hash
    if (h === '#/privacy') return 'privacy'
    if (h === '#/terms') return 'terms'
    if (h === '#/status') return 'status'
    if (h === '#/' || h === '' || !h.startsWith('#/')) return 'home'
    return 'notfound'
  }
  const [route, setRoute] = useState<LegalRoute>(read)
  useEffect(() => {
    const onHash = () => {
      setRoute(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

type Theme = 'light' | 'dark'

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('inea-theme', next)
    } catch {
      /* private mode: theme simply won't persist */
    }
  }
  return [theme, toggle]
}

/* Pauses the levitating mesh when the hero scrolls offscreen */
function useMeshPause(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const layer = document.querySelector('.mesh-layer')
    const hero = document.querySelector('header')
    if (!layer || !hero || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => layer.classList.toggle('paused', !entry.isIntersecting))
      },
      { threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [enabled])
}

/* GSAP landing-wide motion: hero entrance on load, scroll reveals everywhere
   else, stretch band bridging hero into packages. Reduced-motion returns
   early so the CSS fallback (visible, static) applies. */
function useGsapMotion(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    let ctx: gsap.Context | undefined
    try {
      ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(
            'header .rise',
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
            0.1,
          )
          .fromTo(
            'header .hero-photo',
            { scale: 1.04, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' },
            0.2,
          )
      gsap.utils
        .toArray<HTMLElement>('.rise')
        .filter((el) => !el.closest('header'))
        .forEach((el) => {
          gsap.fromTo(
            el,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              delay: parseFloat(el.style.getPropertyValue('--d')) || 0,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            },
          )
        })
      gsap.fromTo(
        '.stretch-band',
        { scaleY: 0.2 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.stretch-band', start: 'top bottom', end: 'top 40%', scrub: true },
        },
      )
      })
    } catch {
      // GSAP init failed: fall back to the CSS arrival so content never strands hidden.
      document.querySelectorAll('.rise, .hero-photo').forEach((el) => el.classList.add('in'))
      return
    }
    return () => ctx?.revert()
  }, [enabled])
}

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function Logo({ tone = 'plum', interactive = true }: { tone?: 'plum' | 'cream'; interactive?: boolean }) {
  const color = tone === 'plum' ? 'text-primary dark:text-cream' : 'text-cream'
  if (!interactive) {
    return (
      <span className={`inline-flex items-baseline justify-center ${color}`} aria-hidden="true">
        <span className="font-logo-sans text-2xl sm:text-3xl font-bold tracking-[0.15em]">INEA</span>
        <span className="font-logo-script -ml-[0.85em] translate-y-[35%] text-3xl sm:text-4xl">Scents</span>
      </span>
    )
  }
  return (
    <div
      className={`inline-flex items-baseline justify-center cursor-pointer hover:opacity-80 transition-opacity ${color}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      role="link"
      aria-label="Inea Scents - back to top"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <span className="font-logo-sans text-2xl sm:text-3xl font-bold tracking-[0.15em]">INEA</span>
      <span className="font-logo-script -ml-[0.85em] translate-y-[35%] text-3xl sm:text-4xl">Scents</span>
    </div>
  )
}

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 dark:border-cream/20 text-primary dark:text-cream hover:bg-primary/5 dark:hover:bg-cream/10 transition-colors"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const APP_BASE = (
  import.meta.env.VITE_FRONTEND_URL ?? 'https://ineascents-app.vercel.app'
).replace(/\/$/, '')

/* Mobile App login URL: env holds the base in prod; local Flutter web runs
   pinned with `flutter run -d chrome --web-port=62409`. A full deep link
   incl. hash also works since appLoginUrl passes through any '#'. */
function appLoginUrl() {
  if (!APP_BASE) return '#inquire'
  if (APP_BASE.includes('#')) return APP_BASE
  return `${APP_BASE}/#/login`
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Please tell us your name so we know who to reply to.'
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = 'That email does not look complete - please check it.'
    if (!form.phone.trim() || !/^[\+0-9\s\-]{7,20}$/.test(form.phone))
      next.phone = 'Please add a reachable phone number.'
    if (!consent) next.consent = 'Please accept the privacy policy so we can reply to your inquiry.'
    setErrors(next)
    const first = ['name', 'email', 'phone', 'consent'].find((k) => next[k])
    if (first) document.getElementById(first)?.focus()
    return Object.keys(next).length === 0
  }

  const applyFieldErrors = (fields: Record<string, string[] | string>) => {
    const next: Record<string, string> = {}
    for (const [rawKey, rawValue] of Object.entries(fields)) {
      const msg = Array.isArray(rawValue) ? rawValue[0] : rawValue
      if (!msg) continue
      const key = rawKey === 'event_date' ? 'date' : rawKey.replace(/^customer_/, '')
      const mapped = key === 'consent_privacy_version' ? 'consent' : key
      if (['name', 'email', 'phone', 'date', 'message', 'consent'].includes(mapped)) next[mapped] = msg
    }
    setErrors(next)
    const first = ['name', 'email', 'phone', 'date', 'message', 'consent'].find((k) => next[k])
    if (first) document.getElementById(first)?.focus()
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sent || isSubmitting) return
    if (!validate()) return
    if (!API_BASE) {
      setErrors({ submit: 'Form not configured. Message us on Facebook.' })
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          event_date: form.date || null,
          message: form.message,
          website: form.website,
          consent_privacy_version: PRIVACY_VERSION,
        }),
      })
      if (res.ok) {
        setSent(true)
        return
      }
      let data: { errors?: Record<string, string[] | string> } = {}
      try {
        data = await res.json()
      } catch {
        /* non-JSON error body: fall through to generic banner */
      }
      if (res.status === 422 && data.errors) {
        applyFieldErrors(data.errors)
        return
      }
      setErrors({ submit: 'Something went wrong sending — try again or message us on Facebook.' })
    } catch {
      setErrors({ submit: 'Something went wrong sending — try again or message us on Facebook.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (sent) {
    return (
      <div className="py-6 text-center">
        <h3
          tabIndex={-1}
          ref={(el) => {
            el?.focus({ preventScroll: true })
          }}
          className="font-logo-sans text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 outline-none"
        >
          Inquiry received
        </h3>
        <p className="text-lg font-light text-primary/80 dark:text-cream/80 leading-relaxed mb-4">
          Thank you{form.name.trim() ? `, ${form.name.trim().split(' ')[0]}` : ''}. We have your
          details and will reply to confirm availability for {form.date || 'your event'}.
        </p>
        <p className="text-primary/70 dark:text-cream/70 font-light mb-8">
          Prefer to chat now? Message us on{' '}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 decoration-accent hover:decoration-primary dark:hover:decoration-cream transition-colors"
          >
            Facebook
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setForm({ name: '', email: '', phone: '', date: '', message: '', website: '' })
            setConsent(false)
            setErrors({})
          }}
          className="text-sm font-bold uppercase tracking-[0.2em] text-primary dark:text-cream underline underline-offset-8 decoration-primary/30 dark:decoration-cream/30 hover:decoration-primary dark:hover:decoration-cream transition-colors"
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  const labelClass =
    'text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-primary/80 dark:text-cream/70'
  const getInputClass = (hasError: boolean) =>
    `w-full bg-transparent border-b ${hasError ? 'border-clay dark:border-red-300' : 'border-primary/25 dark:border-cream/25 focus:border-primary dark:focus:border-cream'} focus:ring-0 outline-none px-0 py-2.5 text-base text-primary dark:text-cream placeholder-primary/80 dark:placeholder-cream/60 transition-colors rounded-none`

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: '', submit: '' }))
  const err = (key: string, id: string) =>
    errors[key] ? (
      <span id={id} className="text-clay dark:text-red-300 text-sm mt-2 block font-light">
        {errors[key]}
      </span>
    ) : null

  return (
    <form onSubmit={handle} noValidate className="space-y-6">
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => {
          setForm({ ...form, website: e.target.value })
          clearError('submit')
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />
      {errors.submit ? (
        <p role="alert" className="text-clay dark:text-red-300 text-sm block font-light">
          {errors.submit}
        </p>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              clearError('name')
            }}
            className={getInputClass(!!errors.name)}
            placeholder="Maria Santos"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {err('name', 'name-error')}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              clearError('email')
            }}
            className={getInputClass(!!errors.email)}
            placeholder="maria@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {err('email', 'email-error')}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value })
              clearError('phone')
            }}
            className={getInputClass(!!errors.phone)}
            placeholder="+63 912 345 6789"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone ? (
            err('phone', 'phone-error')
          ) : (
            <span className="text-primary/80 dark:text-cream/50 text-xs mt-2 block">
              Philippine mobile or landline
            </span>
          )}
        </div>
        <div>
          <label htmlFor="date" className={labelClass}>
            Event Date
          </label>
          <input
            id="date"
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => {
              setForm({ ...form, date: e.target.value })
              clearError('date')
            }}
            className={getInputClass(!!errors.date)}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : 'date-hint'}
          />
          {errors.date ? (
            err('date', 'date-error')
          ) : (
            <span id="date-hint" className="text-primary/80 dark:text-cream/50 text-xs mt-2 block">
              Tentative or leave blank — add them under Details.
            </span>
          )}
        </div>
      </div>
      <details className="group">
        <summary className="list-none cursor-pointer text-xs font-bold uppercase tracking-[0.2em] text-primary/80 dark:text-cream/70 flex items-center gap-2 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-45 text-base leading-none font-normal">+</span>
          Details <span className="normal-case tracking-normal font-light opacity-60">(Optional)</span>
        </summary>
        <textarea
          id="message"
          aria-label="Event details, optional"
          rows={2}
          value={form.message}
          onChange={(e) => {
            setForm({ ...form, message: e.target.value })
            clearError('message')
          }}
          className={`${getInputClass(!!errors.message)} resize-y min-h-[64px] mt-3`}
          placeholder="Guest count, venue, theme..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {err('message', 'message-error')}
      </details>
      <div className="pt-2">
        <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer text-sm font-light text-primary/80 dark:text-cream/80">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              clearError('consent')
            }}
            className="mt-1 h-4 w-4 shrink-0 accent-[#6E3C53]"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I agree to the{' '}
            <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-accent hover:decoration-primary dark:hover:decoration-cream transition-colors">
              privacy policy
            </a>{' '}
            and to being contacted about my inquiry.
          </span>
        </label>
        {err('consent', 'consent-error')}
      </div>
      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-cream w-full py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-dark dark:hover:bg-cream dark:hover:text-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              Send Inquiry <ArrowIcon />
            </>
          )}
        </button>
        <p className="text-xs text-primary/80 dark:text-cream/50 mt-4 tracking-wider">
          Your information stays with us - never shared. See our{' '}
          <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  )
}

const INCLUDED = [
  'Every bottle personalized with your logo, finished with a hemp cord',
  '4 inspired scents for guests to choose from',
  'Styled perfume bar set up at your venue',
  'Claim stub for every guest',
  '3 to 4 hours of service with 2 staff members',
]

const FREE = ['Selfie mirror for your guests', 'A gift for the celebrant']

const STEPS = [
  {
    name: 'Inquire',
    text: 'Tell us your event date and guest count. We confirm availability and walk you through the scents.',
  },
  {
    name: 'We set up',
    text: 'On the day, we arrive early and style the bar to your venue - you host, we handle the rest.',
  },
  {
    name: 'Guests discover',
    text: 'Everyone explores the scents with our team and finds the one that fits them.',
  },
  {
    name: 'They take it home',
    text: 'Each guest leaves with a 10ml bottle, personalized with your logo - a favor that gets kept.',
  },
]

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const legalRoute = useLegalRoute()
  const isHome = legalRoute === 'home'

  useGsapMotion(isHome)
  useMeshPause(isHome)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Measured scroll: nav height + breathing room, avoiding scroll-margin quirks. */
  const scrollToEl = (id: string, mode: 'start' | 'center') => {
    const el = document.getElementById(id)
    if (!el) return
    const navH = document.querySelector('nav')?.getBoundingClientRect().height ?? 72
    const rect = el.getBoundingClientRect()
    const absTop = rect.top + window.scrollY
    const top =
      mode === 'start'
        ? absTop - navH - 16
        : absTop + rect.height / 2 - window.innerHeight / 2
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  const scrollToInquiry = () => scrollToEl('inquire', 'start')

  const scrollToPackages = () => scrollToEl('packages', 'start')

  return (
    <div className="min-h-screen bg-cream dark:bg-night text-primary dark:text-cream selection:bg-primary selection:text-cream dark:selection:bg-cream dark:selection:text-primary font-body">
      <div className="mesh-global" aria-hidden="true">
        <span className="mesh-e" />
        <span className="mesh-f" />
        <span className="mesh-g" />
      </div>
      {legalRoute !== 'home' ? (
        <>
          <nav
            className="fixed top-0 left-0 right-0 z-50 bg-cream/85 dark:bg-night/85 backdrop-blur-md border-b border-primary/10 dark:border-cream/10 py-3"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
              <a href="#/" aria-label="Inea Scents home">
                <Logo interactive={false} />
              </a>
              <ThemeButton theme={theme} onToggle={toggleTheme} />
            </div>
          </nav>
          {(legalRoute === 'privacy' || legalRoute === 'terms') ? (
            <LegalPage kind={legalRoute} />
          ) : null}
          {legalRoute === 'status' ? <StatusPage /> : null}
          {legalRoute === 'notfound' ? <NotFoundPage /> : null}
        </>
      ) : (
      <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-cream/85 dark:bg-night/85 backdrop-blur-md border-primary/10 dark:border-cream/10 py-3'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeButton theme={theme} onToggle={toggleTheme} />
            <a
              href={appLoginUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary/25 dark:border-cream/25 text-primary dark:text-cream text-xs font-bold uppercase tracking-[0.2em] px-4 sm:px-6 py-3 rounded-full hover:bg-primary/5 dark:hover:bg-cream/10 transition-colors whitespace-nowrap"
            >
              Book in App
            </a>
            <button
              onClick={scrollToInquiry}
              className="bg-primary text-cream dark:bg-cream dark:text-primary text-xs font-bold uppercase tracking-[0.2em] px-4 sm:px-6 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-cream/90 transition-colors whitespace-nowrap"
            >
              Inquire
            </button>
          </div>
        </div>
      </nav>

      <main>
        <header className="relative w-full overflow-hidden">
          <div className="mesh-layer" aria-hidden="true">
            <span className="mesh-a" />
            <span className="mesh-b" />
            <span className="mesh-c" />
            <span className="mesh-d" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 md:pt-28 pb-12 md:pb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center lg:min-h-[100svh] lg:content-center">
            <div className="lg:col-span-6 min-w-0">
              <h1 className="rise display-bold font-logo-sans font-bold uppercase tracking-tight leading-[0.95] text-5xl sm:text-7xl md:text-7xl text-balance">
                <span className="block">The perfume bar guests</span>
                <span className="block font-logo-script normal-case font-normal tracking-normal text-6xl sm:text-8xl md:text-8xl mt-2">
                  remember
                </span>
              </h1>
              <p
                className="rise mt-6 text-lg font-light leading-relaxed text-primary/80 dark:text-cream/80 max-w-xl"
                style={{ ['--d' as string]: '0.12s' }}
              >
                Inea Scents sets up a styled perfume bar at your event in Metro Manila. Guests
                choose from 4 inspired scents and take home a 10ml bottle with your logo.
              </p>
              <div className="rise mt-8 flex flex-col sm:flex-row gap-4" style={{ ['--d' as string]: '0.2s' }}>
                <button
                  onClick={scrollToInquiry}
                  className="bg-primary text-cream px-10 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-dark dark:hover:bg-cream dark:hover:text-primary transition-colors inline-flex items-center justify-center gap-3"
                >
                  Ask About Your Date <ArrowIcon />
                </button>
                <button
                  type="button"
                  onClick={scrollToPackages}
                  className="px-10 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] border border-primary/25 dark:border-cream/25 text-center hover:bg-primary/5 dark:hover:bg-cream/10 transition-colors"
                >
                  Packages
                </button>
              </div>
              <p
                className="rise mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary/80 dark:text-cream/70"
                style={{ ['--d' as string]: '0.28s' }}
              >
                Starts at Php 4,499 - 50-150 pax
              </p>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <figure className="hero-photo relative">
                <div className="absolute -inset-3 rounded-[28px] bg-accent/40 dark:bg-cream/10 -rotate-2" aria-hidden="true" />
                <video
                  className="relative rounded-3xl w-full min-w-0 aspect-[16/10] sm:aspect-[4/5] lg:aspect-auto lg:h-[62svh] object-cover lift"
                  src="/hero-bar.mp4"
                  poster="/photos/bar-1440.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="The Inea Scents perfume bar at an event - white illuminated bar with four glass scent dispensers, floral styling, and a book-us sign"
                >
                  <img
                    src="/photos/bar-1440.webp"
                    srcSet="/photos/bar-900.webp 900w, /photos/bar-1440.webp 1440w"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    alt="The Inea Scents perfume bar at an event - white illuminated bar with four glass scent dispensers, floral styling, and a book-us sign"
                    className="relative rounded-3xl w-full min-w-0 aspect-[16/10] sm:aspect-[4/5] lg:aspect-auto lg:h-[62svh] object-cover lift"
                    fetchPriority="high"
                  />
                </video>
                <figcaption className="relative mt-4 text-sm text-primary/80 dark:text-cream/70 font-light text-center">
                  Our bar, styled for a recent celebration in Metro Manila.
                </figcaption>
              </figure>
            </div>
          </div>
        </header>

        <div className="stretch-band" aria-hidden="true" />

        <section id="packages" className="relative py-10 md:py-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 min-w-0">
              <h2 className="rise display-bold font-logo-sans text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none">
                One bar.
                <br />
                Sized to your guest list.
              </h2>
              <p className="rise mt-4 text-base font-light leading-relaxed text-primary/80 dark:text-cream/80" style={{ ['--d' as string]: '0.1s' }}>
                Every package is the same experience - the difference is only how many guests
                take a bottle home. Four tiers, 50 to 150 guests, all with 10ml bottles.
              </p>
              <div className="rise mt-6 rounded-3xl bg-white dark:bg-night-surface border border-primary/15 dark:border-cream/15 p-6 lift" style={{ ['--d' as string]: '0.18s' }}>
                <div className="flex items-end gap-4">
                  <div className="font-logo-sans text-4xl font-bold tracking-tight">Php 4,499</div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] pb-2 text-primary/80 dark:text-cream/70">
                    Starting price
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-primary/80 dark:text-cream/80 font-light">
                  <div className="flex justify-between border-b border-primary/10 dark:border-cream/10 pb-2">
                    <dt>10ml - 50 guests</dt>
                    <dd className="font-semibold text-primary dark:text-cream">Php 4,499</dd>
                  </div>
                  <div className="flex justify-between border-b border-primary/10 dark:border-cream/10 pb-2">
                    <dt>10ml - 70 guests</dt>
                    <dd className="font-semibold text-primary dark:text-cream">Php 6,399</dd>
                  </div>
                  <div className="flex justify-between border-b border-primary/10 dark:border-cream/10 pb-2">
                    <dt>10ml - 100 guests</dt>
                    <dd className="font-semibold text-primary dark:text-cream">Php 8,799</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>10ml - 150 guests</dt>
                    <dd className="font-semibold text-primary dark:text-cream">Php 13,119</dd>
                  </div>
                </dl>
                <button
                  onClick={scrollToInquiry}
                  className="mt-6 w-full bg-primary text-cream py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-dark dark:hover:bg-cream dark:hover:text-primary transition-colors"
                >
                  Inquire About Your Date
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rise rounded-3xl bg-white dark:bg-night-surface border border-primary/15 dark:border-cream/15 p-6 lift" style={{ ['--d' as string]: '0.1s' }}>
                <h3 className="font-logo-sans text-xl font-bold uppercase tracking-tight mb-4">
                  Every package includes
                </h3>
                <ul className="space-y-3">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex gap-3 text-primary/80 dark:text-cream/80 font-light leading-relaxed">
                      <span className="mt-1 text-primary dark:text-cream shrink-0">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rise rounded-3xl bg-primary dark:bg-cream text-cream dark:text-primary p-6 lift" style={{ ['--d' as string]: '0.18s' }}>
                <h3 className="font-logo-script text-4xl mb-4">On the house</h3>
                <ul className="space-y-3">
                  {FREE.map((item) => (
                    <li key={item} className="flex gap-3 font-light leading-relaxed opacity-90">
                      <span className="mt-1 shrink-0">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm font-light opacity-70 leading-relaxed">
                  The selfie mirror keeps guests busy while they wait - and the celebrant takes
                  home something extra.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 bg-white/60 dark:bg-night-surface/40 border-y border-primary/10 dark:border-cream/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="rise font-logo-sans text-4xl md:text-5xl font-bold uppercase tracking-tight text-center">
              How the day goes
            </h2>
            <ol className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-10">
              {STEPS.map((step, i) => (
                <li key={step.name} className="rise relative" style={{ ['--d' as string]: `${i * 0.1}s` }}>
                  <span className="hidden md:block absolute top-5 left-0 right-0 h-px bg-primary/20 dark:bg-cream/20" aria-hidden="true" />
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-cream dark:bg-cream dark:text-primary font-logo-sans font-bold mb-6">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-3">{step.name}</h3>
                  <p className="text-primary/80 dark:text-cream/80 font-light leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="inquire" className="relative py-16 md:py-20 scroll-mt-24 bg-white/60 dark:bg-night-surface/40 border-y border-primary/10 dark:border-cream/10">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="rise display-bold font-logo-sans text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight">
              Let&rsquo;s begin
            </h2>
            <p className="rise mt-4 text-lg font-light text-primary/80 dark:text-cream/80" style={{ ['--d' as string]: '0.1s' }}>
              Tell us about your event - we will reply to confirm availability.
            </p>
            <div className="rise mt-10 text-left" style={{ ['--d' as string]: '0.15s' }}>
              <ContactForm />
            </div>
            <p className="rise mt-8 text-sm text-primary/80 dark:text-cream/70 font-light" style={{ ['--d' as string]: '0.2s' }}>
              Prefer chat? Message us on{' '}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-accent hover:decoration-primary dark:hover:decoration-cream transition-colors"
              >
                Facebook
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-primary-dark dark:bg-black/40 text-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo tone="cream" />
          <div className="flex items-center gap-5 text-cream/70">
            <div className="text-xs font-bold uppercase tracking-[0.2em]">Metro Manila, Philippines</div>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href="#/privacy"
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-cream transition-colors"
            >
              Privacy
            </a>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href="#/terms"
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-cream transition-colors"
            >
              Terms
            </a>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href="#/status"
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-cream transition-colors"
            >
              Status
            </a>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href="#inquire"
              onClick={(e) => {
                e.preventDefault()
                scrollToEl('inquire', 'start')
              }}
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-cream transition-colors"
            >
              Contact
            </a>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href={appLoginUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-[0.2em] hover:text-cream transition-colors"
            >
              Book in App
            </a>
            <div className="w-1 h-1 rounded-full bg-cream/40" aria-hidden="true" />
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inea Scents on Facebook"
              className="hover:text-cream transition-colors"
            >
              <FacebookIcon />
            </a>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-cream/70">
            &copy; 2026 Inea Scents
          </div>
        </div>
      </footer>
      </>
      )}
    </div>
  )
}
