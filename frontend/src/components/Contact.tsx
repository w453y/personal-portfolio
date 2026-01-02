import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Server } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaReddit } from 'react-icons/fa';
import { toast } from 'sonner';
import { submitContactForm, checkBackendHealth, validateEmail, type ContactFormData } from '@/lib/api';

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [emailValidation, setEmailValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    reason?: string;
  }>({
    isValidating: false,
    isValid: null
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      ref={sectionRef}
      id="contact" 
      className="relative py-24 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-violet-600/8 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-pink-600/8 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Get In </span>
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500" />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
          </div>
          <p className="text-gray-400 mt-6 max-w-lg mx-auto">
            Feel free to reach out for collaborations or just a friendly chat!
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 group-hover:scale-110 transition-transform">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Email</h4>
                <p className="text-gray-400">awasey8905@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 group-hover:scale-110 transition-transform">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Phone</h4>
                <p className="text-gray-400">+91-7090344713</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 group-hover:scale-110 transition-transform">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Location</h4>
                <p className="text-gray-400">Mangalore, India</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Connect with me</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-white/10 ${social.color}`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={`p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '0.3s' }}>
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
          </div>
        </div>
        
        {/* Footer */}
        <div className={`text-center mt-20 pt-8 border-t border-white/5 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.5s' }}>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Abdul Wasey. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};
