import React from 'react';
import { Award, Compass, Shield, HeartHandshake } from 'lucide-react';
import roasteryBeansImg from '../assets/images/kanu_roastery_beans_1794291170330.jpg';
import lifestyleMomentImg from '../assets/images/kanu_lifestyle_moment_1794291170064.jpg';

export const BrandStory: React.FC = () => {
  return (
    <section id="brand-story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Editorial Title */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-3">
          Our Heritage & Craft
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-2xl text-balance">
          세상에서 가장 작은 카페, 카누
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl">
          2011년 탄생 이후 대한민국 커피 문화에 새로운 기준을 제시해 온 카누.
          이제 바리스타 캡슐 시스템으로 한 단계 더 진화한 프리미엄 에스프레소의 정수를 선보입니다.
        </p>
      </div>

      {/* 2-Column Split: Visual & Craft Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        {/* Left Column: Roastery Craft Photography */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#141519]">
            <img
              src={roasteryBeansImg}
              alt="Artisanal Roasting of Specialty Arabica Coffee Beans"
              referrerPolicy="no-referrer"
              className="w-full h-[420px] object-cover object-center hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold block mb-1">
                Precision Roasting Method
              </span>
              <p className="text-white text-base font-medium">
                각 산지 원두의 잠재력을 극대화하는 정밀 로스팅 프로파일링
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Core Pillars */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 text-white font-semibold text-lg mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                <Compass className="w-4 h-4" />
              </div>
              <h3>01. 엄선된 100% 아라비카 원두</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed pl-11">
              에티오피아의 화사한 꽃향기, 콜롬비아의 균형 잡힌 바디, 과테말라의 깊은 스모키 풍미까지.
              세계적인 스페셜티 산지 원두를 카누 수석 마스터 블렌더가 까다롭게 선별합니다.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 text-white font-semibold text-lg mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                <Award className="w-4 h-4" />
              </div>
              <h3>02. -196°C 마이크로그라인딩 공법</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed pl-11">
              분쇄 시 발생하는 열로 인한 아로마 손실을 막기 위해 극저온 냉각 분쇄 기술을 적용,
              원두 본연의 살아있는 휘발성 향미 성분을 온전히 캡슐 안에 봉인합니다.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 text-white font-semibold text-lg mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                <Shield className="w-4 h-4" />
              </div>
              <h3>03. 100% 재활용 가능한 알루미늄 배리어</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed pl-11">
              산소 투과율 0%의 프리미엄 알루미늄 바디로 산패를 원천 방지하며,
              사용 후 친환경 수거 프로그램을 통해 지속 가능한 커피 사이클을 실천합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Lifestyle Editorial Rest Area */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#141519] p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">
              Everyday Ritual
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              바쁜 아침, 나만을 위한 고요한 카페가 열립니다
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              머신 전원을 켜고 캡슐을 넣는 단 30초의 순간. 부드러운 추출음과 함께 방 안 가득 퍼지는
              풍부한 커피 향이 하루의 시작을 특별한 온기로 채워줍니다.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-400">
              <span>동서식품 카누 커피 연구소</span>
              <span aria-hidden="true">·</span>
              <span>Seoul, Korea</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={lifestyleMomentImg}
                alt="Peaceful Seoul morning cafe lifestyle with KANU"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
