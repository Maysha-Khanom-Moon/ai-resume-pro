// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Phone,
  Send,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Have questions? We'd love to hear from you. Send us a message 
                and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-row md:flex-col gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Contact Information
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Fill out the form and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        icon: <Mail className="w-6 h-6" />,
                        title: 'Email',
                        content: 'support@airesumepro.com',
                        href: 'mailto:support@airesumepro.com'
                      },
                      {
                        icon: <Phone className="w-6 h-6" />,
                        title: 'Phone',
                        content: '+1 (555) 123-4567',
                        href: 'tel:+15551234567'
                      },
                      {
                        icon: <MapPin className="w-6 h-6" />,
                        title: 'Office',
                        content: 'Rajshahi, Bangladesh',
                        href: null
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {item.title}
                          </h3>
                          {item.href ? (
                            <a 
                              href={item.href}
                              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-slate-600 dark:text-slate-400">
                              {item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="pt-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 flex items-center justify-center transition-all"
                          aria-label={social}
                        >
                          <span className="text-sm font-semibold">
                            {social.charAt(0)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8">
                        <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Send us a Message
                        </h2>
                        </div>

                        {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Message Sent!
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-center">
                            Thank you for contacting us. We'll get back to you soon.
                            </p>
                        </div>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label 
                                htmlFor="name"
                                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                >
                                Your Name *
                                </label>
                                <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="border-2"
                                />
                            </div>

                            <div>
                                <label 
                                htmlFor="email"
                                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                >
                                Email Address *
                                </label>
                                <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                className="border-2"
                                />
                            </div>
                            </div>

                            <div>
                            <label 
                                htmlFor="subject"
                                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                            >
                                Subject *
                            </label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="How can we help you?"
                                className="border-2"
                            />
                            </div>

                            <div>
                            <label 
                                htmlFor="message"
                                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                            >
                                Message *
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Tell us more about your inquiry..."
                                rows={6}
                                className="border-2 resize-none"
                            />
                            </div>

                            <Button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
                            >
                            {status === 'loading' ? (
                                <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending...
                                </>
                            ) : (
                                <>
                                <Send className="w-5 h-5 mr-2" />
                                Send Message
                                </>
                            )}
                            </Button>
                        </form>
                        )}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    question: 'How quickly will I receive a response?',
                    answer: 'We typically respond within 24 hours during business days.'
                  },
                  {
                    question: 'Do you offer phone support?',
                    answer: 'Yes! You can reach us at +1 (555) 123-4567 during business hours.'
                  },
                  {
                    question: 'Can I schedule a demo?',
                    answer: 'Absolutely! Contact us and we\'ll arrange a personalized demo.'
                  }
                ].map((faq, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                  >
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}