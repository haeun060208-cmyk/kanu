import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Sparkles, Coffee } from 'lucide-react';
import { CapsuleItem } from '../types/kanu';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCapsuleByNav: (capsuleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onSelectCapsuleByNav,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for subtle frosted glass elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: '3D 캡슐 컬렉션', href: '#capsules-3d' },
    { label: '바리스타 머신', href: '#machine-showcase' },
    { label: '캡슐 라인업', href: '#capsule-catalog' },
    { label: '카누 헤리티지', href: '#brand-story' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c0d0f]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
            : 'bg-gradient-to-b from-[#0c0d0f]/95 via-[#0c0d0f]/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single line, whitespace-nowrap shrink-0) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#8d6928] flex items-center justify-center shadow-md">
              <span className="font-bold text-xs text-black tracking-tighter">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-[0.22em] text-lg sm:text-xl font-serif text-white group-hover:text-[#c5a059] transition-colors">
                KANU
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 Concise Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Cart + Animated Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="장바구니 열기"
              className="relative p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#c5a059]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c5a059] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button (Desktop) */}
            <a
              href="#capsules-3d"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#c5a059] hover:bg-[#d9b672] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              3D 캡슐 체험
            </a>

            {/* Mobile Hamburger Button with Smooth 3-Line to X Morphing Animation */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/10 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] hover:bg-white/10 transition-colors"
            >
              {/* Top Bar */}
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-[#c5a059]' : ''
                }`}
              />
              {/* Middle Bar */}
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              {/* Bottom Bar */}
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-[#c5a059]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Backdrop Scrim */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Slide-down Panel */}
        <div
          className={`absolute top-0 inset-x-0 max-h-[90vh] bg-[#0f1013] border-b border-white/10 pt-24 pb-8 px-6 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out transform ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Mobile Nav Links with Staggered Visual Feel */}
          <div className="space-y-4">
            <div className="text-[11px] font-semibold tracking-widest text-[#c5a059] uppercase mb-2">
              Navigation Menu
            </div>
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 rounded-xl text-lg font-medium text-zinc-100 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono">0{idx + 1}</span>
                    <span>{link.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </a>
              ))}
            </nav>

            {/* Quick 3D Capsule Shortcuts in Mobile Drawer */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-xs text-zinc-400 mb-2 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>시그니처 캡슐 바로가기</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCapsuleByNav('bold-dark');
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('capsules-3d');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-left text-xs text-zinc-200 hover:border-[#c5a059]/40"
                >
                  <span className="w-3 h-3 rounded-full bg-[#18191c] border border-gold" />
                  <span className="truncate">볼드 다크 (Lv.11)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCapsuleByNav('silky-light');
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('capsules-3d');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-left text-xs text-zinc-200 hover:border-[#c5a059]/40"
                >
                  <span className="w-3 h-3 rounded-full bg-[#d8b98b]" />
                  <span className="truncate">실키 라이트 (Lv.4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom CTAs */}
          <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>장바구니 ({cartCount}개)</span>
            </button>

            <a
              href="#capsules-3d"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d9b672] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Coffee className="w-4 h-4" />
              <span>3D 캡슐 스튜디오 열기</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
