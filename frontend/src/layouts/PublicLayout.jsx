import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Search, Menu, X,
  Activity, ArrowUp, User
} from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export default function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const searchableItems = [
    { name: 'Find Doctors & Specialists', category: 'Doctors', path: '/doctors' },
    { name: 'Book an Appointment', category: 'Appointments', path: '/book-appointment' },
    { name: 'Cardiology Department', category: 'Departments', path: '/departments' },
    { name: 'Neurology Department', category: 'Departments', path: '/departments' },
    { name: 'Orthopedics & Bone Care', category: 'Departments', path: '/departments' },
    { name: 'Pediatrics & Child Care', category: 'Departments', path: '/departments' },
    { name: 'Emergency & Ambulance Services', category: 'Services', path: '/services' },
    { name: 'Health Checkup Packages', category: 'Packages', path: '/packages' },
    { name: 'About Hospital & Milestones', category: 'About', path: '/about' },
    { name: 'Contact & 24/7 Helpline', category: 'Contact', path: '/contact' },
    { name: 'Patient Portal Login', category: 'Account', path: '/login' },
  ];

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : searchableItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

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

      {/* Topbar matching design (Compact slim height) */}
      <div className="bg-[var(--color-footer)] text-[var(--color-muted)] text-[10.5px] font-medium py-1.5 px-4 hidden lg:block border-b border-white/5">
        <div className="container mx-auto max-w-[1400px] flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors cursor-pointer text-white">
              <Phone className="h-3 w-3" /> 24/7 Emergency Care
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[var(--color-accent)]">
              <Phone className="h-3 w-3" /> +91 89532 08952
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[var(--color-accent)]">
              <Mail className="h-3 w-3" /> info@progixtechnology.com
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-white">
              <MapPin className="h-3 w-3 text-white" /> Lucknow, Uttar Pradesh
            </span>
            <div className="h-3.5 w-px bg-slate-700"></div>
            <Link to="/login" className="flex items-center gap-1.5 hover:text-[var(--color-accent)] text-white transition-colors">
              <User className="h-3 w-3" /> Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header (Always top layer z-[100]) */}
      <header className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-300 border-b border-[var(--color-border)]",
        isScrolled ? "bg-[var(--color-navbar)]/95 backdrop-blur-md shadow-xs py-1.5" : "bg-[var(--color-navbar)] py-2"
      )}>
        <div className="container mx-auto max-w-[1600px] px-4 md:px-8 flex items-center justify-between">

          {/* Logo matching design (Slimmer proportions) */}
          <Link to="/" className="flex items-center gap-2 z-50 group">
            <img src="/applogo.png" alt="Logo" className="h-9 w-9 md:h-10 md:w-10 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col justify-center">
              <span className="font-black text-lg md:text-[21px] tracking-tight bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#16a34a] bg-clip-text text-transparent leading-none mb-0.5">
                Medisphere
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.14em] text-slate-500 font-bold leading-none">
                HOSPITAL & RESEARCH CENTER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Compact links) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 mx-0.5",
                  location.pathname === link.path
                    ? "text-[var(--color-primary)] bg-[var(--color-background-secondary)]"
                    : "text-[var(--color-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Compact buttons) */}
          <div className="hidden lg:flex items-center gap-3">
            <Button onClick={() => setIsSearchOpen(true)} variant="ghost" size="sm" className="h-8.5 w-8.5 p-0 rounded-full border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]">
              <Search className="h-3.5 w-3.5" />
            </Button>
            <Link to="/book-appointment">
              <Button variant="primary" className="rounded-full px-4.5 h-8.5 text-xs font-semibold">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Right Controls: Search button (pill) + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Search</span>
            </button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              className="h-8.5 w-8.5 p-0 z-[100000] rounded-full bg-[var(--color-background-secondary)] text-[var(--color-foreground)] cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99999] bg-[var(--color-background)] pt-20 pb-10 px-4 sm:px-6 overflow-y-auto lg:hidden flex flex-col justify-between"
          >
            <div className="flex flex-col gap-2">
              {/* Emergency Fast Dial Bar for Mobile */}
              <a
                href="tel:+918953208952"
                className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs mb-3 shadow-xs active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span>24/7 Emergency Line: +91 89532 08952</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px]">Call</span>
              </a>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "p-3.5 text-base font-bold rounded-xl border border-[var(--color-border)] transition-colors flex items-center justify-between",
                    location.pathname === link.path
                      ? "bg-[var(--color-background-secondary)] text-[var(--color-primary)] border-[var(--color-primary)]/30"
                      : "text-[var(--color-heading)] bg-white/70 hover:bg-white"
                  )}
                >
                  <span>{link.name}</span>
                  <span className="text-slate-400 text-sm">&rarr;</span>
                </Link>
              ))}

              {/* Actions */}
              <div className="mt-5 space-y-2.5">
                <Link to="/book-appointment" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button variant="primary" className="w-full h-12 rounded-xl text-sm font-bold shadow-sm">
                    Book Appointment
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold border-[var(--color-border)] bg-white">
                      Patient Login
                    </Button>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }}
                    className="w-full h-11 rounded-xl text-xs font-semibold border border-[var(--color-border)] bg-white text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 text-slate-500" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Footer note */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Medisphere Hospital & Research Center</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Vibhuti Khand, Gomtinagar, Lucknow</p>
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
              <div className="flex items-center gap-2">
                <img src="/applogo.png" alt="Logo" className="h-9 w-9 object-contain shrink-0" />
                <div className="flex flex-col">
                  <span className="font-black text-lg bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent leading-none mb-0.5">Medisphere</span>
                  <span className="text-[7.5px] uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold leading-none">HOSPITAL & RESEARCH CENTER</span>
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
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3"
          >

            <button
              onClick={scrollToTop}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[var(--color-card)] text-[var(--color-foreground)] shadow-md flex items-center justify-center hover:bg-[var(--color-background-secondary)] hover:scale-105 transition-transform border border-[var(--color-border)]"
            >
              <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
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
            className="fixed inset-0 z-[100002] bg-slate-900/65 backdrop-blur-sm flex items-start justify-center pt-14 sm:pt-24 md:pt-32 px-3 sm:px-4"
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="flex items-center border-b border-slate-100 px-3.5 sm:px-6 py-3 sm:py-4">
                <Search className="h-5 w-5 text-slate-400 mr-2.5 sm:mr-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, departments, services..."
                  className="flex-1 h-10 sm:h-12 bg-transparent outline-none text-sm sm:text-lg font-medium text-slate-800 placeholder:text-slate-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mr-2 text-xs font-bold hover:bg-slate-200"
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Live Search Results or Quick Links */}
              <div className="p-4 sm:p-6 bg-slate-50 max-h-[60vh] overflow-y-auto">
                {searchQuery.trim() !== '' ? (
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Search Results ({searchResults.length})
                    </h4>
                    {searchResults.length > 0 ? (
                      <div className="space-y-1.5">
                        {searchResults.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 transition-colors group"
                          >
                            <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-[var(--color-primary)]">
                              {item.name}
                            </span>
                            <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              {item.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-500 py-3 text-center">
                        No matches found for "{searchQuery}".
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Links</h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Link to="/doctors" onClick={() => setIsSearchOpen(false)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Find a Doctor</Link>
                      <Link to="/book-appointment" onClick={() => setIsSearchOpen(false)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Book Appointment</Link>
                      <Link to="/departments" onClick={() => setIsSearchOpen(false)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Cardiology</Link>
                      <Link to="/packages" onClick={() => setIsSearchOpen(false)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Health Packages</Link>
                      <Link to="/contact" onClick={() => setIsSearchOpen(false)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">Contact Us</Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
