import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Calendar, Settings, FileText, HeartPulse, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/admin/patients', icon: Users },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Doctors', href: '/admin/doctors', icon: HeartPulse },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: Activity },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-background)]">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[var(--color-border)]">
        <Link to="/admin/dashboard" onClick={onClose} className="flex items-center gap-3 hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer">
          <img src="/applogo.png" alt="Logo" className="h-8 w-8 object-contain rounded-lg p-1 bg-[var(--color-primary)]" />
          <span className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Medisphere</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>
      
      {/* Sidebar Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-2">
        <div className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2 px-2">Main Menu</div>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm" 
                  : "text-[var(--color-foreground)]/80 hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("h-5 w-5 shrink-0 transition-colors duration-200", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]")}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="h-9 w-9 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{userInfo.name || 'Admin'}</span>
              <span className="text-xs text-[var(--color-muted-foreground)] capitalize">{userInfo.role || 'Administrator'}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              if (onClose) onClose();
              handleLogout();
            }}
            className="flex items-center gap-2 w-full p-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r border-[var(--color-border)] bg-[var(--color-background)] lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          ></div>

          {/* Drawer content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[var(--color-background)] focus:outline-none transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
