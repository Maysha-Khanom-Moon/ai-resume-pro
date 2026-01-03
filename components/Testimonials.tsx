import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    image: '👩‍💻',
    rating: 5,
    text: 'AIResumePro helped me land my dream job at Google! The AI feedback was incredibly detailed and actionable. Went from 0 to 5 interviews in 2 weeks.'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Amazon',
    image: '👨‍💼',
    rating: 5,
    text: 'The ATS optimization feature is a game-changer. My resume finally started getting past the screening systems. Got 3x more callbacks after using this tool.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Meta',
    image: '👩‍🎨',
    rating: 5,
    text: 'Best investment in my career! The instant feedback saved me weeks of trial and error. Now working at my dream company thanks to AIResumePro.'
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Microsoft',
    image: '👨‍🔬',
    rating: 5,
    text: 'Incredibly accurate analysis. The AI caught issues I never would have noticed. My interview rate jumped from 5% to 35% after optimization.'
  },
  {
    name: 'Lisa Anderson',
    role: 'Marketing Director',
    company: 'Netflix',
    image: '👩‍💼',
    rating: 5,
    text: 'Simple, fast, and effective. The privacy-first approach gave me peace of mind while getting professional feedback. Highly recommend!'
  },
  {
    name: 'James Wilson',
    role: 'Full Stack Developer',
    company: 'Tesla',
    image: '👨‍💻',
    rating: 5,
    text: 'Transformed my resume from average to exceptional. The detailed scoring helped me understand exactly what needed improvement. Worth every penny!'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Loved by Job Seekers
            <span className="block mt-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands who landed their dream jobs with our AI-powered resume optimization.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-2 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-slate-200 dark:text-slate-700 group-hover:text-blue-200 dark:group-hover:text-blue-900 transition-colors">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center text-3xl shadow-lg">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50K+', label: 'Happy Users' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '3x', label: 'More Interviews' },
            { value: '95%', label: 'Success Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}