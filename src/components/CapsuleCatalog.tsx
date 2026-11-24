import React, { useState } from 'react';
import { Sparkles, Eye, Plus, Check } from 'lucide-react';
import { CapsuleItem } from '../types/kanu';

interface CapsuleCatalogProps {
  capsules: CapsuleItem[];
  onSelectIn3D: (capsule: CapsuleItem) => void;
  onAddToCart: (capsule: CapsuleItem) => void;
}

export const CapsuleCatalog: React.FC<CapsuleCatalogProps> = ({
  capsules,
  onSelectIn3D,
  onAddToCart,
}) => {
  const [filter, setFilter] = useState<'all' | 'dark' | 'medium' | 'light' | 'decaf'>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filteredCapsules = capsules.filter((c) => {
    if (filter === 'all') return true;
    return c.roastCategory === filter;
  });

  const handleAdd = (capsule: CapsuleItem) => {
    onAddToCart(capsule);
    setAddedIds((prev) => ({ ...prev, [capsule.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [capsule.id]: false }));
    }, 1800);
  };

  return (
    <section id="capsule-catalog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-2 block">
            Capsule Lineup & Flavor Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            카누 바리스타 전용 캡슐 컬렉션
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            원두 본연의 신선함과 산소 접촉을 완벽히 차단한 100% 알루미늄 밀폐 캡슐.
          </p>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10 overflow-x-auto">
          {[
            { id: 'all', label: '전체 All' },
            { id: 'dark', label: '다크 로스트' },
            { id: 'medium', label: '미디엄 로스트' },
            { id: 'light', label: '라이트 로스트' },
            { id: 'decaf', label: '디카페인' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === tab.id
                  ? 'bg-[#c5a059] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules.map((capsule) => {
          const isAdded = !!addedIds[capsule.id];

          return (
            <div
              key={capsule.id}
              className="group bg-[#131417] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top Visual Area with Capsule Color Swatch & Geometry Preview */}
              <div>
                <div className="h-44 rounded-xl bg-gradient-to-b from-[#1c1d22] to-[#0f1013] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden mb-5">
                  {/* Subtle Glow */}
                  <div
                    className="absolute w-28 h-28 rounded-full blur-2xl opacity-25"
                    style={{ backgroundColor: capsule.colorHex }}
                  />

                  {/* Stylized Capsule Graphic Representation */}
                  <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                    {/* Top Foil Rim */}
                    <div
                      className="w-16 h-3 rounded-full shadow-sm mb-0.5 border border-white/30"
                      style={{ backgroundColor: capsule.accentHex }}
                    />
                    {/* Tapered Body */}
                    <div
                      className="w-14 h-16 rounded-b-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center"
                      style={{ backgroundColor: capsule.colorHex }}
                    >
                      <span className="text-[10px] font-bold text-white/80 font-serif tracking-widest">
                        KANU
                      </span>
                    </div>
                  </div>

                  {/* Intensity Label */}
                  <div className="absolute top-3 right-3 text-[11px] font-mono text-zinc-400 bg-black/50 px-2 py-0.5 rounded border border-white/5">
                    Lv.{capsule.intensity}
                  </div>

                  {/* Optional Badge */}
                  {capsule.badgeText && (
                    <div className="absolute top-3 left-3 text-[10px] tracking-wider font-semibold text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-2 py-0.5 rounded">
                      {capsule.badgeText}
                    </div>
                  )}
                </div>

                {/* Clean Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
                  <span className="uppercase tracking-wider">{capsule.roastCategory} ROAST</span>
                  <span aria-hidden="true">·</span>
                  <span>{capsule.recommendedCup.split(' ')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{capsule.capsuleCount}개입</span>
                </div>

                {/* Product Titles */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#c5a059] transition-colors">
                  {capsule.nameKo}
                </h3>
                <div className="text-xs text-zinc-400 font-serif mb-3">
                  {capsule.nameEn}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {capsule.description}
                </p>

                {/* Tasting Notes */}
                <div className="flex flex-wrap items-center gap-1.5 mb-6">
                  {capsule.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="text-[11px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Price */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">권장소비자가</span>
                  <span className="text-base font-bold text-white tabular-nums font-mono">
                    ₩{capsule.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* View in 3D Button */}
                  <button
                    type="button"
                    onClick={() => onSelectIn3D(capsule)}
                    title="3D 뷰어에서 360° 확인하기"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAdd(capsule)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isAdded
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#c5a059] hover:bg-[#d9b672] text-black active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>담김</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>담기</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
