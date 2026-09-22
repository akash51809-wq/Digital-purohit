import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import About from '@/components/sections/About'

export const metadata = {
  title: 'About Us - Veliora TechWorks',
  description: 'Learn about Veliora TechWorks, our mission, vision, and the team behind our innovative technology solutions.',
}

export default function AboutPage() {
  return (
    <main>
      <Header />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
    </main>
  )
}