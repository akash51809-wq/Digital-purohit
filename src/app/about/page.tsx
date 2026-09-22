import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import About from '@/components/sections/About'

export const metadata = {
  title: 'About Us - Digital Purohit',
  description: 'Learn about Digital Purohit, our mission, vision, and the team behind our innovative technology solutions.',
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