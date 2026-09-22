import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Services from '@/components/sections/Services'

export const metadata = {
  title: 'Our Services - Veliora TechWorks',
  description: 'Explore our comprehensive technology services including web development, mobile apps, SaaS solutions, and more.',
}

export default function ServicesPage() {
  return (
    <main>
      <Header />
      <div className="pt-20">
        <Services />
      </div>
      <Footer />
    </main>
  )
}