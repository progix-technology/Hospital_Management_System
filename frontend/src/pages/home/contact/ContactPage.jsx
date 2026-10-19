import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      if (response.data.success) {
        setStatusMsg({ 
          type: 'success', 
          text: 'Thank you! Your message has been sent successfully via SMTP. An email confirmation has been sent to your inbox.' 
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: 'general',
          message: ''
        });
      }
    } catch (error) {
      console.error('SMTP Send Error:', error);
      setStatusMsg({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send message via SMTP. Please check your SMTP configuration.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">

      {/* Hero Section with Hospital Care Banner (Full height on mobile with navbar clearance) */}
      <section className="relative w-full min-h-[100dvh] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center text-white overflow-hidden bg-slate-900 pt-24 sm:pt-28 pb-16 sm:pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg" 
            alt="Hospital Support & Helpdesk" 
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
          />
        </div>
        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/80 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90 z-0"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-[10px] sm:text-xs font-extrabold mb-3 sm:mb-5 border border-white/25 backdrop-blur-sm shadow-sm">
              <MessageSquare className="h-3.5 w-3.5" /> 24/7 Patient Assistance & Helpline
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-2.5 sm:mb-4 text-white drop-shadow-lg tracking-tight">
              We're Here to Help
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md px-2">
              Whether you have a question about our services, need to book an appointment, or require emergency assistance, our medical team is available 24/7.
            </p>

            {/* Quick Action Badges / CTAs on Mobile & Desktop */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-8">
              <a 
                href="tel:+918953208952" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                <Phone className="h-3.5 w-3.5" /> Call 24/7 Helpline
              </a>
              <a 
                href="#contact-form" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[var(--color-accent)]" /> Send Message
              </a>
              <a 
                href="https://maps.google.com/?q=Vibhuti+Khand,+Gomtinagar,+Lucknow" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95"
              >
                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" /> Directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section (Overlapping Hero) */}
      <section id="contact-form" className="relative z-20 -mt-10 sm:-mt-20 pb-8 sm:pb-24 scroll-mt-24">
        <div className="container mx-auto max-w-7xl px-2.5 sm:px-4">

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col lg:flex-row">

            {/* Left Column: Contact Information */}
            <div className="lg:w-2/5 bg-[var(--color-primary)] text-white p-4 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-1 sm:mb-2 relative z-10">
                <h3 className="text-lg sm:text-3xl font-serif font-bold">Contact Info</h3>
                <span className="text-[10px] sm:hidden bg-white/20 px-2 py-0.5 rounded-full font-medium text-[var(--color-accent)]">Tap to Connect</span>
              </div>
              <p className="text-[11px] sm:text-sm text-white/80 mb-3.5 sm:mb-10 relative z-10 leading-snug">
                Connect directly or fill out the form for prompt assistance.
              </p>

              {/* 2x2 Grid on Mobile / Stack on Desktop */}
              <div className="grid grid-cols-2 sm:block gap-2 sm:gap-0 sm:space-y-8 relative z-10">
                
                {/* Phone (Click to Call) */}
                <a 
                  href="tel:+918953208952" 
                  className="flex items-start gap-2 sm:gap-4 p-2 sm:p-0 rounded-xl bg-white/10 sm:bg-transparent hover:bg-white/15 transition-all active:scale-95 group"
                >
                  <div className="mt-0.5 h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-full bg-white/15 flex items-center justify-center shrink-0 text-[var(--color-accent)] sm:text-white group-hover:scale-110 transition-transform">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-lg font-bold mb-0.5 text-white">Phone</h4>
                    <p className="text-[10px] sm:text-sm text-white/90 truncate font-mono">+91 89532 08952</p>
                    <p className="text-[9px] sm:text-xs text-[var(--color-accent)] font-semibold truncate">Tap to Call</p>
                  </div>
                </a>

                {/* Email (Click to Mail) */}
                <a 
                  href="mailto:info@progixtechnology.com" 
                  className="flex items-start gap-2 sm:gap-4 p-2 sm:p-0 rounded-xl bg-white/10 sm:bg-transparent hover:bg-white/15 transition-all active:scale-95 group"
                >
                  <div className="mt-0.5 h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-full bg-white/15 flex items-center justify-center shrink-0 text-[var(--color-accent)] sm:text-white group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-lg font-bold mb-0.5 text-white">Email</h4>
                    <p className="text-[10px] sm:text-sm text-white/90 truncate">info@progixtech...</p>
                    <p className="text-[9px] sm:text-xs text-[var(--color-accent)] font-semibold truncate">Tap to Email</p>
                  </div>
                </a>

                {/* Location (Click to Open Maps) */}
                <a 
                  href="https://maps.google.com/?q=Vibhuti+Khand,+Gomtinagar,+Lucknow" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-start gap-2 sm:gap-4 p-2 sm:p-0 rounded-xl bg-white/10 sm:bg-transparent hover:bg-white/15 transition-all active:scale-95 group"
                >
                  <div className="mt-0.5 h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-full bg-white/15 flex items-center justify-center shrink-0 text-[var(--color-accent)] sm:text-white group-hover:scale-110 transition-transform">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-lg font-bold mb-0.5 text-white">Location</h4>
                    <p className="text-[10px] sm:text-sm text-white/90 leading-tight line-clamp-1">
                      Gomtinagar, Lucknow
                    </p>
                    <p className="text-[9px] sm:text-xs text-[var(--color-accent)] font-semibold truncate">Open in Maps</p>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-0 rounded-xl bg-white/10 sm:bg-transparent">
                  <div className="mt-0.5 h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-full bg-white/15 flex items-center justify-center shrink-0 text-[var(--color-accent)] sm:text-white">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-lg font-bold mb-0.5 text-white">Hours</h4>
                    <p className="text-[10px] sm:text-sm text-white/90 truncate">Emergency: 24/7</p>
                    <p className="text-[9px] sm:text-xs text-white/70 truncate">OPD: 8 AM - 8 PM</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:w-3/5 p-4 sm:p-10 lg:p-14 bg-white">
              <div className="flex items-center gap-2 sm:gap-3 mb-3.5 sm:mb-8">
                <MessageSquare className="h-5 w-5 sm:h-8 sm:w-8 text-[var(--color-primary)]" />
                <h3 className="text-lg sm:text-3xl font-serif font-bold text-[var(--color-heading)]">Send a Message</h3>
              </div>

              {statusMsg.text && (
                <div className={`p-3 sm:p-4 mb-3 sm:mb-6 rounded-xl text-xs sm:text-sm font-semibold border ${
                  statusMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
                {/* First Name & Last Name (2-in-1 on mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">First Name</label>
                    <Input 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      placeholder="John" 
                      required 
                      className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">Last Name</label>
                    <Input 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      placeholder="Doe" 
                      required 
                      className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                    />
                  </div>
                </div>

                {/* Email & Phone (2-in-1 on mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">Email</label>
                    <Input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      required 
                      className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">Phone</label>
                    <Input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 98765 43210" 
                      required 
                      className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className="w-full h-9 sm:h-12 px-2.5 sm:px-4 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Related</option>
                    <option value="feedback">Feedback / Complaint</option>
                    <option value="billing">Billing & Insurance</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[11px] sm:text-sm font-bold text-[var(--color-heading)]">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    rows={3}
                    className="w-full p-2.5 sm:p-4 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading} 
                  className="w-full h-10 sm:h-14 text-xs sm:text-base font-bold rounded-xl shadow-md shadow-[var(--color-primary)]/20 cursor-pointer active:scale-[0.99] transition-transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section with Mobile Direct Link */}
      <section className="pb-12 sm:pb-24">
        <div className="container mx-auto max-w-7xl px-2.5 sm:px-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h4 className="text-sm sm:text-xl font-bold text-slate-800">Our Location</h4>
              <p className="text-[11px] sm:text-xs text-slate-500">Vibhuti Khand, Gomtinagar, Lucknow</p>
            </div>
            <a 
              href="https://maps.google.com/?q=Vibhuti+Khand,+Gomtinagar,+Lucknow" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border border-slate-200"
            >
              <MapPin className="h-3 w-3 text-red-500" /> Open in Google Maps
            </a>
          </div>

          <div className="w-full h-[220px] sm:h-[380px] lg:h-[480px] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-md border border-slate-200 relative">
            <iframe
              src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Vibhuti%20Khand,%20Gomtinagar,%20Lucknow,%20Uttar%20Pradesh%20226010&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Hospital Location Map"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
