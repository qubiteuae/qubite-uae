import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/Badge'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'
import { WHATSAPP_LINK } from '@/lib/links'

const CONTACT_EMAIL = 'info@qubite-international.com'
const CONTACT_PHONE = '+971 55 661 5745'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

function MailIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m2 4 6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M3.5 2h2l1 3-1.5 1.2a8 8 0 0 0 4.8 4.8L11 9.5l3 1v2a1.5 1.5 0 0 1-1.6 1.5A11.5 11.5 0 0 1 2 3.6 1.5 1.5 0 0 1 3.5 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 14.5S13 9.9 13 6.5a5 5 0 0 0-10 0C3 9.9 8 14.5 8 14.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function pushContactFormSubmitEvent(language: string) {
  const win = window as unknown as { dataLayer?: unknown[] }
  win.dataLayer = win.dataLayer ?? []
  win.dataLayer.push({
    event: 'contact_form_submit',
    form_name: 'contact',
    page_url: window.location.href,
    language,
  })
}

export function ContactSection() {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const contactInfo = [
    { icon: MailIcon, label: t('about.contact.email'), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: PhoneIcon, label: t('about.contact.phone'), value: CONTACT_PHONE, href: 'tel:+971556615745' },
    { icon: PinIcon, label: t('about.contact.region'), value: t('about.contact.regionValue') },
    { icon: PinIcon, label: t('about.contact.registeredAddress'), value: t('about.contact.registeredAddressValue') },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent || status === 'sending') return

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, honeypot, language: i18n.language, pageUrl: window.location.href }),
      })
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null

      if (response.ok && data?.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
        setConsent(false)
        pushContactFormSubmitEvent(i18n.language)
      } else {
        setStatus('error')
        setErrorMessage(data?.error || t('about.contact.form.errorGeneric'))
      }
    } catch {
      setStatus('error')
      setErrorMessage(t('about.contact.form.errorGeneric'))
    }
  }

  return (
    <section id="contact" className="relative bg-bg py-24 scroll-mt-20">
      <Container className="relative flex flex-col items-center gap-4 text-center">
        <Reveal>
          <Badge tone="bronze">{t('about.contact.badge')}</Badge>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{t('about.contact.heading')}</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="max-w-[560px] text-sm text-text-dim">{t('about.contact.paragraph')}</p>
        </Reveal>

        <div className="mt-10 grid w-full max-w-[960px] grid-cols-1 gap-8 text-left lg:grid-cols-[minmax(0,320px)_1fr]">
          <Reveal delay={200} className="flex flex-col gap-4">
            {contactInfo.map((item) => {
              const Icon = item.icon
              const content = (
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(232,167,101,0.35)] bg-[rgba(232,167,101,0.1)] text-[#e8a765]">
                    <Icon />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{item.label}</span>
                    <span className="text-sm font-medium text-white">{item.value}</span>
                  </div>
                </div>
              )
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (item.href.startsWith('tel:')) trackPhoneClick('about_contact_page')
                  }}
                  className="transition-opacity duration-200 hover:opacity-80"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              )
            })}

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('about_contact_page', i18n.language)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-accent-bronze px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              {t('about.contact.talkToHumanWhatsapp')}
            </a>
          </Reveal>

          <Reveal delay={260}>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[rgba(74,222,128,0.3)] bg-[rgba(34,197,94,0.08)] p-8 text-center">
                <span className="text-base font-bold text-white">{t('about.contact.form.successTitle')}</span>
                <p className="text-sm text-text-dim">{t('about.contact.form.successBody')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-6">
                {/* Honeypot: visually hidden (not display:none) so basic bots that skip hidden fields still find and fill it. */}
                <label className="sr-only" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('about.contact.form.name')}</span>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t('about.contact.form.namePlaceholder')}
                      className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] px-4 py-2.5 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('about.contact.form.email')}</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t('about.contact.form.emailPlaceholder')}
                      className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] px-4 py-2.5 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('about.contact.form.subject')}</span>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={t('about.contact.form.subjectPlaceholder')}
                    className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[#17130f] px-4 py-2.5 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-wide text-text-faint uppercase">{t('about.contact.form.message')}</span>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('about.contact.form.messagePlaceholder')}
                    className="resize-none rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#17130f] px-4 py-3 text-sm text-white placeholder:text-text-faint focus:border-accent-cyan/40 focus:outline-none"
                  />
                </label>

                <label className="flex items-start gap-2.5 text-xs text-text-dim">
                  <input
                    required
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 size-3.5 shrink-0 accent-accent-bronze"
                  />
                  <span>
                    {t('about.contact.form.consent')}{' '}
                    <a href={toLang('/privacy-policy')} className="font-semibold text-white underline underline-offset-2">
                      {t('about.contact.form.consentLinkLabel')}
                    </a>
                    .
                  </span>
                </label>

                {status === 'error' ? <p className="text-xs font-medium text-[#f87171]">{errorMessage}</p> : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-accent-bronze px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? t('about.contact.form.sending') : t('about.contact.form.send')}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
