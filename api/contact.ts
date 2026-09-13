import type { VercelRequest, VercelResponse } from '@vercel/node'

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? 'info@qubite-international.com'
// Swap this for your own verified sending domain once one is added in Resend
// (Settings > Domains) — onboarding@resend.dev works out of the box but has
// limited deliverability and is meant for getting started only.
const RESEND_FROM = process.env.RESEND_FROM ?? 'Qubite Website <onboarding@resend.dev>'

interface ContactPayload {
  name?: string
  email?: string
  subject?: string
  message?: string
  honeypot?: string
  language?: string
  pageUrl?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured')
    return res.status(500).json({ ok: false, error: 'Contact form is not configured yet' })
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as ContactPayload | undefined
  const { name, email, subject, message, honeypot, language, pageUrl } = body ?? {}

  // Honeypot: a field hidden from real visitors via CSS. Bots that fill in
  // every field get a fake success response instead of a request that reveals
  // the validation rules.
  if (honeypot) {
    return res.status(200).json({ ok: true })
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' })
  }

  const safeSubject = subject?.trim() || 'New website inquiry'

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `[Qubite Contact Form] ${safeSubject}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${safeSubject}`,
          `Language: ${language ?? 'unknown'}`,
          `Page: ${pageUrl ?? 'unknown'}`,
          '',
          message,
        ].join('\n'),
      }),
    })

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text()
      console.error('Resend API error:', resendResponse.status, errorBody)
      return res.status(502).json({ ok: false, error: 'Failed to send message' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact form send failed:', err)
    return res.status(500).json({ ok: false, error: 'Failed to send message' })
  }
}
