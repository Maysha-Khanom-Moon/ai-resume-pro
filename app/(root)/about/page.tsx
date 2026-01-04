// app/about/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About AI Resume Pro
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Empowering job seekers and recruiters with AI-powered solutions
                for smarter hiring and better career opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">Our Mission</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    Transforming the Job Search Experience
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                    We believe that finding the right job or the perfect candidate 
                    shouldn't be a frustrating, time-consuming process. Our mission 
                    is to leverage cutting-edge AI technology to make hiring more 
                    efficient, fair, and successful for everyone involved.
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Whether you're a job seeker looking to stand out or a recruiter 
                    searching for top talent, AI Resume Pro provides the tools and 
                    insights you need to succeed.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Zap className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          AI-Powered
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Next-generation technology for smarter hiring
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Our Core Values
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: 'User-Centric',
                    description: 'We put our users first in every decision we make'
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: 'Trust & Privacy',
                    description: 'Your data security and privacy are our top priorities'
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: 'Innovation',
                    description: 'Constantly evolving with the latest AI technology'
                  },
                  {
                    icon: <Globe className="w-8 h-8" />,
                    title: 'Accessibility',
                    description: 'Making professional tools available to everyone'
                  }
                ].map((value, index) => (
                  <div 
                    key={index}
                    className="text-center p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { number: '10,000+', label: 'Active Users' },
                  { number: '50,000+', label: 'Resumes Analyzed' },
                  { number: '5,000+', label: 'Jobs Posted' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xl text-blue-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Our Team</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Built by Experts
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  A diverse team of engineers, designers, and HR professionals 
                  passionate about revolutionizing recruitment.
                </p>
              </div>

              <div className="text-center p-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                <Award className="w-16 h-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Join Our Growing Team
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  We're always looking for talented individuals who share our vision.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}