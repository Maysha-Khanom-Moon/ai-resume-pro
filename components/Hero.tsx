import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-20 md:pt-28 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-blue-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent via-blue-50/20 dark:via-blue-950/20 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/10">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Resume Analysis</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Land Your Dream Job with
                <span className="block mt-3 bg-linear-to-r from-blue-600 via-cyan-600 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Perfect Resumes
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get instant AI-powered feedback, optimize your resume for ATS systems, 
                and increase your interview chances by 3x. Join 50,000+ job seekers who landed their dream roles.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 font-semibold bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all group">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base px-8 py-6 font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all"
                >
                  View Examples
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
              {[
                { icon: CheckCircle2, text: '50K+ Users', color: 'text-green-600 dark:text-green-400' },
                { icon: Star, text: '4.9/5 Rating', color: 'text-yellow-600 dark:text-yellow-400' },
                { icon: CheckCircle2, text: '3x More Interviews', color: 'text-blue-600 dark:text-blue-400' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="relative bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/50 backdrop-blur">
              {/* Mock Resume Preview */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-green-500/30">
                    A+
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Excellent Resume!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your resume scores 95/100</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                  {[
                    { label: 'ATS Optimization', score: 98, color: 'from-green-500 to-emerald-500' },
                    { label: 'Content Quality', score: 92, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Format & Design', score: 95, color: 'from-purple-500 to-pink-500' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.score}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full bg-linear-to-r ${item.color} rounded-full shadow-lg transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      AI Analysis Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-linear-to-r from-orange-500 to-pink-500 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-orange-500/50 rotate-3">
                Free Trial
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-400/30 dark:bg-cyan-500/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}