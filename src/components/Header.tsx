import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/Container'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'
import { trackWhatsAppClick } from '@/lib/analytics'
import { localizePath, stripLangPrefix } from '@/lib/i18nPaths'
import { TELEGRAM_LINK, WHATSAPP_LINK } from '@/lib/links'

const languages = [
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'ar', label: 'AR', fullLabel: 'العربية' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.943c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.586 0 11.945-5.36 11.949-11.944a11.876 11.876 0 0 0-3.481-8.402" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M14.5 2 1.8 6.9c-.6.24-.58.98.02 1.18l3.16 1.05 1.2 3.88c.15.5.8.6 1.1.17l1.6-2.3 3.2 2.36c.42.31 1.02.08 1.13-.43L14.5 2Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M5 9.1 12.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M3 8.5V7a5 5 0 0 1 10 0v1.5M3 8.5v3a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3Zm10 0v3a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H13Zm-1 4.5v.5a1.5 1.5 0 0 1-1.5 1.5H8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon({ className = 'size-2.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" className={className} fill="none" aria-hidden="true">
      <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigating to the /ar-prefixed (or unprefixed) equivalent of the current
  // path — rather than only calling i18n.changeLanguage — keeps the URL and
  // displayed language in sync, which is what makes /ar/... a real,
  // guaranteed-Arabic landing page instead of a client-side-only toggle.
  function switchTo(lang: string) {
    navigate(localizePath(stripLangPrefix(location.pathname), lang) + location.search)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 text-[13px] text-white transition-colors hover:text-accent-bronze-tint"
      >
        <img src="/figma/hero/globe.svg" alt="" className="size-3.5" />
        {current.label}
        <ChevronDownIcon className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        role="listbox"
        className={`absolute top-full right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-150 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="option"
            aria-selected={lang.code === i18n.language}
            onClick={() => switchTo(lang.code)}
            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
              lang.code === i18n.language ? 'bg-white/8 text-white' : 'text-text-dim hover:bg-white/5 hover:text-white'
            }`}
          >
            {lang.fullLabel}
          </button>
        ))}
      </div>
    </div>
  )
}

// Mobile menu lives inside an `overflow-hidden` collapsing panel, which would
// clip an absolutely-positioned dropdown popover — so mobile gets a plain
// inline segmented toggle instead of the popover used on desktop.
function LanguageToggle() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 text-[13px]">
      <img src="/figma/hero/globe.svg" alt="" className="size-3.5" />
      <div className="flex overflow-hidden rounded-full border border-border-strong">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => navigate(localizePath(stripLangPrefix(location.pathname), lang.code) + location.search)}
            className={`px-3 py-1.5 font-semibold transition-colors ${
              lang.code === i18n.language ? 'bg-white text-black' : 'text-white hover:bg-white/10'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { t, i18n } = useTranslation()
  const toLang = useLocalizedPath()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: t('header.nav.discoverMachines'), href: toLang('/asic-machines'), internal: true },
    { label: t('header.nav.hosting'), href: toLang('/hosting'), internal: true },
    { label: t('header.nav.aboutUs'), href: toLang('/about'), internal: true },
  ]

  const contactLinks = [
    {
      label: t('header.contact.whatsapp'),
      href: WHATSAPP_LINK,
      icon: WhatsAppIcon,
      onClick: () => trackWhatsAppClick('header_whatsapp', i18n.language),
    },
    { label: t('header.contact.telegram'), href: TELEGRAM_LINK, icon: TelegramIcon, onClick: undefined },
    {
      label: t('header.contact.talkToHuman'),
      href: WHATSAPP_LINK,
      icon: HeadsetIcon,
      onClick: () => trackWhatsAppClick('header_talk_to_human', i18n.language),
    },
  ]

  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-transparent">
      <Container className="flex h-18 items-center justify-between md:h-21">
        <Link
          to={toLang('/')}
          onClick={() => setMenuOpen(false)}
          className="flex items-center transition-transform duration-200 hover:scale-105"
        >
          <img src="/figma/hero/logo.png" alt="Qubite" className="h-9 w-auto object-contain md:h-[42px]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const className =
              'group relative flex items-center gap-1.5 py-1 text-sm text-white transition-colors hover:text-accent-bronze-tint'
            const content = (
              <>
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-bronze-tint transition-all duration-300 group-hover:w-full" />
              </>
            )

            return link.internal ? (
              <Link key={link.label} to={link.href} className={className}>
                {content}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className={className}>
                {content}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden items-center gap-2 md:flex">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={link.onClick}
                aria-label={link.label}
                title={link.label}
                className="flex size-9 items-center justify-center rounded-full border border-border-strong text-white transition-all duration-200 hover:border-white hover:bg-white/5 active:scale-90"
              >
                <link.icon />
              </a>
            ))}
          </div>

          <LanguageSwitcher />

          <button
            type="button"
            aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-8 items-center justify-center rounded-full border border-border-strong text-white transition-all duration-200 hover:border-white hover:bg-white/5 active:scale-90 md:hidden"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M3 3L13 13M13 3 3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 4h12M2 8h12M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <nav className="overflow-hidden border-t border-white/8 bg-black/95 backdrop-blur-sm">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) =>
              link.internal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-white transition-colors hover:bg-white/5 hover:text-accent-bronze-tint"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-white transition-colors hover:bg-white/5 hover:text-accent-bronze-tint"
                >
                  {link.label}
                </a>
              ),
            )}
            <div className="mt-2 flex items-center gap-2 border-t border-white/8 px-3 pt-4 md:hidden">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  aria-label={link.label}
                  title={link.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border-strong text-white transition-all duration-200 hover:border-white hover:bg-white/5 active:scale-90"
                >
                  <link.icon />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-white/8 px-3 pt-4 sm:hidden">
              <LanguageToggle />
            </div>
          </Container>
        </nav>
      </div>
    </header>
  )
}
