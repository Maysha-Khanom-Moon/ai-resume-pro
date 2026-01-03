import { Upload, Sparkles, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Simply drag and drop your resume or click to upload. We support PDF, DOCX, and TXT formats.',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'from-blue-50 to-cyan-50'
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes your resume for ATS compatibility, content quality, and optimization opportunities.',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    lightBg: 'from-purple-50 to-pink-50'
  },
  {
    number: '03',
    icon: Download,
    title: 'Get Results & Improve',
    description: 'Receive detailed feedback with actionable insights. Make improvements and re-analyze until perfect.',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    lightBg: 'from-green-50 to-emerald-50'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            How It Works
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Get professional resume feedback in three simple steps. No complexity, just results.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-900 dark:via-purple-900 dark:to-green-900 -translate-y-1/2 rounded-full" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center group hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="text-7xl font-bold text-slate-100 dark:text-slate-800 mb-6">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-linear-to-br ${step.lightBg} dark:bg-linear-to-br dark:${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <step.icon className={`w-10 h-10 text-${step.color}-600 dark:text-${step.color}-400`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Hidden on mobile and last item */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-slate-300 dark:text-slate-700 z-10">
                    <ArrowRight className="w-12 h-12" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 font-medium">
            Ready to optimize your resume?
          </p>
          <a 
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 text-lg"
          >
            Start Your Free Analysis
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}