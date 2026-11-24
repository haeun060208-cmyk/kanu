import React, { useState } from 'react';
import { Sliders, Coffee, Zap, Droplets, CheckCircle2 } from 'lucide-react';
import baristaMachineImg from '../assets/images/kanu_barista_machine_1794291168790.jpg';

export const MachineShowcase: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'espresso' | 'americano' | 'iced'>('americano');
  const [selectedColor, setSelectedColor] = useState<'black' | 'cream' | 'bronze'>('black');

  const drinkModes = {
    espresso: {
      name: '에스프레소 Espresso',
      volume: '25ml',
      temp: '92°C 고온 고압',
      bypassRatio: '0% (원액 100%)',
      desc: '풍부하고 두터운 황금빛 크레마와 농밀한 원두 아로마를 그대로 추출합니다.',
    },
    americano: {
      name: '핫 아메리카노 Americano',
      volume: '130ml',
      temp: '88°C 온수 바이패스',
      bypassRatio: '75% 전용 온수 노즐',
      desc: '에스프레소 노즐과 온수 노즐이 분리되어 텁텁한 잡미 없이 원두 본연의 깔끔한 풍미를 전합니다.',
    },
    iced: {
      name: '아이스 아메리카노 Iced Mode',
      volume: '160ml (얼음 최적화)',
      temp: '저온 바이패스 블렌딩',
      bypassRatio: '65% 쿨 워터 노즐',
      desc: '얼음이 빠르게 녹지 않도록 최적화된 저온 워터 공급으로 끝까지 시원하고 진한 맛을 유지합니다.',
    },
  };

  return (
    <section id="machine-showcase" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Subheading */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-3">
          Barista Machine Innovation
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-2xl text-balance">
          카누 바리스타 머신
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl">
          에스프레소 노즐과 온수 노즐이 완전히 분리된 독자적 듀얼 노즐 바이패스.
          전문 바리스타의 정밀한 물 조절 테크놀로지를 일상으로 가져옵니다.
        </p>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Machine Visual Display (7 Cols) */}
        <div className="lg:col-span-7 relative group">
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#141519] shadow-2xl">
            <img
              src={baristaMachineImg}
              alt="KANU Barista Capsule Espresso Machine"
              referrerPolicy="no-referrer"
              className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Machine Badge */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
              <span className="text-xs font-medium text-white tracking-wide">KANU Barista Breve</span>
            </div>

            {/* Bottom Machine Highlights */}
            <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#c5a059]" />
                <span>9.5 Bar 골든 탬핑 추출</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#c5a059]" />
                <span>독립 듀얼 노즐 바이패스</span>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Interactive Configurator & Feature Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold">
              Interactive Extraction Modes
            </span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-3">
              한 번의 터치로 완성되는 3가지 모드
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              아래 버튼을 선택하여 카누 바리스타 머신의 독창적인 추출 메커니즘을 미리 확인해 보세요.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10">
            {(['espresso', 'americano', 'iced'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                  selectedMode === mode
                    ? 'bg-[#c5a059] text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode === 'espresso' ? '에스프레소' : mode === 'americano' ? '아메리카노' : '아이스 모드'}
              </button>
            ))}
          </div>

          {/* Selected Mode Detail Card */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <Coffee className="w-4 h-4 text-[#c5a059]" />
                <span>{drinkModes[selectedMode].name}</span>
              </div>
              <span className="text-xs font-mono bg-[#c5a059]/20 text-[#c5a059] px-2.5 py-0.5 rounded-full font-bold">
                {drinkModes[selectedMode].volume}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {drinkModes[selectedMode].desc}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <div className="text-zinc-500 mb-0.5">추출 온도 및 방식</div>
                <div className="text-zinc-200 font-medium">{drinkModes[selectedMode].temp}</div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <div className="text-zinc-500 mb-0.5">바이패스 노즐 비율</div>
                <div className="text-zinc-200 font-medium">{drinkModes[selectedMode].bypassRatio}</div>
              </div>
            </div>
          </div>

          {/* Color Finish Selection */}
          <div className="pt-2">
            <div className="text-xs text-zinc-400 mb-2 font-medium">머신 시그니처 컬러 (Color Finishes):</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedColor('black')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                  selectedColor === 'black'
                    ? 'border-[#c5a059] bg-[#c5a059]/10 text-white'
                    : 'border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#18181b] border border-zinc-700" />
                <span>어반 블랙 (Urban Black)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedColor('cream')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                  selectedColor === 'cream'
                    ? 'border-[#c5a059] bg-[#c5a059]/10 text-white'
                    : 'border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#ece6dc] border border-zinc-400" />
                <span>소프트 크림 (Soft Cream)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
