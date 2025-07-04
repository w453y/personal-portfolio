import React, { useState, useEffect } from 'react';
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
  const [emailValidation, setEmailValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    reason?: string;
  }>({
    isValidating: false,
    isValid: null
  });

  // Check backend health on component mount
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
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // STRICT Email validation - blocks form until email is verified
  useEffect(() => {
    if (!formData.email || formData.email.length < 3) {
      setEmailValidation({ isValidating: false, isValid: null });
      return;
    }

    // Basic format check first (instant)
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
        // STRICT: If validation fails, block the form
        setEmailValidation({
          isValidating: false,
          isValid: false,
          reason: 'Email validation service unavailable'
        });
      }
    }, 1000); // 1 second debounce

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
    // STRICT: Email must be validated and confirmed to exist
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
      return 'border-yellow-400 focus:border-yellow-500';
    }
    if (emailValidation.isValid === true) {
      return 'border-green-400 focus:border-green-500';
    }
    if (emailValidation.isValid === false) {
      return 'border-red-400 focus:border-red-500';
    }
    return 'border-white/20 focus:border-blue-500';
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
      return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
    }
    if (submitStatus === 'error') {
      return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';
    }
    if (backendStatus === 'offline' || emailValidation.isValid !== true) {
      return 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed';
    }
    return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
  };

  const getBackendStatusIndicator = () => {
    switch (backendStatus) {
      case 'checking':
        return (
          <div className="flex items-center space-x-2 text-yellow-400">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm">Checking backend...</span>
          </div>
        );
      case 'online':
        return (
          <div className="flex items-center space-x-2 text-green-400">
            <Server size={16} />
            <span className="text-sm">Backend online</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">Backend offline</span>
          </div>
        );
    }
  };

  // Check if form can be submitted
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

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-purple-900/20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Contact Me
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-slate-300 text-lg mt-6">
            Feel free to reach out for collaborations or just a friendly chat!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Email</h4>
                <p className="text-slate-300">awasey8905@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Phone</h4>
                <p className="text-slate-300">+91-7090344713</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Location</h4>
                <p className="text-slate-300">Mangalore, India</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-6">
              <h4 className="text-xl font-semibold text-white mb-4">Connect with me</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/w453y" target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                  <FaGithub className="text-pink-400 group-hover:scale-110 transition-transform" size={24} />
                </a>
                <a href="https://linkedin.com/in/w453y" target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                  <FaLinkedin className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                </a>
                <a href="https://twitter.com/w453y" target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                  <FaTwitter className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                </a>
                <a href="https://instagram.com/w453y" target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                  <FaInstagram className="text-pink-400 group-hover:scale-110 transition-transform" size={24} />
                </a>
                <a href="https://reddit.com/user/w453y" target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                  <FaReddit className="text-orange-400 group-hover:scale-110 transition-transform" size={24} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Send Message</h3>
              {getBackendStatusIndicator()}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 px-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-2">
                    Your Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full rounded-xl border ${getEmailInputStyles()} bg-white/10 backdrop-blur-md text-white py-3 px-4 pr-10 focus:outline-none focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400`}
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
                    <p className="text-green-400 text-xs mt-1">✓ Email verified and exists</p>
                  )}
                  {emailValidation.isValidating && (
                    <p className="text-yellow-400 text-xs mt-1">Verifying email existence...</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className="block text-slate-300 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 px-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-slate-300 text-sm font-medium mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 px-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 placeholder:text-slate-400"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting || backendStatus === 'offline'}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-slate-300 text-sm font-medium mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white py-3 px-4 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 resize-none placeholder:text-slate-400"
                  placeholder="Enter your message (minimum 10 characters)"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || backendStatus === 'offline'}
                  minLength={10}
                />
                <div className="text-right text-xs text-slate-400 mt-1">
                  {formData.message.length}/10 minimum
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={!canSubmit()}
                  className={`w-full inline-flex justify-center items-center space-x-2 ${getButtonStyles()} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {getButtonContent()}
                </button>
                {!canSubmit() && emailValidation.isValid !== true && formData.email && (
                  <p className="text-yellow-400 text-xs mt-2 text-center">
                    ⚠️ Please wait for email verification to complete before sending
                  </p>
                )}
              </div>
            </form>
            
            {/* Additional Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-slate-300 text-sm">
                <strong>Response Time:</strong> I typically respond within 24 hours. For urgent matters, feel free to reach out directly via email or phone.
              </p>
              {backendStatus === 'offline' && (
                <p className="text-red-400 text-sm mt-2">
                  <strong>Note:</strong> The contact form is currently unavailable. Please email me directly at awasey8905@gmail.com
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Abdul Wasey. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};