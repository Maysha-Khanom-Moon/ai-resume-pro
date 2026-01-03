import { Sparkles, Target, Zap, Shield, TrendingUp, FileText } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI scans your resume for improvements, suggests better keywords, and optimizes content for maximum impact.',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: Target,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with our specialized formatting and keyword optimization.',
    gradient: 'from-purple-500 to-pink-500',
    lightBg: 'from-purple-50 to-pink-50',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get comprehensive feedback in seconds. No waiting, no hassle. Upload and receive detailed insights immediately.',
    gradient: 'from-orange-500 to-red-500',
    lightBg: 'from-orange-50 to-red-50',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and secure. We never share your information. Delete your data anytime with one click.',
    gradient: 'from-green-500 to-emerald-500',
    lightBg: 'from-green-50 to-emerald-50',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    icon: TrendingUp,
    title: 'Success Tracking',
    description: 'Track your improvements over time. See how each change impacts your score and interview success rate.',
    gradient: 'from-indigo-500 to-purple-500',
    lightBg: 'from-indigo-50 to-purple-50',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    icon: FileText,
    title: 'Multiple Formats',
    description: 'Support for PDF, DOCX, and TXT files. Works with any resume format and provides consistent analysis.',
    gradient: 'from-pink-500 to-rose-500',
    lightBg: 'from-pink-50 to-rose-50',
    iconColor: 'text-pink-600 dark:text-pink-400'
  }
];

export default function Features() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Everything You Need to
            <span className="block mt-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Stand Out
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Professional-grade tools powered by AI to help you create resumes that get noticed by recruiters and pass ATS systems.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon with Gradient Background */}
              <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.lightBg} dark:bg-linear-to-br dark:${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className={`w-full h-full ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-cyan-500/10 transition-all duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}