'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  activePage: 'home' | 'roster' | 'agents' | 'contact';
};

export default function Header({ activePage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Players', href: '/', id: 'home' },
    { name: 'Roster', href: '/roster', id: 'roster' },
    { name: 'Agents', href: '/agents', id: 'agents' },
    { name: 'Contact', href: '/contact', id: 'contact' },
  ];

  return (
    <header className="border-b border-emerald-700 sticky top-0 z-50 bg-[#0a3d28] text-white relative">
      {/* Pitch Lines & Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)' }}></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/40"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10">
        <a href="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-amber-400">11</span>WINS
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-amber-100">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={link.href} 
              className={activePage === link.id ? "text-amber-400" : "hover:text-amber-200 transition-colors duration-300"}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          type="button"
          className="md:hidden text-white focus:outline-none p-2 cursor-pointer hover:text-amber-400 transition-colors" 
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a3d28] border-t border-emerald-700 shadow-2xl z-50">
          <nav className="flex flex-col p-6 gap-4 text-lg font-medium text-amber-100">
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={link.href} 
                className={activePage === link.id ? "text-amber-400" : "hover:text-amber-200 transition-colors duration-300"}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}