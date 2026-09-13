import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ConsentBanner } from '@/components/ConsentBanner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  )
}
