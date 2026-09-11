import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'

function FooterLink({ label, href, internal }: { label: string; href: string; internal?: boolean }) {
  const className =
    'group relative w-fit text-sm font-medium text-text-slate transition-colors hover:text-white'
  const content = (
    <>
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
    </>
  )

  return internal ? (
    <Link to={href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={href} className={className}>
      {content}
    </a>
  )
}

export function Footer() {
  const { t } = useTranslation()

  const productLinks = [
    { label: t('footer.links.discoverMachines'), href: '/asic-machines', internal: true },
    { label: t('footer.links.hosting'), href: '/hosting', internal: true },
  ]

  const companyLinks = [
    { label: t('footer.links.about'), href: '/about', internal: true },
    { label: t('footer.links.locations'), href: '/about#locations', internal: true },
    { label: t('footer.links.contact'), href: '/about#contact', internal: true },
    // { label: t('footer.links.careers'), href: '/careers' },
    // { label: t('footer.links.returnPolicy'), href: '/return-policy' },
    // { label: t('footer.links.imprint'), href: '/imprint' },
    { label: t('footer.links.privacyPolicy'), href: '/privacy-policy' },
    { label: t('footer.links.terms'), href: '/terms' },
    { label: t('footer.links.community'), href: '/community' },
  ]

  return (
    <footer className="bg-[#090909]">
      <Container className="flex flex-col gap-12 py-24">
        <div className="flex flex-col items-start gap-6">
          <img
            src="/figma/footer/logo.png"
            alt="Qubite"
            className="h-[42px] w-auto object-contain transition-transform duration-200 hover:scale-105"
          />
          <p className="max-w-120 text-base leading-relaxed text-text-slate">{t('footer.tagline')}</p>
          <div className="flex items-center gap-2">
            {['IN', 'IG'].map((label) => (
              <a
                key={label}
                href={label === 'IN' ? 'https://linkedin.com' : 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex items-center justify-center rounded-[20px] border border-border-slate px-4 py-2 text-xs font-semibold text-[#f8fafc] transition-all duration-200 hover:border-white hover:bg-white/5 active:scale-95"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border-slate" />

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold text-text-faint uppercase">{t('footer.products')}</span>
            <nav className="flex flex-wrap gap-8">
              {productLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold text-text-faint uppercase">{t('footer.company')}</span>
            <nav className="flex flex-wrap gap-8">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border-slate pt-6">
          <p className="text-xs text-text-faint">{t('footer.registeredAddress')}</p>
          <p className="text-xs text-text-faint">{t('footer.copyright')}</p>
        </div>
      </Container>
    </footer>
  )
}
