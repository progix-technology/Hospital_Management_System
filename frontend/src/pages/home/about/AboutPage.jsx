import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, HeartPulse, Activity, User, Award, CheckCircle2, Phone,
  Stethoscope, Clock, Users, Building, Shield
} from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '../../../components/Button';

export default function AboutPage() {
  const coreValues = [
    { icon: HeartPulse, title: 'Compassion', desc: 'We care with empathy, dignity and respect for every patient.' },
    { icon: Shield, title: 'Integrity', desc: 'We uphold transparency and honesty in every interaction.' },
    { icon: Activity, title: 'Innovation', desc: 'We embrace technology and innovation to deliver better outcomes.' },
    { icon: Award, title: 'Excellence', desc: 'We strive for the highest standards in everything we do.' },
    { icon: ShieldCheck, title: 'Trust', desc: 'We build trust through reliable care and strong relationships.' },
    { icon: User, title: 'Patient First', desc: 'Our patients are at the heart of every decision we make.' }
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

      {/* 1. Dark Premium Hero Section */}
      <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900 relative">
            <img src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925408/medisphere/about/about-hero-bg.png" alt="Hospital Exterior" className="w-full h-full object-cover opacity-80" />
          </div>
          {/* Lighter gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-footer)]/85 via-[var(--color-footer)]/60 to-[var(--color-footer)]/10"></div>
        </div>

        <div className="container mx-auto max-w-[1200px] px-4 relative z-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium mb-8 text-[var(--color-accent)] uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
            <span>About Us</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[64px] font-serif font-bold leading-[1.1] mb-6 max-w-3xl"
          >
            Transforming Healthcare Through <span className="text-[var(--color-accent)]">Innovation & Compassion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed font-light"
          >
            At Medisphere, we combine advanced technology, world-class infrastructure, and compassionate care to deliver exceptional healthcare experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/doctors">
              <Button className="bg-[var(--color-secondary)] hover:bg-[var(--color-primary-hover)] text-white border-none h-12 px-8">
                Meet Our Doctors <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/book-appointment">
              <Button className="bg-transparent border-white/30 text-white hover:bg-white/10 h-12 px-8" variant="outline">
                Book Appointment
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Bottom Stats Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[var(--color-footer)]/80 backdrop-blur-md border-t border-white/10 py-6 z-20">
          <div className="container mx-auto max-w-[1200px] px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
              <div className="flex items-center gap-4 px-4">
                <Clock className="h-8 w-8 text-[var(--color-accent)]" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-serif font-bold text-white">30+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">Years of Excellence</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4">
                <User className="h-8 w-8 text-[var(--color-accent)]" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-serif font-bold text-white">500+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">Expert Doctors</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4">
                <Building className="h-8 w-8 text-[var(--color-accent)]" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-serif font-bold text-white">1000+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">Hospital Beds</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4">
                <Users className="h-8 w-8 text-[var(--color-accent)]" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-serif font-bold text-white">2M+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">Patients Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded bg-[var(--color-card)] text-[var(--color-primary)] text-[10px] font-bold mb-6 border-l-2 border-[var(--color-accent)] uppercase tracking-widest shadow-sm">
                Our Story
              </div>

              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-heading)] leading-[1.15] mb-6">
                A Legacy of Healing <br />and Compassion
              </h2>

              <p className="text-base text-[var(--color-foreground)] mb-6 leading-relaxed">
                Founded in 1995, Medisphere Hospital began with a simple mission: to provide compassionate, world-class medical care to our community. Today, we are a 50+ bed multi-specialty healthcare institution trusted by millions.
              </p>
              <p className="text-base text-[var(--color-foreground)] mb-10 leading-relaxed">
                Our commitment to excellence is reflected in our state-of-the-art technology, our globally trained medical professionals, and our patient-first philosophy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-heading)]">Advanced Technology</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Stethoscope className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-heading)]">Expert Specialists</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-heading)]">24/7 Emergency Care</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <HeartPulse className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-heading)]">Patient-Centric Approach</div>
                </div>
              </div>

              <Button className="h-12 px-8 bg-[var(--color-primary)] text-white rounded-full">
                Read Chairman's Message
              </Button>
            </div>

            {/* Right Image Layout */}
            <div className="relative">
              <div className="w-full h-[600px] rounded-[32px] overflow-hidden bg-slate-200 border border-[var(--color-border)] shadow-lg relative">
                <img src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg" alt="Hospital Interior" className="w-full h-full object-cover" />

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

      {/* 3. Our Core Values Section */}
      <section className="py-20 bg-[var(--color-background-secondary)]">
        <div className="container mx-auto max-w-[1300px] px-4 text-center">
          <div className="mb-12">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">What Drives Us</h4>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] relative inline-block">
              Our Core Values
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--color-accent)] rounded-full"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-10 border border-[var(--color-border)] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-[var(--color-background)] flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-[var(--color-border)]">
                  <val.icon className="h-7 w-7 text-[var(--color-primary)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[var(--color-heading)] mb-3">{val.title}</h3>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Leadership Messages */}
      <section className="py-24 bg-[var(--color-background)] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-background-secondary)]/50 rounded-l-[150px] z-0"></div>

        <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

            {/* Chairman Message */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row gap-8">
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-[var(--color-background-secondary)] relative">
                  <img src="/images/about/chairman-portrait.jpg" alt="Chairman" className="w-full h-full object-cover" />

                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] mb-4">Chairman's Message</h4>
                <div className="text-[var(--color-accent)] text-4xl font-serif leading-none mb-2">"</div>
                <p className="text-sm text-[var(--color-heading)] italic leading-relaxed mb-6">
                  Healthcare is not just about treating diseases, it is about caring for people. Our mission is to bring compassion, innovation, and excellence together to create a healthier tomorrow.
                </p>
                <div>
                  {/* Signature Placeholder */}
                  <div className="h-8 w-32 bg-[var(--color-background-secondary)] rounded mb-2 border border-dashed border-[var(--color-border)] flex items-center justify-center">
                    <span className="text-[10px] text-[var(--color-muted)] italic">Signature</span>
                  </div>
                  <p className="font-bold font-serif text-[var(--color-heading)] text-sm">Mr. Arvind Malhotra</p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Chairman, Medisphere Hospital</p>
                </div>
              </div>
            </div>

            {/* CEO Message */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row gap-8">
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-[var(--color-background-secondary)] relative">
                  <img src="/images/about/ceo-portrait.jpg" alt="CEO" className="w-full h-full object-cover" />

                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] mb-4">CEO's Message</h4>
                <div className="text-[var(--color-accent)] text-4xl font-serif leading-none mb-2">"</div>
                <p className="text-sm text-[var(--color-heading)] italic leading-relaxed mb-6">
                  With a patient-first approach and advanced technology, we are committed to delivering world-class healthcare and setting new benchmarks in medical excellence.
                </p>
                <div>
                  {/* Signature Placeholder */}
                  <div className="h-8 w-32 bg-[var(--color-background-secondary)] rounded mb-2 border border-dashed border-[var(--color-border)] flex items-center justify-center">
                    <span className="text-[10px] text-[var(--color-muted)] italic">Signature</span>
                  </div>
                  <p className="font-bold font-serif text-[var(--color-heading)] text-sm">Dr. Rohan Malhotra</p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Chief Executive Officer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Milestones of Excellence */}
      <section className="py-20 bg-[var(--color-background)] border-t border-[var(--color-border)]">
        <div className="container mx-auto max-w-[1300px] px-4 text-center">
          <div className="mb-20">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">Our Journey</h4>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] relative inline-block">
              Milestones of Excellence
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--color-accent)] rounded-full"></div>
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal Line connecting timeline */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--color-border)] hidden lg:block -translate-y-1/2"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
              {milestones.map((ms, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200 relative text-left overflow-hidden">
                  {/* Timeline Dot on Desktop */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-white hidden lg:block -mt-2 z-20"></div>

                  {/* Large Year Watermark */}
                  <div className="absolute -top-2 -right-4 text-[100px] leading-none font-serif font-black text-slate-50 z-0 select-none">
                    {ms.year}
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-[var(--color-primary)] text-sm font-bold rounded mb-4">
                      {ms.year}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{ms.title}</h3>
                    <p className="text-sm font-semibold text-slate-700 mb-5">{ms.desc}</p>
                    
                    <div className="w-10 h-1 bg-[var(--color-accent)] mb-5 rounded-full"></div>
                    
                    <p className="text-[13.5px] text-slate-500 leading-relaxed text-justify">
                      {ms.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <Button variant="outline" className="rounded-full px-8 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border-none">
              View Full Timeline
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Hospital at a Glance (Stats Grid) */}
      <section className="py-20 bg-[var(--color-background-secondary)] border-y border-[var(--color-border)]">
        <div className="container mx-auto max-w-[1300px] px-4 text-center">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-heading)] mb-12">Hospital at a Glance</h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-10 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]/80">
            {hospitalStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center group">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] mb-4 border border-[var(--color-border)] shadow-sm">
                  <stat.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-serif font-bold text-[var(--color-heading)] leading-none mb-2">
                  {React.createElement(CountUp.default || CountUp, { end: stat.value, duration: 2.5 })}
                  <span className="text-[var(--color-accent)]">{stat.suffix}</span>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-foreground)] uppercase tracking-[0.1em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Features / Infrastructure Grid */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm group">
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10"></div>

                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-[var(--color-heading)] text-lg mb-2">{feat.title}</h3>
                  <p className="text-xs text-[var(--color-foreground)] mb-4">{feat.desc}</p>
                  <a href="#" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Footer Banner */}
      <section className="py-12 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="bg-gradient-to-br from-[var(--color-footer)] to-[#152e25] rounded-[40px] overflow-hidden relative shadow-2xl border border-white/10">
            {/* Decorative background circle */}
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 py-8 lg:py-10 px-8 lg:px-12 flex flex-col justify-center relative z-10">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-[var(--color-accent)] text-[10px] font-bold mb-4 uppercase tracking-[0.2em] w-fit">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                  24/7 Support Available
                </div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-3 leading-tight">
                  Your Health is Our <br className="hidden lg:block" /><span className="text-[var(--color-accent)]">Greatest Priority</span>
                </h2>
                <p className="text-base text-white/80 mb-6 max-w-md font-light leading-relaxed">
                  Experience world-class healthcare with our team of expert specialists. Book an appointment or visit us today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/book-appointment">
                    <Button className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 h-14 px-8 rounded-full border-none whitespace-nowrap shadow-[0_10px_30px_rgba(200,169,106,0.3)] transition-all hover:-translate-y-1 text-base">
                      Book Appointment
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-14 px-8 rounded-full whitespace-nowrap transition-all text-base">
                      Contact Hospital
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative hidden lg:block p-4">
                {/* Image Container with elegant rounded edge */}
                <div className="absolute inset-y-4 right-4 left-0 bg-white rounded-l-[100px] rounded-r-[32px] overflow-hidden shadow-2xl border-4 border-white/20">
                  <img src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925411/medisphere/about/cta-docter.jpg" alt="Doctors" className="w-full h-full object-cover object-center" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
