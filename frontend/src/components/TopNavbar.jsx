import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import axios from 'axios';
import { Input } from './Input';
import { Button } from './Button';

export function TopNavbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.role === 'doctor') {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/appointments/doctor/${userInfo._id}/dashboard`);
          if (data.recentActivity) {
            setNotifications(data.recentActivity);
          }
        } catch (error) {
          console.error("Error fetching notifications", error);
        }
      }
    };
    
    // Only fetch if dropdown might be opened, or just fetch on load
    fetchNotifications();
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={onMenuClick}>
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-[var(--color-border)] lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <form className="relative flex flex-1" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">Search</label>
          <div className="relative w-full max-w-md flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-[var(--color-muted-foreground)]" aria-hidden="true" />
            <input
              id="search-field"
              className="block h-10 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-muted)]/50 pl-10 pr-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="Search patients, doctors... (Ctrl+K)"
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6 relative">
          <button 
            type="button" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="-m-2.5 p-2.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors relative"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            {notifications.filter(n => !readNotifications.has(n._id)).length > 0 && (
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[var(--color-danger)] border-2 border-[var(--color-background)]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
<span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-1 rounded-full font-semibold">
                  {notifications.filter(n => !readNotifications.has(n._id)).length} New
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div key={idx} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${readNotifications.has(notif._id) ? 'opacity-50' : ''}`}>
                      <div className="flex items-start gap-2">
                        {!readNotifications.has(notif._id) && (
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0"></span>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${readNotifications.has(notif._id) ? 'text-slate-400' : 'text-slate-800'}`}>
                            {notif.patient ? notif.patient.name : 'A patient'} {notif.status === 'Completed' ? 'completed a consultation' : `booked a ${notif.type}`}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(notif.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No new notifications.
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
<button 
                  onClick={() => {
                    setReadNotifications(new Set(notifications.map(n => n._id)));
                    setShowNotifications(false);
                  }}
                  className="text-sm text-[var(--color-primary)] font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={notifications.every(n => readNotifications.has(n._id))}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--color-border)]" aria-hidden="true" />
          
          <Button variant="primary" size="sm" className="hidden sm:flex rounded-full">
            + New Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
