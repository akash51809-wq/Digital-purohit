import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Contact from '@/components/sections/Contact'

export const metadata = {
  title: 'Contact Us - Veliora TechWorks',
  description: 'Get in touch with Veliora TechWorks for your technology needs. Contact us for consultations and project inquiries.',
}

export default function ContactPage() {
  return (
    <main>
      <Header />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </main>
  )
}