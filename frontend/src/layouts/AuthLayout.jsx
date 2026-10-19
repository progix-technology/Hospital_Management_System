import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const [bgImage, setBgImage] = useState('/patientlogin.png');
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Left Branding Side (Hidden on mobile) */}
      <div className="hidden lg:w-[45%] xl:w-[42%] flex-col justify-between bg-slate-900 p-8 xl:p-12 text-white lg:flex relative overflow-hidden transition-all duration-700 h-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 transition-opacity duration-700">
          <img src={bgImage} alt="Auth Background" className="w-full h-full object-cover opacity-60 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/90 to-[var(--color-primary)]/40 mix-blend-multiply"></div>
        </div>

        {/* Background Decorative Circles */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl z-0"></div>
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-2xl z-0"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 w-fit hover:opacity-90 transition-opacity">
            <img src="/applogo.png" alt="Logo" className="h-10 w-10 object-contain rounded-xl shadow-lg bg-white p-1" />
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-sky-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent">Medisphere</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="mb-4 text-3xl xl:text-4xl font-bold leading-tight">
            Enterprise Healthcare
          </h1>
          <p className="text-xs xl:text-sm text-blue-100 opacity-90 leading-relaxed">
            A world-class platform designed to streamline hospital operations, empower doctors, and provide exceptional patient care.
          </p>
        </div>

        <div className="relative z-10 text-xs text-blue-200">
          &copy; {new Date().getFullYear()} Medisphere. All rights reserved.
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex flex-1 flex-col justify-start lg:justify-center px-3 sm:px-8 md:px-12 py-4 sm:py-8 h-full overflow-y-auto bg-[#f8f9fa] relative">
        {/* Background Shape */}
        <div className="absolute top-0 left-0 w-full h-[22vh] sm:h-[26vh] bg-[#1b4d3e] rounded-b-[36px] sm:rounded-b-[50px] z-0"></div>

        <div className={`mx-auto w-full ${isRegister ? 'max-w-2xl' : 'max-w-md'} relative z-10 flex flex-col justify-center my-auto py-2`}>
          {/* Mobile Top Header (Logo + Home Link) */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/applogo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-xl shadow-md p-1 bg-white" />
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">Medisphere</span>
            </Link>
            <Link 
              to="/" 
              className="text-[11px] sm:text-xs font-bold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-lg border border-white/20 backdrop-blur-sm transition-all"
            >
              &larr; Home
            </Link>
          </div>

          <Outlet context={{ setBgImage }} />
        </div>
      </div>
    </div>
  );
}
