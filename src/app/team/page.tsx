'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Linkedin, Github, Mail, MapPin, Users, Award, Target, ExternalLink, Phone } from 'lucide-react'
import Image from 'next/image'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cultureImage, setCultureImage] = useState<string>('')

  useEffect(() => {
    // Fetch team members
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching team members:', error)
        setLoading(false)
      })

    // Fetch culture image from media
    fetch('/api/media?category=culture')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCultureImage(data[0].url)
        }
      })
      .catch(console.error)
  }, [])

  const stats = [
    { icon: Users, label: 'Team Members', value: `${teamMembers.length}+` },
    { icon: Award, label: 'Years Experience', value: '1+' },
    { icon: Target, label: 'Projects Delivered', value: '5+' }
  ]

  return (
    <main>
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-dark-800 mb-6">
              Meet Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-dark-600 mb-8">
              Passionate professionals dedicated to building innovative solutions and driving digital transformation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-display font-bold text-dark-800 mb-2">{stat.value}</div>
                  <div className="text-dark-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-800 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Meet the talented individuals who drive our mission forward with expertise, creativity, and dedication.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600">No team members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Full Image Section */}
                  <div className="relative h-80 overflow-hidden bg-gray-50">
                    {member.image && member.image.trim() ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 via-accent-100 to-primary-200 flex items-center justify-center">
                        <div className="text-4xl font-display font-bold text-primary-600">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 hover:bg-white hover:scale-110 transition-all duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-all duration-300"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Name & Role */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-display font-bold text-dark-800 mb-2">
                        {member.name}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold rounded-full">
                        {member.role}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-dark-600 text-sm leading-relaxed text-center mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-100">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 group/email"
                      >
                        <Mail className="w-4 h-4 mr-2 group-hover/email:scale-110 transition-transform" />
                        <span className="font-medium">{member.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-800 mb-6">
                Our Culture & Values
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-semibold text-dark-800 mb-2">Innovation First</h3>
                  <p className="text-dark-600">We embrace cutting-edge technologies and creative solutions to solve complex challenges.</p>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-dark-800 mb-2">Collaborative Spirit</h3>
                  <p className="text-dark-600">We believe in the power of teamwork and open communication to achieve exceptional results.</p>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-dark-800 mb-2">Continuous Learning</h3>
                  <p className="text-dark-600">We invest in our team's growth through training, conferences, and skill development programs.</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
              {cultureImage ? (
                <Image
                  src={cultureImage}
                  alt="Our Culture & Values"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-display font-bold text-gray-400/30">Team</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            We're always looking for talented individuals who share our passion for innovation.
          </p>
          <a
            href="/careers"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span>View Open Positions</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}