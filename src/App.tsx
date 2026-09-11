import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/components/RootLayout'
import { AboutPage } from '@/features/about/AboutPage'
import { AsicMachinesPage } from '@/features/asic-machines/AsicMachinesPage'
import { ProductDetailPage } from '@/features/asic-machines/ProductDetailPage'
import { HomePage } from '@/features/home/HomePage'
import { HostingPage } from '@/features/hosting/HostingPage'
import { PrivacyPolicyPage } from '@/features/legal/PrivacyPolicyPage'
import { TermsPage } from '@/features/legal/TermsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/asic-machines" element={<AsicMachinesPage />} />
          <Route path="/asic-machines/:slug" element={<ProductDetailPage />} />
          <Route path="/hosting" element={<HostingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
