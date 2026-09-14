import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'
import { useLocalizedPath } from '@/hooks/useLocalizedPath'

interface LegalTable {
  columns: string[]
  rows: string[][]
}

interface LegalSection {
  heading: string
  body: string
  table?: LegalTable
  /** Prose that continues after the table, e.g. caveats about the legal bases listed above. */
  bodyAfter?: string
}

export function LegalPage({ contentKey }: { contentKey: 'privacyPolicy' | 'terms' }) {
  const { t } = useTranslation()
  const toLang = useLocalizedPath()
  const sections = t(`legal.${contentKey}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <div className="bg-bg pt-24 pb-24">
      <Container className="max-w-[760px]">
        <Link to={toLang('/')} className="text-xs font-semibold text-accent-bronze-tint transition-colors hover:text-white">
          &larr; {t('legal.backHome')}
        </Link>

        <h1 className="mt-4 text-[32px] font-black text-white sm:text-[40px]">{t(`legal.${contentKey}.title`)}</h1>
        <p className="mt-2 text-xs text-text-faint">{t('legal.lastUpdated')}</p>

        <p className="mt-6 text-sm leading-relaxed whitespace-pre-line text-text-dim">{t(`legal.${contentKey}.intro`)}</p>

        <div className="mt-8 flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-white">{section.heading}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-text-dim">{section.body}</p>
              {section.table ? (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs tracking-wide text-text-faint uppercase">
                        {section.table.columns.map((column) => (
                          <th key={column} className="px-3 py-2 font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]} className="border-b border-white/5 align-top">
                          {row.map((cell, i) => (
                            <td key={i} className="px-3 py-3 whitespace-pre-line text-text-dim">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {section.bodyAfter ? (
                <p className="text-sm leading-relaxed whitespace-pre-line text-text-dim">{section.bodyAfter}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
