import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const benefits = [
  'Free forever for basic features',
  'No credit card required',
  'Instant AI-powered feedback',
  'Export optimized resumes',
  'ATS compatibility check',
  'Privacy guaranteed'
];

export default function CTA() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-400/20 via-cyan-400/10 to-transparent dark:from-blue-500/20 dark:via-cyan-500/10 dark:to-transparent" />
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/50 relative overflow-hidden backdrop-blur">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-transparent dark:from-blue-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-cyan-500/10 to-transparent dark:from-cyan-500/20 rounded-full blur-3xl -z-10" />

          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/10">
              <Sparkles className="w-4 h-4" />
              <span>Start Your Success Story Today</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Ready to Get More
                <span className="block mt-2 bg-linear-to-r from-blue-600 via-cyan-600 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Job Interviews?
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Join 50,000+ professionals who transformed their resumes and landed dream jobs. 
                Start your free analysis today!
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto py-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-left p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-12 py-7 font-semibold bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all group"
                >
                  Start Free Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-12 py-7 font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-6 flex-wrap pt-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="font-medium">100% secure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="font-medium">Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}