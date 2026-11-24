import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#090a0c] text-zinc-400 text-xs py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold tracking-widest text-white">KANU</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">세상에서 가장 작은 카페</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <a href="#capsules-3d" className="hover:text-white transition-colors">3D 캡슐 컬렉션</a>
            <a href="#machine-showcase" className="hover:text-white transition-colors">바리스타 머신</a>
            <a href="#capsule-catalog" className="hover:text-white transition-colors">캡슐 라인업</a>
            <a href="#brand-story" className="hover:text-white transition-colors">브랜드 스토리</a>
          </div>
        </div>

        {/* Corporate Legal & Customer Support Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 text-zinc-500 text-[11px] leading-relaxed">
          <div className="space-y-1">
            <p className="text-zinc-400 font-medium text-xs mb-2">동서식품 주식회사</p>
            <p>대표자: 김광수 · 서울특별시 마포구 독막로 324 (도화동)</p>
            <p>사업자등록번호: 101-81-06048 · 통신판매업신고: 제 2004-서울마포-01449호</p>
            <p>고객상담센터: 080-023-9114 (월~금 09:00~17:00 / 토, 일, 공휴일 휴무)</p>
          </div>

          <div className="flex flex-col md:items-end justify-between space-y-4">
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="#" className="hover:underline">개인정보처리방침</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:underline">이용약관</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:underline">정품 캡슐 수거 프로그램</a>
            </div>
            <p className="text-zinc-600">
              © {new Date().getFullYear()} DONGSUH FOODS CORP. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
