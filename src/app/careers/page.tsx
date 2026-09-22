'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Heart, 
  Zap, 
  Coffee, 
  Laptop,
  GraduationCap,
  Shield,
  ArrowRight,
  Mail,
  Briefcase,
  Star,
  Award,
  Target
} from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  experience: string
  isActive: boolean
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [teamCount, setTeamCount] = useState(0)

  useEffect(() => {
    fetchJobs()
    fetchTeamCount()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamCount = async () => {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      setTeamCount(data.length)
    } catch (error) {
      console.error('Error fetching team count:', error)
    }
  }

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: Laptop,
      title: 'Remote Flexibility',
      description: 'Hybrid work model with flexible hours and modern equipment provided'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Growth',
      description: 'Training budget, conference attendance, and skill development programs'
    },
    {
      icon: Coffee,
      title: 'Great Perks',
      description: 'Free meals, team outings, game room, and unlimited coffee'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'Market-leading salaries, performance bonuses, and equity options'
    },
    {
      icon: Shield,
      title: 'Job Security',
      description: 'Stable employment, career progression paths, and retirement planning'
    }
  ]

  const departments = ['All', ...Array.from(new Set(jobs.map(job => job.department)))]
  
  const filteredJobs = selectedDepartment === 'All' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment)

  const stats = [
    { icon: Users, label: 'Team Members', value: `${teamCount}+`, color: 'from-blue-500 to-blue-600' },
    { icon: Briefcase, label: 'Open Positions', value: jobs.length.toString(), color: 'from-green-500 to-green-600' },
    { icon: Star, label: 'Employee Rating', value: '4.9/5', color: 'from-yellow-500 to-yellow-600' },
    { icon: Award, label: 'Years in Business', value: '8+', color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              Join Our Growing Team
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-dark-800 mb-6 leading-tight px-4">
              Build Your <span className="gradient-text">Career</span> With Us
            </h1>
            <p className="text-lg sm:text-xl text-dark-600 mb-10 leading-relaxed px-4">
              Join a team of passionate innovators who are shaping the future of technology. 
              We offer exciting opportunities, competitive benefits, and a culture of growth.
            </p>
            
            {/* Stats Grid - Mobile/Tablet Optimized */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 mb-12 px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-xl sm:text-3xl font-display font-bold text-dark-800 mb-1">{stat.value}</div>
                  <div className="text-dark-600 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <a
                href="#positions"
                className="btn-primary inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              >
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#benefits"
                className="btn-secondary inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Our Benefits</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6">
              Why Choose <span className="gradient-text">Veliora</span>?
            </h2>
            <p className="text-lg sm:text-xl text-dark-600 max-w-3xl mx-auto">
              We believe in creating an environment where our team can thrive, grow, and make meaningful impact while enjoying exceptional benefits.
            </p>
          </div>

          {/* Mobile/Tablet: Stack Layout */}
          <div className="lg:hidden space-y-4 sm:space-y-6 px-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-dark-800 mb-2 sm:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-dark-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-dark-800 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-dark-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6">
              Open <span className="gradient-text">Positions</span>
            </h2>
            <p className="text-lg sm:text-xl text-dark-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Find your next opportunity and join our growing team of innovators and problem solvers.
            </p>
            
            {departments.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                      selectedDepartment === dept
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                        : 'bg-white text-dark-600 hover:bg-gray-100 border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Loading positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Open Positions</h3>
              <p className="text-gray-500 mb-6">We don't have any open positions at the moment, but we're always looking for exceptional talent.</p>
              <a
                href="mailto:careers@veliora-techworks.com"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Your Resume</span>
              </a>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 px-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200">
                  <div className="p-5 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 sm:gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                          <h3 className="text-xl sm:text-2xl font-display font-bold text-dark-800">
                            {job.title}
                          </h3>
                          <span className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold w-fit">
                            {job.department}
                          </span>
                        </div>
                        
                        <p className="text-sm sm:text-base text-dark-600 mb-4 sm:mb-6 leading-relaxed">{job.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-500 flex-shrink-0" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-500 flex-shrink-0" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm sm:text-base">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary-500 flex-shrink-0" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mb-4 sm:mb-6">
                            <h4 className="font-semibold text-dark-800 mb-2 sm:mb-3 text-sm sm:text-base">Requirements:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, reqIndex) => (
                                <span key={reqIndex} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <a
                          href={`mailto:careers@veliora-techworks.com?subject=Application for ${job.title}&body=Hi, I'm interested in the ${job.title} position.`}
                          className="btn-primary inline-flex items-center justify-center space-x-2 flex-1 sm:flex-none sm:min-w-[140px] py-2 sm:py-3 text-sm sm:text-base"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Apply Now</span>
                        </a>
                        <button className="btn-secondary flex-1 sm:flex-none sm:min-w-[120px] py-2 sm:py-3 text-sm sm:text-base">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6">
              Don't See Your Perfect Role?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
              We're always looking for exceptional talent to join our team. Send us your resume and let's explore opportunities together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:careers@veliora-techworks.com"
                className="btn-secondary inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Send Your Resume</span>
              </a>
              <a
                href="/team"
                className="inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Meet Our Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}