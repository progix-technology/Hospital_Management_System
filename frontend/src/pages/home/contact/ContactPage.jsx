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

      {/* Hero Section with Hospital Care Banner */}
      <section className="relative w-full min-h-[460px] lg:min-h-[500px] flex items-center justify-center text-white overflow-hidden bg-slate-900 pt-28 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg" 
            alt="Hospital Support & Helpdesk" 
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
          />
        </div>
        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/75 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-transparent to-slate-950/85 z-0"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-xs font-extrabold mb-5 border border-white/25 backdrop-blur-sm shadow-sm">
              <MessageSquare className="h-3.5 w-3.5" /> 24/7 Patient Assistance & Helpline
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-5 text-white drop-shadow-lg tracking-tight">
              We're Here to Help
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Whether you have a question about our services, need to book an appointment, or require emergency assistance, our medical team is available 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section (Overlapping Hero) */}
      <section className="relative z-20 -mt-20 pb-24">
        <div className="container mx-auto max-w-7xl px-4">

          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col lg:flex-row">

            {/* Left Column: Contact Information */}
            <div className="lg:w-2/5 bg-[var(--color-primary)] text-white p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

              <h3 className="text-3xl font-serif font-bold mb-2 relative z-10">Contact Info</h3>
              <p className="text-white/80 mb-10 relative z-10">Fill up the form and our team will get back to you within 24 hours.</p>

              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-slate-900 transition-colors duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Phone</h4>
                    <p className="text-white/80 mb-1">Emergency: <span className="text-white font-bold">+91 89532 08952</span></p>
                    <p className="text-white/80">Reception: +91 89532 08952</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-slate-900 transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Email</h4>
                    <p className="text-white/80 mb-1">info@progixtechnology.com</p>
                    <p className="text-white/80">support@progixtechnology.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-slate-900 transition-colors duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Location</h4>
                    <p className="text-white/80 leading-relaxed">
                      Vibhuti Khand<br />
                      Gomtinagar, Lucknow<br />
                      Uttar Pradesh - 226010
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-slate-900 transition-colors duration-300">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Operating Hours</h4>
                    <p className="text-white/80 mb-1">Emergency: 24/7 Open</p>
                    <p className="text-white/80">OPD: Mon-Sat, 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:w-3/5 p-10 lg:p-14 bg-white">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="h-8 w-8 text-[var(--color-primary)]" />
                <h3 className="text-3xl font-serif font-bold text-[var(--color-heading)]">Send a Message</h3>
              </div>

              {statusMsg.text && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-semibold border ${
                  statusMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-heading)]">First Name</label>
                    <Input 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      placeholder="John" 
                      required 
                      className="h-12 bg-slate-50 border-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-heading)]">Last Name</label>
                    <Input 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      placeholder="Doe" 
                      required 
                      className="h-12 bg-slate-50 border-slate-200" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-heading)]">Email Address</label>
                    <Input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      required 
                      className="h-12 bg-slate-50 border-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-heading)]">Phone Number</label>
                    <Input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 98765 43210" 
                      required 
                      className="h-12 bg-slate-50 border-slate-200" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-heading)]">Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Related</option>
                    <option value="feedback">Feedback / Complaint</option>
                    <option value="billing">Billing & Insurance</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-heading)]">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    rows={4}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading} 
                  className="w-full h-14 text-base shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="w-full h-[500px] rounded-[32px] overflow-hidden shadow-lg border border-slate-200 relative">
            <iframe
              src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Vibhuti%20Khand,%20Gomtinagar,%20Lucknow,%20Uttar%20Pradesh%20226010&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
