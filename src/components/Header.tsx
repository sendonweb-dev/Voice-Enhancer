import React, { useState, useEffect } from 'react';
import { Volume2, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About Us', href: 'about.html' },
    { label: 'Blog & Guides', href: 'blog.html' },
    { label: 'FAQ', href: 'faq.html' },
    { label: 'Contact', href: 'contact.html' },
  ];

  const scrollToWorkstation = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('workstation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 shadow-2xs'
          : 'bg-white border-b border-neutral-100 py-4 md:py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 max-w-7xl">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center space-x-2.5 group text-left cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-transform duration-200 group-hover:scale-105">
            <Volume2 className="h-4 w-4" />
          </div>
          <span className="text-base md:text-lg font-black tracking-tight text-neutral-900 uppercase">
            VoiceEnhancer<span className="text-neutral-400">.io</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all px-3.5 py-2 rounded-md cursor-pointer"
            >
              {item.label}
            </a>
          ))}

          <div className="ml-4 pl-4 border-l border-neutral-200">
            <a
              href="#workstation"
              onClick={scrollToWorkstation}
              className="rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white uppercase tracking-widest transition-all hover:bg-neutral-800 active:scale-95 cursor-pointer inline-block"
            >
              Launch Studio
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 absolute top-full left-0 w-full shadow-lg transition-all">
          <div className="flex flex-col p-6 space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-neutral-100">
              <a
                href="#workstation"
                onClick={scrollToWorkstation}
                className="block w-full text-center rounded-lg bg-black px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white active:scale-95 transition-transform"
              >
                Launch Studio
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
