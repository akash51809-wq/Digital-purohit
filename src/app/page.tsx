import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Portfolio from '@/components/sections/Portfolio'
import Contact from '@/components/sections/Contact'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const revalidate = 300 // Revalidate every 5 minutes

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio limit={2} />
      <Contact />
      <Footer />
    </main>
  )
}