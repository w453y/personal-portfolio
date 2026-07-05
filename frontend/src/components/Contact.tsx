import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Server } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaReddit } from 'react-icons/fa';
import { toast } from 'sonner';
import { submitContactForm, checkBackendHealth, validateEmail, type ContactFormData } from '@/lib/api';
import { ScrollReveal } from './ui/ScrollReveal';
import { SectionHeader } from './ui/SectionHeader';
import { SpotlightCard } from './ui/SpotlightCard';

export const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    subject: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [emailValidation, setEmailValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    reason?: string;
  }>({
    isValidating: false,
    isValid: null
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setBackendStatus(isHealthy ? 'online' : 'offline');
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!formData.email || formData.email.length < 3) {
      setEmailValidation({ isValidating: false, isValid: null });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailValidation({
        isValidating: false,
        isValid: false,
        reason: 'Invalid email format'
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setEmailValidation({ isValidating: true, isValid: null });
      
      try {
        const result = await validateEmail(formData.email);
        setEmailValidation({
          isValidating: false,
          isValid: result.isValid,
          reason: result.reason
        });
      } catch (error) {
        console.error('Email validation failed:', error);
        setEmailValidation({
          isValidating: false,
          isValid: false,
          reason: 'Email validation service unavailable'
        });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (emailValidation.isValid !== true) {
      toast.error(emailValidation.reason || 'Please enter a valid, existing email address');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return false;
    }
    if (formData.message.trim().length < 10) {
      toast.error('Message should be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (backendStatus === 'offline') {
      toast.error('Backend service is currently offline. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setSubmitStatus('success');
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: '',
          phone: ''
        });
        setEmailValidation({ isValidating: false, isValid: null });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmailInputStyles = () => {
    if (emailValidation.isValidating) {
      return 'border-yellow-400/50 focus:border-yellow-500';
    }
    if (emailValidation.isValid === true) {
      return 'border-green-400/50 focus:border-green-500';
    }
    if (emailValidation.isValid === false) {
      return 'border-red-400/50 focus:border-red-500';
    }
    return 'border-white/10 focus:border-violet-500';
  };

  const getEmailValidationIcon = () => {
    if (emailValidation.isValidating) {
      return <Loader2 className="animate-spin text-yellow-400" size={16} />;
    }
    if (emailValidation.isValid === true) {
      return <CheckCircle className="text-green-400" size={16} />;
    }
    if (emailValidation.isValid === false) {
      return <AlertCircle className="text-red-400" size={16} />;
    }
    return null;
  };

  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Sending...</span>
        </>
      );
    }
    if (submitStatus === 'success') {
      return (
        <>
          <CheckCircle size={20} />
          <span>Sent!</span>
        </>
      );
    }
    if (submitStatus === 'error') {
      return (
        <>
          <AlertCircle size={20} />
          <span>Try Again</span>
        </>
      );
    }
    return (
      <>
        <span>Send Message</span>
        <Send size={20} />
      </>
    );
  };

  const getButtonStyles = () => {
    if (submitStatus === 'success') {
      return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500';
    }
    if (submitStatus === 'error') {
      return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500';
    }
    if (backendStatus === 'offline' || emailValidation.isValid !== true) {
      return 'bg-gray-600/50 cursor-not-allowed';
    }
    return 'bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500';
  };

  const getBackendStatusIndicator = () => {
    switch (backendStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Loader2 className="animate-spin" size={14} />
            <span className="text-xs">Checking...</span>
          </div>
        );
      case 'online':
        return (
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs">Online</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs">Offline</span>
          </div>
        );
    }
  };

  const canSubmit = () => {
    return (
      !isSubmitting && 
      backendStatus === 'online' && 
      emailValidation.isValid === true &&
      formData.name.trim() &&
      formData.email.trim() &&
      formData.message.trim().length >= 10
    );
  };

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/w453y", color: "hover:text-white hover:border-white/30" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/w453y", color: "hover:text-blue-400 hover:border-blue-400/30" },
    { icon: FaTwitter, href: "https://twitter.com/w453y", color: "hover:text-sky-400 hover:border-sky-400/30" },
    { icon: FaInstagram, href: "https://instagram.com/w453y", color: "hover:text-pink-400 hover:border-pink-400/30" },
    { icon: FaReddit, href: "https://reddit.com/user/w453y", color: "hover:text-orange-400 hover:border-orange-400/30" },
  ];

  return (
    <section 
      id="contact" 
      className="relative py-8 md:py-12 overflow-hidden"
    >
      {/* Background elements */}
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <SectionHeader
          title="Get In"
          highlight="Touch"
          subtitle="Feel free to reach out for collaborations or just a friendly chat!"
        />
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <ScrollReveal className="space-y-6" delay={100} direction="left">
            <SpotlightCard className="p-6 md:p-8" tilt={0}>
              <div className="flex items-center gap-2 mb-5 font-mono text-xs text-gray-500">
                <Server className="w-3.5 h-3.5 text-violet-400" />
                <span>contact.yaml</span>
              </div>
              <div className="font-mono text-sm space-y-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-cyan-400 w-24">email:</span>
                  <a href="mailto:awasey8905@gmail.com" className="text-gray-300 hover:text-violet-400 transition-colors">awasey8905@gmail.com</a>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-cyan-400 w-24">phone:</span>
                  <a href="tel:+917090344713" className="text-gray-300 hover:text-violet-400 transition-colors">+91 70903 44713</a>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-cyan-400 w-24">location:</span>
                  <span className="text-gray-300">Mangalore, India <span className="text-gray-600"># IST (UTC+5:30)</span></span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-cyan-400 w-24">status:</span>
                  <span className="text-emerald-400 flex items-center gap-2"><span className="led" />open to opportunities</span>
                </div>
              </div>
            </SpotlightCard>

            <div>
              <h4 className="font-mono text-sm text-gray-500 mb-4"># or find me here</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-md term-chip text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-sm">
              Feel free to reach out about roles, collaborations, or
              open-source projects. I usually reply within a day.
            </p>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={150} direction="right">
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Send Message</h3>
                {getBackendStatusIndicator()}
              </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-400 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 text-white py-3 px-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
                    Your Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full rounded-xl border ${getEmailInputStyles()} bg-white/5 text-white py-3 px-4 pr-10 focus:outline-none focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting || backendStatus === 'offline'}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getEmailValidationIcon()}
                    </div>
                  </div>
                  {emailValidation.isValid === false && emailValidation.reason && (
                    <p className="text-red-400 text-xs mt-1">{emailValidation.reason}</p>
                  )}
                  {emailValidation.isValid === true && (
                    <p className="text-green-400 text-xs mt-1">✓ Email verified</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className="block text-gray-400 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full rounded-xl border border-white/10 bg-white/5 text-white py-3 px-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-400 text-sm font-medium mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-xl border border-white/10 bg-white/5 text-white py-3 px-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-400 text-sm font-medium mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 text-white py-3 px-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all duration-300 resize-none placeholder:text-gray-600"
                  placeholder="Enter your message (minimum 10 characters)"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || backendStatus === 'offline'}
                  minLength={10}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.message.length}/10 minimum
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!canSubmit()}
                className={`w-full inline-flex justify-center items-center gap-2 ${getButtonStyles()} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none`}
              >
                {getButtonContent()}
              </button>
            </form>
            
            {backendStatus === 'offline' && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">
                  The contact form is currently unavailable. Please email me directly at awasey8905@gmail.com
                </p>
              </div>
            )}
            </SpotlightCard>
          </ScrollReveal>
        </div>
        
        {/* Footer */}
        <ScrollReveal className="mt-20 pt-8 border-t border-white/5" delay={200}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/uploads/w453y.svg" alt="w453y" className="h-8 w-8" />
              <p className="font-mono text-xs text-gray-600">
                © {new Date().getFullYear()} Abdul Wasey · w453y.me
              </p>
            </div>
            <p className="font-mono text-xs text-gray-600">
              built with React, TypeScript, and Docker ·{' '}
              <a
                href="https://github.com/w453y/personal-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-violet-400 transition-colors"
              >
                source on GitHub
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
