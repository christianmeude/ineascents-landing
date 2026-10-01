// L7: in-app legal pages mirroring backend LegalController version 2026-10-01.
// Hash-routed (#/privacy, #/terms) — no router dependency, Vercel-static safe.

// Must match backend App\Http\Controllers\LegalController::VERSION exactly;
// the inquiry form sends this value as consent_privacy_version.
export const PRIVACY_VERSION = '2026-10-01'
export const PRIVACY_EFFECTIVE_DATE = 'October 1, 2026'
export const PRIVACY_CONTACT_EMAIL = 'ineascents.app@gmail.com'

export type LegalKind = 'privacy' | 'terms'

const h2 = 'font-logo-sans text-xl font-bold uppercase tracking-tight mt-8'
const p = 'mt-3 text-base font-light leading-relaxed text-primary/80 dark:text-cream/80'
const li = 'mt-3 text-base font-light leading-relaxed text-primary/80 dark:text-cream/80 list-disc ml-5'

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const isPrivacy = kind === 'privacy'
  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 dark:text-cream/60">
        {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
      </p>
      <h1 className="display-bold font-logo-sans text-4xl sm:text-5xl font-bold uppercase tracking-tight mt-2">
        {isPrivacy ? 'How we handle your information' : 'Booking with Inea Scents'}
      </h1>
      <p className="mt-3 text-sm font-light text-primary/60 dark:text-cream/60">
        Version {PRIVACY_VERSION} · Effective {PRIVACY_EFFECTIVE_DATE}
      </p>

      {isPrivacy ? (
        <>
          <h2 className={h2}>1. Who we are</h2>
          <p className={p}>
            Inea Scents provides a perfume bar service reservation system. For questions about this
            policy or your information, contact us at {PRIVACY_CONTACT_EMAIL}.
          </p>
          <h2 className={h2}>2. What we collect</h2>
          <ul>
            <li className={li}>Booking contact details: name, email, phone, event date, time slot, headcount.</li>
            <li className={li}>Inquiry details: name, email, phone, event date, message.</li>
            <li className={li}>Payment references (booking reference and status). We never see or store card numbers — online payments are processed by PayMongo.</li>
          </ul>
          <h2 className={h2}>3. Why we use it</h2>
          <p className={p}>
            To take and confirm reservations, coordinate your event, process payments, and reply to
            inquiries. We do not sell your information and never share it except with the payment
            processors below.
          </p>
          <h2 className={h2}>4. Payment processors</h2>
          <p className={p}>
            Online payments go through PayMongo (cards, e-wallets such as GCash). Raw payment data
            stays with the processor.
          </p>
          <h2 className={h2}>5. How long we keep it</h2>
          <ul>
            <li className={li}>Inquiries with no activity: 24 months, then anonymized.</li>
            <li className={li}>Bookings: 36 months, then anonymized.</li>
            <li className={li}>Payment records: 12 months.</li>
          </ul>
          <h2 className={h2}>6. Your rights</h2>
          <p className={p}>
            You may ask for a copy of your information, correct it, or have it deleted. Email{' '}
            {PRIVACY_CONTACT_EMAIL} and we will act on verified requests.
          </p>
          <h2 className={h2}>7. Cookies and tracking</h2>
          <p className={p}>
            Our site stores only a theme preference on your device. We run no advertising trackers.
          </p>
          <h2 className={h2}>8. Breaches</h2>
          <p className={p}>
            If your information is ever exposed, we will notify you and the National Privacy
            Commission as required by law.
          </p>
        </>
      ) : (
        <>
          <h2 className={h2}>1. The service</h2>
          <p className={p}>
            We set up a perfume bar at your event location on your booked date. Scent choices,
            inclusions, and complimentary items follow the offering and headcount choice shown at
            booking time.
          </p>
          <h2 className={h2}>2. One booking per day</h2>
          <p className={p}>
            Our physical bar serves one event per calendar day. A date is yours once your booking is
            confirmed.
          </p>
          <h2 className={h2}>3. Payment</h2>
          <p className={p}>
            Pay online through the PayMongo checkout link sent after booking, or choose cash, which
            our team confirms directly.
          </p>
          <h2 className={h2}>4. Changes and cancellation</h2>
          <p className={p}>
            Contact us at {PRIVACY_CONTACT_EMAIL} to move or cancel a booking. Paid bookings
            cancelled by us are refunded through the original payment channel.
          </p>
          <h2 className={h2}>5. Your details</h2>
          <p className={p}>
            Give accurate contact details so we can reach you. How we store and protect them is
            described in our <a href="#/privacy" className="underline underline-offset-4">Privacy Policy</a>.
          </p>
          <h2 className={h2}>6. Contact</h2>
          <p className={p}>Questions about these terms: {PRIVACY_CONTACT_EMAIL}.</p>
        </>
      )}

      <p className="mt-10 text-sm font-light text-primary/60 dark:text-cream/60">
        <a href="#/privacy" className="underline underline-offset-4">Privacy</a>
        {' · '}
        <a href="#/terms" className="underline underline-offset-4">Terms</a>
        {' · '}
        <a href="#/" className="underline underline-offset-4">Back to home</a>
      </p>
    </main>
  )
}
