'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Instagram,
  MessageCircle,
  ArrowUp,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    services: [
      { name: 'Web Development', href: '/services#web' },
      { name: 'Mobile Apps', href: '/services#mobile' },
      { name: 'SaaS Solutions', href: '/services#saas' },
      { name: 'Database Solutions', href: '/services#database' }
    ],
    resources: [
      { name: 'Articles', href: '/articles' },
      { name: 'Case Studies', href: '/portfolio' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Support', href: '/support' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  }

  const socialLinks = [
    { icon: MessageCircle, href: 'https://wa.me/919335819686', label: 'WhatsApp' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ]

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-black text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 py-8 sm:py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2">Ready to Start Your Project?</h3>
              <p className="text-sm sm:text-base text-white/90">Let's build something amazing together</p>
            </div>
            <Link href="/contact" className="btn-secondary whitespace-nowrap px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-10 sm:py-16">
        {/* Company Info & Newsletter */}
        <div className="mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white px-2.5 py-1.5 rounded-lg inline-block">
                  <Image
                    src="/logo.jpg"
                    alt="Digital Purohit Logo"
                    width={150}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <Link href="/admin/login" className="font-display font-bold text-xl hover:text-primary-400 transition-colors">
                  Digital Purohit
                </Link>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed max-w-md">
                Building intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a href="mailto:digitalpurohit1@gmail.com" className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors group">
                  <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm break-all">digitalpurohit1@gmail.com</span>
                </a>
                <a href="tel:9335819686" className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors group">
                  <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">+91 93358 19686</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">993 Meerapur, Prayagraj</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Stay Connected</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates, insights, and exclusive content delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 text-sm bg-dark-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button className="btn-primary px-6 py-3 text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links - Desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Links - Mobile Accordion */}
        <div className="md:hidden space-y-3 mb-10">
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key} className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-4 bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <span className="font-display font-semibold text-sm capitalize">{key}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === key ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openSection === key ? 'max-h-48' : 'max-h-0'}`}>
                <ul className="p-4 space-y-2 bg-dark-900">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors block">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © 2026 Digital Purohit. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-primary-500/50 transition-all group"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5 text-white group-hover:translate-y-[-2px] transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
