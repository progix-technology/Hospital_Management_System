import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, HeartPulse, Activity, User, Award, CheckCircle2, Phone,
  Stethoscope, Clock, Users, Building, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '../../../components/Button';

export default function AboutPage() {
  const milestonesRef = useRef(null);

  const scrollMilestones = (direction) => {
    if (milestonesRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      milestonesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const coreValues = [
    { icon: HeartPulse, title: 'Compassion', desc: 'Empathy, dignity and respect for every patient.' },
    { icon: Activity, title: 'Innovation', desc: 'Next-gen medical tech for better outcomes.' },
    { icon: Award, title: 'Excellence', desc: 'Highest global healthcare standards.' },
    { icon: User, title: 'Patient First', desc: 'Patients at the heart of every decision.' }
  ];

  const milestones = [
    { year: '1995', title: 'Foundation', desc: 'Medisphere was established with a 50-bed facility.', details: 'Starting with a core team of 20 dedicated doctors and nurses, we began our journey to provide accessible healthcare to the local community. It marked the beginning of a lifelong commitment to patient care and medical excellence.' },
    { year: '2005', title: 'Expansion', desc: 'Added advanced cardiology and neurology centers.', details: 'Recognizing the growing need for specialized care, we inaugurated state-of-the-art cardiology and neurology wings, introducing world-class surgical facilities and advanced diagnostic equipment.' },
    { year: '2015', title: 'Global Recognition', desc: 'Awarded JCI accreditation for international quality.', details: 'Our relentless pursuit of quality was recognized globally when we received the prestigious JCI accreditation, putting us on the map as a leading healthcare destination for international patients.' },
    { year: '2023', title: 'Digital Transformation', desc: 'Launched full telemedicine and AI-assisted robotics.', details: 'Embracing the future of medicine, we integrated AI-assisted robotic surgeries and launched a comprehensive telemedicine platform to provide remote care across the country.' }
  ];

  const hospitalStats = [
    { label: 'Expert Doctors', value: 500, suffix: '+', icon: User },
    { label: 'Employees', value: 1200, suffix: '+', icon: Users },
    { label: 'Hospital Beds', value: 1000, suffix: '+', icon: Building },
    { label: 'ICU Beds', value: 250, suffix: '+', icon: Activity },
    { label: 'Ambulances', value: 200, suffix: '+', icon: Phone },
    { label: 'Patient Satisfaction', value: 98, suffix: '%', icon: HeartPulse }
  ];

  const features = [
    { title: 'World Class Infrastructure', desc: 'Modern facilities built for better care.', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925434/medisphere/about/team.jpg' },
    { title: 'Advanced Technology', desc: 'AI-powered diagnostics and treatment.', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg' },
    { title: 'Patient Experience', desc: 'Comfort, care and compassion.', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg' },
    { title: 'Awards & Recognition', desc: 'Recognized for excellence in healthcare.', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">

      {/* 1. Dark Premium Hero Section (Full height on mobile) */}
      <section className="relative w-full min-h-[100dvh] sm:min-h-[540px] lg:min-h-[620px] pt-16 pb-20 sm:pt-20 sm:pb-24 flex flex-col justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900 relative">
            <img src="https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925408/medisphere/about/about-hero-bg.png" alt="Hospital Exterior" className="w-full h-full object-cover opacity-80" />
          </div>
          {/* Lighter gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-footer)]/85 via-[var(--color-footer)]/60 to-[var(--color-footer)]/10"></div>
        </div>

        <div className="container mx-auto max-w-[1200px] px-4 relative z-10 text-white mb-6 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif font-bold leading-tight mb-4 sm:mb-6 max-w-3xl"
          >
            Transforming Healthcare Through <span className="text-[var(--color-accent)]">Innovation & Compassion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mb-6 sm:mb-8 leading-relaxed font-light"
          >
            At Medisphere, we combine advanced technology, world-class infrastructure, and compassionate care to deliver exceptional healthcare experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link to="/doctors" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[var(--color-secondary)] hover:bg-[var(--color-primary-hover)] text-white border-none h-11 sm:h-12 px-6 sm:px-8 text-sm">
                Meet Our Doctors <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/book-appointment" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 h-11 sm:h-12 px-6 sm:px-8 text-sm" variant="outline">
                Book Appointment
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Bottom Stats Bar (Absolute pinned to bottom of picture, ultra compact fit) */}
        <div className="absolute bottom-0 left-0 w-full bg-[var(--color-footer)]/95 backdrop-blur-md border-t border-white/10 py-1.5 sm:py-3 z-20 overflow-hidden">
          <div className="w-full px-1 sm:px-4">
            <div className="grid grid-cols-4 divide-x divide-white/15 items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-0.5 sm:px-2 text-center sm:text-left">
                <Clock className="h-3 w-3 sm:h-5 sm:w-5 text-[var(--color-accent)] shrink-0" strokeWidth={1.8} />
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-lg lg:text-xl font-serif font-bold text-white leading-none">30+</div>
                  <div className="text-[5.5px] sm:text-[9px] text-white/70 uppercase tracking-tight sm:tracking-wider leading-tight mt-0.5">Years Excellence</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-0.5 sm:px-2 text-center sm:text-left">
                <User className="h-3 w-3 sm:h-5 sm:w-5 text-[var(--color-accent)] shrink-0" strokeWidth={1.8} />
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-lg lg:text-xl font-serif font-bold text-white leading-none">500+</div>
                  <div className="text-[5.5px] sm:text-[9px] text-white/70 uppercase tracking-tight sm:tracking-wider leading-tight mt-0.5">Expert Doctors</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-0.5 sm:px-2 text-center sm:text-left">
                <Building className="h-3 w-3 sm:h-5 sm:w-5 text-[var(--color-accent)] shrink-0" strokeWidth={1.8} />
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-lg lg:text-xl font-serif font-bold text-white leading-none">1000+</div>
                  <div className="text-[5.5px] sm:text-[9px] text-white/70 uppercase tracking-tight sm:tracking-wider leading-tight mt-0.5">Hospital Beds</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-0.5 sm:px-2 text-center sm:text-left">
                <Users className="h-3 w-3 sm:h-5 sm:w-5 text-[var(--color-accent)] shrink-0" strokeWidth={1.8} />
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-lg lg:text-xl font-serif font-bold text-white leading-none">2M+</div>
                  <div className="text-[5.5px] sm:text-[9px] text-white/70 uppercase tracking-tight sm:tracking-wider leading-tight mt-0.5">Patients Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section (Compact & Mobile-Optimized) */}
      <section className="py-10 sm:py-16 lg:py-24 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded bg-[var(--color-card)] text-[var(--color-primary)] text-[10px] font-bold mb-3 sm:mb-5 border-l-2 border-[var(--color-accent)] uppercase tracking-widest shadow-xs">
                Our Story
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] leading-tight mb-3 sm:mb-5">
                A Legacy of Healing <br className="hidden sm:block" />and Compassion
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-[var(--color-foreground)] mb-3 sm:mb-4 leading-relaxed font-normal">
                Founded in 1995, Medisphere Hospital began with a simple mission: to provide compassionate, world-class medical care to our community. Today, we are a premier multi-specialty healthcare institution trusted by millions.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-foreground)] mb-6 sm:mb-8 leading-relaxed font-normal">
                Our commitment to excellence is reflected in our state-of-the-art technology, globally trained medical specialists, and patient-first philosophy.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-[var(--color-background-secondary)]/50 border border-[var(--color-border)]/60">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-[11px] sm:text-sm font-semibold text-[var(--color-heading)] leading-tight">Advanced Tech</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-[var(--color-background-secondary)]/50 border border-[var(--color-border)]/60">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Stethoscope className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-[11px] sm:text-sm font-semibold text-[var(--color-heading)] leading-tight">Top Specialists</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-[var(--color-background-secondary)]/50 border border-[var(--color-border)]/60">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-[11px] sm:text-sm font-semibold text-[var(--color-heading)] leading-tight">24/7 Emergency</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-[var(--color-background-secondary)]/50 border border-[var(--color-border)]/60">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <HeartPulse className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-[11px] sm:text-sm font-semibold text-[var(--color-heading)] leading-tight">Patient First</div>
                </div>
              </div>

              <Button className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm bg-[var(--color-primary)] text-white rounded-full">
                Read Chairman's Message
              </Button>
            </div>

            {/* Right Image Layout */}
            <div className="relative">
              <div className="w-full h-[280px] sm:h-[400px] lg:h-[600px] rounded-2xl sm:rounded-[32px] overflow-hidden bg-slate-200 border border-[var(--color-border)] shadow-lg relative">
                <img src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg" alt="Hospital Interior" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -right-6 -top-16 bg-white/70 backdrop-blur-lg rounded-[24px] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-white/50 w-[220px] flex flex-col gap-4 hidden xl:flex z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Clock className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-serif text-[var(--color-heading)] leading-none mb-0.5">30+</div>
                    <div className="text-[8px] uppercase tracking-[0.1em] font-bold text-[var(--color-muted)]">Years Experience</div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 w-full"></div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <User className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-serif text-[var(--color-heading)] leading-none mb-0.5">500+</div>
                    <div className="text-[8px] uppercase tracking-[0.1em] font-bold text-[var(--color-muted)]">Doctors</div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 w-full"></div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Building className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-serif text-[var(--color-heading)] leading-none mb-0.5">1000+</div>
                    <div className="text-[8px] uppercase tracking-[0.1em] font-bold text-[var(--color-muted)]">Beds</div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-60 w-full"></div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Users className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-serif text-[var(--color-heading)] leading-none mb-0.5">2M+</div>
                    <div className="text-[8px] uppercase tracking-[0.1em] font-bold text-[var(--color-muted)]">Patients Served</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Our Core Values Section (4 in 1 Line) */}
      <section className="py-10 sm:py-16 bg-[var(--color-background-secondary)]">
        <div className="container mx-auto max-w-[1300px] px-2.5 sm:px-4 text-center">
          <div className="mb-6 sm:mb-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">What Drives Us</h4>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] relative inline-block">
              Our Core Values
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-[var(--color-accent)] rounded-full"></div>
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6 mt-8 sm:mt-12">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-2 sm:p-5 lg:p-7 border border-[var(--color-border)] shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center">
                <div className="h-8 w-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full bg-[var(--color-background)] flex items-center justify-center mb-1.5 sm:mb-3 group-hover:-translate-y-1 transition-transform duration-300 border border-[var(--color-border)] shrink-0">
                  <val.icon className="h-4 w-4 sm:h-6 sm:w-6 text-[var(--color-primary)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[11px] sm:text-base lg:text-lg font-serif font-bold text-[var(--color-heading)] mb-1 leading-tight">{val.title}</h3>
                <p className="text-[8.5px] sm:text-xs text-[var(--color-foreground)] leading-snug line-clamp-2 sm:line-clamp-none font-normal">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Leadership Messages (2 cards in 1 line) */}
      <section className="py-10 sm:py-20 bg-[var(--color-background)] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-background-secondary)]/50 rounded-l-[150px] z-0"></div>

        <div className="container mx-auto max-w-[1300px] px-2.5 sm:px-4 relative z-10">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-12">

            {/* Chairman Message */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-10 border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row gap-2.5 sm:gap-6">
              <div className="shrink-0 flex items-center md:items-start justify-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-slate-200 border-2 sm:border-4 border-[var(--color-background-secondary)] relative shadow-xs">
                  <img src="/images/about/chairman-portrait.jpg" alt="Chairman" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] mb-1 sm:mb-2 truncate">Chairman's Message</h4>
                <p className="text-[10px] sm:text-xs lg:text-sm text-[var(--color-heading)] italic leading-relaxed mb-2 sm:mb-4 line-clamp-4 sm:line-clamp-none">
                  "Healthcare is not just about treating diseases, it is about caring for people. Our mission is to bring compassion, innovation, and excellence together."
                </p>
                <div>
                  <p className="font-bold font-serif text-[var(--color-heading)] text-xs sm:text-sm leading-tight truncate">Mr. Arvind Malhotra</p>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[var(--color-muted)] truncate">Chairman</p>
                </div>
              </div>
            </div>

            {/* CEO Message */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-10 border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row gap-2.5 sm:gap-6">
              <div className="shrink-0 flex items-center md:items-start justify-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-slate-200 border-2 sm:border-4 border-[var(--color-background-secondary)] relative shadow-xs">
                  <img src="/images/about/ceo-portrait.jpg" alt="CEO" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] mb-1 sm:mb-2 truncate">CEO's Message</h4>
                <p className="text-[10px] sm:text-xs lg:text-sm text-[var(--color-heading)] italic leading-relaxed mb-2 sm:mb-4 line-clamp-4 sm:line-clamp-none">
                  "With a patient-first approach and advanced technology, we are committed to delivering world-class healthcare and setting new benchmarks."
                </p>
                <div>
                  <p className="font-bold font-serif text-[var(--color-heading)] text-xs sm:text-sm leading-tight truncate">Dr. Rohan Malhotra</p>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[var(--color-muted)] truncate">Chief Executive Officer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Milestones of Excellence (Mobile Swipeable / Desktop Grid) */}
      <section className="py-12 sm:py-20 bg-[var(--color-background)] border-t border-[var(--color-border)]">
        <div className="container mx-auto max-w-[1300px] px-3 sm:px-4 text-center">
          <div className="mb-8 sm:mb-16">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2 sm:mb-3">Our Journey</h4>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] relative inline-block">
              Milestones of Excellence
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-[var(--color-accent)] rounded-full"></div>
            </h2>
          </div>

          {/* Mobile Swipe Navigation Controls */}
          <div className="flex items-center justify-between lg:hidden mb-4 px-2">
            <span className="text-[11px] font-medium text-slate-500">
              👈 Swipe left & right to view milestones
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMilestones('left')}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
                aria-label="Previous milestone"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollMilestones('right')}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
                aria-label="Next milestone"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Horizontal Line connecting timeline on Desktop */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--color-border)] hidden lg:block -translate-y-1/2"></div>

            {/* Mobile swipeable track / Desktop 4-col grid */}
            <div
              ref={milestonesRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 lg:grid lg:grid-cols-4 pt-3 pb-5 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="w-[84vw] max-w-[320px] sm:w-[320px] lg:w-auto shrink-0 snap-center bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 relative text-left overflow-hidden shadow-xs hover:shadow-md transition-all"
                >
                  {/* Timeline Dot on Desktop */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-white hidden lg:block -mt-2 z-20"></div>

                  {/* Large Year Watermark */}
                  <div className="absolute -top-2 -right-4 text-[75px] sm:text-[100px] leading-none font-serif font-black text-slate-100/80 z-0 select-none">
                    {ms.year}
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-[var(--color-primary)] text-xs sm:text-sm font-bold rounded mb-3 sm:mb-4">
                      {ms.year}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">{ms.title}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-5">{ms.desc}</p>
                    
                    <div className="w-10 h-1 bg-[var(--color-accent)] mb-3 sm:mb-5 rounded-full"></div>
                    
                    <p className="text-[12px] sm:text-[13.5px] text-slate-500 leading-relaxed text-justify">
                      {ms.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <Button variant="outline" className="rounded-full px-8 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border-none">
              View Full Timeline
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Hospital at a Glance (Single-Line Marquee) */}
      <section className="py-8 sm:py-14 bg-[var(--color-background-secondary)] border-y border-[var(--color-border)] overflow-hidden">
        <div className="container mx-auto max-w-[1300px] px-4 text-center mb-5 sm:mb-8">
          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-heading)]">Hospital at a Glance</h4>
        </div>

        {/* Full-width Single-Line Infinite Marquee Strip */}
        <div className="relative w-full overflow-hidden">
          {/* Left & Right gradient edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--color-background-secondary)] to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--color-background-secondary)] to-transparent z-10"></div>

          <motion.div
            className="flex items-center gap-4 sm:gap-8 w-max py-1"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 25
            }}
          >
            {[...hospitalStats, ...hospitalStats, ...hospitalStats, ...hospitalStats].map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl border border-[var(--color-border)] shadow-xs shrink-0 group hover:border-[var(--color-accent)] hover:shadow-md transition-all"
              >
                <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[var(--color-background)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border)] shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </div>
                <div className="text-left whitespace-nowrap">
                  <div className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-heading)] leading-none">
                    <span>{stat.value}</span>
                    <span className="text-[var(--color-accent)]">{stat.suffix}</span>
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] font-bold text-[var(--color-foreground)] uppercase tracking-[0.08em] mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Features / Infrastructure Grid (2 per line on mobile) */}
      <section className="py-8 sm:py-16 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-2.5 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white border border-[var(--color-border)] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="h-28 sm:h-40 bg-slate-200 relative overflow-hidden">
                    <img src={feat.img} alt={feat.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="font-serif font-bold text-[var(--color-heading)] text-xs sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">{feat.title}</h3>
                    <p className="text-[10px] sm:text-xs text-[var(--color-foreground)] mb-2 sm:mb-4 line-clamp-2 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
                <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                  <a href="#" className="inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Footer Banner (Mobile-Optimized) */}
      <section className="py-6 sm:py-12 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-2.5 sm:px-4">
          <div className="bg-gradient-to-br from-[var(--color-footer)] to-[#152e25] rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden relative shadow-xl border border-white/10">
            {/* Decorative background circle */}
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 py-6 sm:py-10 px-4 sm:px-8 lg:px-12 flex flex-col justify-center relative z-10">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[var(--color-accent)] text-[9px] sm:text-[10px] font-bold mb-3 sm:mb-4 uppercase tracking-[0.15em] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                  24/7 Support Available
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-2 sm:mb-3 leading-tight">
                  Your Health is Our <br className="hidden lg:block" /><span className="text-[var(--color-accent)]">Greatest Priority</span>
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-white/80 mb-4 sm:mb-6 max-w-md font-light leading-relaxed">
                  Experience world-class healthcare with our team of expert specialists. Book an appointment or visit us today.
                </p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-4">
                  <Link to="/book-appointment" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 h-10 sm:h-12 lg:h-14 px-3 sm:px-8 rounded-full border-none whitespace-nowrap shadow-[0_10px_25px_rgba(200,169,106,0.3)] transition-all hover:-translate-y-0.5 text-xs sm:text-sm lg:text-base font-semibold">
                      Book Appointment
                    </Button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-10 sm:h-12 lg:h-14 px-3 sm:px-8 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm lg:text-base font-semibold">
                      Contact Hospital
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative hidden lg:block p-4">
                {/* Image Container with elegant rounded edge */}
                <div className="absolute inset-y-4 right-4 left-0 bg-white rounded-l-[100px] rounded-r-[32px] overflow-hidden shadow-2xl border-4 border-white/20">
                  <img src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925411/medisphere/about/cta-docter.jpg" alt="Doctors" loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
