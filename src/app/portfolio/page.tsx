import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Portfolio from '@/components/sections/Portfolio'

export const metadata = {
  title: 'Portfolio - Digital Purohit',
  description: 'View our portfolio of successful projects and case studies showcasing our expertise in technology solutions.',
}

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <div className="pt-20">
        <Portfolio showAll />
      </div>
      <Footer />
    </main>
  )
}