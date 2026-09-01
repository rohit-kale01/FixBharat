import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bell, Globe, Check } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { languages, type Language } from '@/lib/i18n';
import { formatTimeAgo } from '@/lib/utils';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { notifications, markNotificationRead, language, setLanguage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/report', label: t('nav.report') },
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/map', label: t('nav.map') },
    { to: '/agents', label: t('nav.agents') },
    { to: '/complaints', label: t('nav.complaints') },
    { to: '/admin', label: t('nav.admin') },
    { to: '/demo', label: t('nav.demo') },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-saffron-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-navy-900">BharatFix</span>
              <span className="text-[10px] text-navy-500 font-medium tracking-wide">AI Civic Resolution</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-navy-100 text-navy-900'
                      : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); }}
                className="p-2 rounded-lg hover:bg-navy-100 transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-5 h-5 text-navy-700" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 card shadow-xl py-2 z-50 animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code as Language); setLangOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-navy-50 transition-colors ${
                        language === lang.code ? 'text-saffron-600 font-semibold' : 'text-navy-700'
                      }`}
                    >
                      <span>{lang.nativeLabel}</span>
                      {language === lang.code && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setLangOpen(false); }}
                className="p-2 rounded-lg hover:bg-navy-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-navy-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card shadow-xl z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-navy-100">
                    <h3 className="font-semibold text-navy-900 text-sm">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-navy-400 text-sm">No notifications</div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full px-4 py-3 text-left border-b border-navy-50 hover:bg-navy-50 transition-colors ${!n.read ? 'bg-saffron-50/50' : ''}`}
                      >
                        <p className="text-sm text-navy-800">{n.message}</p>
                        <p className="text-xs text-navy-400 mt-1">{formatTimeAgo(n.timestamp)}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link to="/report" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
              {t('hero.cta.report')}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-navy-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-navy-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'bg-navy-100 text-navy-900' : 'text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/report" className="btn-primary mt-2">
                {t('hero.cta.report')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
