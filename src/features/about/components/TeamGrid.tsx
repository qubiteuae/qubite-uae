import { useTranslation } from 'react-i18next'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'

interface TeamMember {
  name: string
  role: string
  bio: string
  photo: string
  email?: string
  expertiseHeading?: string
  expertise?: string[]
  visionHeading?: string
  visionBody?: string
  visionQuote?: string
}

// Photos and emails aren't translated, so they stay keyed by index against
// the localized name/role/bio coming from i18n.
const teamMeta: { photo: string; email?: string }[] = [
  { photo: '/team/tajo-adler.webp', email: 'tajo.adler@qubite-international.com' },
  { photo: '/team/melina-kiesslich.webp', email: 'melina.kiesslich@qubite-international.com' },
  { photo: '/team/rolf-maier.webp', email: 'rolf.maier@qubite-international.com' },
  { photo: '/team/diana-hanibauer.webp' },
  { photo: '/team/adina-sevelius.webp', email: 'adina.sevelius@qubite-international.com' },
  { photo: '/team/malte-findeisen.webp', email: 'malte.findeisen@qubite-international.com' },
  { photo: '/team/mischa-guidon.webp', email: 'mischa.guidon@qubite-international.com' },
  { photo: '/team/christoph-wolf.webp', email: 'chris.wolf@qubite-international.com' },
  { photo: '/team/mayur-mukherjee.webp', email: 'mayur.mukherjee@qubite-international.com' },
  { photo: '/team/disa-sevelius.webp', email: 'disa.sevelius@qubite-international.com' },
  { photo: '/team/hashifali-kojanikkanakath.webp', email: 'hashif@qubite-international.com' },
  { photo: '/team/mohammed-swalih.webp', email: 'mohammed.swalih@qubite-international.com' },
  { photo: '/team/sen-james.webp', email: 'sen.thomas@qubite-international.com' },
  { photo: '/team/megha-kumar.webp', email: 'megha.kumar@qubite-international.com' },
  { photo: '/team/mohammad-arshad.webp', email: 'mohammad.arshad@qubite-international.com' },
  { photo: '/team/abhijith-reghunath.webp', email: 'abhijith.reghunath@qubite-international.com' },
  { photo: '/team/lutz-stratmann.webp' },
]

function MailIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m2 4 6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TeamMemberProfile({ member }: { member: TeamMember }) {
  return (
    <Reveal className="w-full">
      <div className="flex w-full flex-col gap-8 rounded-2xl border border-white/8 bg-white/3 p-6 sm:flex-row sm:p-10">
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="mx-auto h-[260px] w-[260px] shrink-0 rounded-2xl border border-white/10 object-cover sm:mx-0"
        />

        <div className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black text-white sm:text-3xl">{member.name}</h3>
            <p className="text-xs font-bold tracking-wide text-accent-bronze-tint uppercase">{member.role}</p>
          </div>

          <p className="text-sm leading-relaxed text-text-dim sm:text-base">{member.bio}</p>

          {member.expertise?.length ? (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-white">{member.expertiseHeading}</h4>
              <ul className="flex flex-col gap-1.5">
                {member.expertise.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-dim">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-copper" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {member.visionBody ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <h4 className="text-sm font-bold text-white">{member.visionHeading}</h4>
              <p className="text-sm leading-relaxed text-text-dim">{member.visionBody}</p>
              {member.visionQuote ? (
                <p className="text-sm font-semibold text-accent-bronze-tint">{member.visionQuote}</p>
              ) : null}
            </div>
          ) : null}

          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-white/30"
            >
              <MailIcon className="size-3.5" />
              {member.email}
            </a>
          ) : null}
        </div>
      </div>
    </Reveal>
  )
}

export function TeamGrid() {
  const { t } = useTranslation()
  const team: TeamMember[] = (
    t('about.team.members', { returnObjects: true }) as Omit<TeamMember, 'photo' | 'email'>[]
  ).map((member, i) => ({ ...member, ...teamMeta[i] }))

  const featured = team.filter((member) => member.expertise?.length || member.visionBody)

  return (
    <section className="relative bg-bg py-24">
      <Container className="relative flex flex-col items-center gap-8">
        <Reveal className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-[28px]">{t('about.team.heading')}</h2>
          <p className="mt-2 text-sm text-text-subtle">{t('about.team.paragraph')}</p>
        </Reveal>

        {/* flex-wrap + justify-center rather than a fixed-column grid: the
            team's size isn't a multiple of any column count, and a grid
            leaves an orphaned card stranded on the left in the last row —
            this centers whatever's left over instead. */}
        <div className="flex w-full flex-wrap justify-center gap-5">
          {team.map((member, i) => (
            <Reveal
              key={member.name}
              delay={(i % 4) * 80}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
            >
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/15">
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="size-20 rounded-full border border-white/10 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-white">{member.name}</h3>
                  <p className="text-[11px] font-semibold tracking-wide text-accent-bronze-tint uppercase">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-text-dim">{member.bio}</p>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    aria-label={`Email ${member.name}`}
                    className="mt-auto flex size-8 items-center justify-center rounded-full border border-white/10 text-text-subtle transition-all duration-200 hover:border-white/30 hover:text-white"
                  >
                    <MailIcon />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        {featured.map((member) => (
          <TeamMemberProfile key={member.name} member={member} />
        ))}
      </Container>
    </section>
  )
}
