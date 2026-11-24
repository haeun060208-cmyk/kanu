import React from 'react';
import { ArrowUpRight, Sparkles, Droplets, ShieldCheck, Flame } from 'lucide-react';
import heroAmbienceImg from '../assets/images/kanu_hero_ambience_1794291168164.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Cinematic Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroAmbienceImg}
          alt="KANU Espresso Ambience with Golden Crema"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in"
        />
        {/* Measured Scrims (Ensures 4.5:1 WCAG Contrast) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d] via-[#0a0b0d]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-[#0a0b0d]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="max-w-3xl">
          {/* Subtle Editorial Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#e8be6b] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase font-medium">Maxim KANU Renewal 2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200">The Smallest Cafe in the World</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15] text-balance mb-6">
            세상에서 가장 작은 카페, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#f5efe6] via-[#e2c17d] to-[#c5a059] bg-clip-text text-transparent">
              카누(KANU)의 새로운 정의
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
            9.5 Bar 고압 추출로 완성한 황금빛 벨벳 크레마와 -196°C 마이크로그라인딩 공법의 깊은 아로마.
            손끝에서 회전하는 3D 캡슐 컬렉션과 신형 바리스타 머신을 만나보세요.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#capsules-3d"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56f] text-black font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(197,160,89,0.3)] active:scale-[0.99] whitespace-nowrap"
            >
              <span>3D 캡슐 스튜디오 둘러보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="#machine-showcase"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-medium text-sm transition-colors whitespace-nowrap"
            >
              <span>바리스타 머신 라인업</span>
            </a>
          </div>

          {/* Adjacent Quantitative Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>골든 크레마</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">9.5 <span className="text-xs font-normal text-zinc-400">Bar</span></div>
              <div className="text-[11px] text-zinc-400 mt-0.5">이상적인 에스프레소 압력</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>초미세 분쇄</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">-196 <span className="text-xs font-normal text-zinc-400">°C</span></div>
              <div className="text-[11px] text-zinc-400 mt-0.5">원두 향미 보존 마이크로공법</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>산소 차단율</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">100 <span className="text-xs font-normal text-zinc-400">%</span></div>
              <div className="text-[11px] text-zinc-400 mt-0.5">특수 알루미늄 밀폐 캡슐</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>캡슐 라인업</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">12 <span className="text-xs font-normal text-zinc-400">Varieties</span></div>
              <div className="text-[11px] text-zinc-400 mt-0.5">라이트부터 다크·디카페인까지</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
