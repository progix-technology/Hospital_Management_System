import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Search, Menu, X,
  Activity, ArrowUp, MessageCircle, User
} from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export default function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Staff', path: '/doctors' },
    { name: 'Departments', path: '/departments' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-foreground)] flex flex-col">

      {/* Topbar matching design */}
      <div className="bg-[var(--color-footer)] text-[var(--color-muted)] text-[11px] font-medium py-2.5 px-4 hidden lg:block">
        <div className="container mx-auto max-w-[1400px] flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors cursor-pointer text-white">
              <Phone className="h-3.5 w-3.5" /> 24/7 Emergency Care
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-[var(--color-accent)]">
              <Phone className="h-3.5 w-3.5" /> +91 89532 08952
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-[var(--color-accent)]">
              <Mail className="h-3.5 w-3.5" /> info@progixtechnology.com
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white">
              <MapPin className="h-3.5 w-3.5 text-white" /> Lucknow , Uttar Pradesh
            </span>
            <div className="h-4 w-px bg-slate-700"></div>
            <Link to="/login" className="flex items-center gap-2 hover:text-[var(--color-accent)] text-white transition-colors">
              <User className="h-3.5 w-3.5" /> Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-[var(--color-border)]",
        isScrolled ? "bg-[var(--color-navbar)]/95 backdrop-blur-md shadow-sm py-3" : "bg-[var(--color-navbar)] py-4"
      )}>
        <div className="container mx-auto max-w-[1600px] px-6 md:px-12 flex items-center justify-between">

          {/* Logo matching design */}
          <Link to="/" className="flex items-center gap-4 z-50">
            <img src="/applogo.png" alt="Logo" className="h-14 w-14 object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[var(--color-heading)] font-serif leading-none mb-1">Medisphere</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-bold leading-none">HOSPITAL & RESEARCH CENTER</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 mx-1",
                  location.pathname === link.path
                    ? "text-[var(--color-primary)] bg-[var(--color-background-secondary)]"
                    : "text-[var(--color-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button onClick={() => setIsSearchOpen(true)} variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]">
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/book-appointment">
              <Button variant="primary" className="rounded-full px-6 h-10 text-sm font-semibold">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            className="lg:hidden h-10 w-10 p-0 z-[100000] rounded-full bg-[var(--color-background-secondary)] text-[var(--color-foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[99999] bg-[var(--color-background)] pt-24 px-4 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "p-4 text-lg font-bold rounded-xl border border-[var(--color-border)]",
                    location.pathname === link.path ? "bg-[var(--color-background-secondary)] text-[var(--color-primary)]" : "text-[var(--color-heading)]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-6 space-y-3">
                <Link to="/login" className="block w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl text-base font-semibold border-[var(--color-border)] bg-white">Patient Login</Button>
                </Link>
                <Link to="/book-appointment" className="block w-full">
                  <Button variant="primary" className="w-full h-12 rounded-xl text-base font-semibold">Book Appointment</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer matching design */}
      <footer className="bg-[var(--color-footer)] text-[var(--color-muted)] pt-16 pb-8">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 border-b border-white/10 pb-12">

            {/* Brand - Span 1 column */}
            <div className="space-y-6 lg:col-span-1">
              <div className="flex items-center gap-3">
                <img src="/applogo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white font-serif leading-none mb-0.5">Medisphere</span>
                  <span className="text-[7px] uppercase tracking-wider text-[var(--color-accent)] font-semibold leading-none">HOSPITAL & RESEARCH CENTER</span>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-white/70">
                A world-class healthcare facility dedicated to providing advanced medical care with compassion and excellence.
              </p>
              <div className="space-y-3 text-[13px] text-white/70">
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--color-accent)]" /> +91 89532 08952</p>
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--color-accent)]" /> info@progixtechnology.com</p>
                <p className="flex items-start gap-3"><MapPin className="h-4 w-4 text-[var(--color-accent)] mt-0.5 shrink-0" /> Lucknow, Uttar Pradesh</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-sm mb-6">Quick Links</h3>
              <ul className="space-y-3 text-[13px] text-white/70">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Our Doctors', to: '/doctors' },
                  { label: 'Departments', to: '/departments' },
                  { label: 'Health Packages', to: '/book-appointment' },
                  { label: 'Contact Us', to: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                      <div className="h-1 w-1 bg-[var(--color-accent)] rounded-full"></div> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-white font-bold text-sm mb-6">Departments</h3>
              <ul className="space-y-3 text-[13px] text-white/70">
                {[
                  { label: 'Cardiology', to: '/departments/cardiology' },
                  { label: 'Neurology', to: '/departments/neurology' },
                  { label: 'Orthopedics', to: '/departments/orthopedics' },
                  { label: 'Pediatrics', to: '/departments/pediatrics' },
                  { label: 'Oncology', to: '/departments/oncology' },
                  { label: 'Emergency', to: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                      <div className="h-1 w-1 bg-[var(--color-accent)] rounded-full"></div> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-bold text-sm mb-6">Services</h3>
              <ul className="space-y-3 text-[13px] text-white/70">
                {[
                  { label: 'Diagnostic Services', to: '/services/diagnostic-services' },
                  { label: 'Laboratory Services', to: '/services/laboratory-services' },
                  { label: 'Surgical Services', to: '/services/surgical-services' },
                  { label: 'Pharmacy', to: '/services/pharmacy' },
                  { label: 'Ambulance Services', to: '/services/ambulance-services' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                      <div className="h-1 w-1 bg-[var(--color-accent)] rounded-full"></div> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Follow */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-bold text-sm mb-4">Newsletter</h3>
              <p className="text-[12px] text-white/70 mb-4">Subscribe to our newsletter for the latest health tips and medical news.</p>
              <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-8 h-10">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent border-none text-white px-4 text-xs w-full focus:outline-none focus:ring-0 placeholder:text-white/40"
                />
                <button className="bg-[var(--color-primary)] text-white px-4 text-xs font-semibold hover:bg-[var(--color-primary-hover)] transition-colors">Subscribe</button>
              </div>

              <h3 className="text-white font-bold text-sm mb-4">Follow Us</h3>
              <div className="flex gap-2 text-[var(--color-accent)]">
                <a href="#" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-white/50">
            <p>© {new Date().getFullYear()} Medisphere Hospital. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Widgets */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
          >
            <button className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button
              onClick={scrollToTop}
              className="h-12 w-12 rounded-full bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm flex items-center justify-center hover:bg-[var(--color-background-secondary)] hover:scale-110 transition-transform border border-[var(--color-border)]"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="flex items-center border-b border-slate-100 px-6 py-4">
                <Search className="h-6 w-6 text-slate-400 mr-4" />
                <input
                  type="text"
                  placeholder="Search doctors, departments, services..."
                  className="flex-1 h-14 bg-transparent outline-none text-xl font-medium text-slate-800 placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 bg-slate-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Links</h4>
                <div className="flex flex-wrap gap-2">
                  <Link to="/doctors" onClick={() => setIsSearchOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Find a Doctor</Link>
                  <Link to="/book-appointment" onClick={() => setIsSearchOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Book Appointment</Link>
                  <Link to="/departments" onClick={() => setIsSearchOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Cardiology</Link>
                  <Link to="/packages" onClick={() => setIsSearchOpen(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Health Packages</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
