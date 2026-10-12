"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const MAIN_SECTIONS = [
  { id: "brand", title: "회사 소개", color: "bg-emerald-50/50" },
  { id: "regular", title: "정기클리닝", color: "bg-sky-50/50" },
  { id: "one-time", title: "일회성 클리닝", color: "bg-amber-50/50" },
  { id: "special", title: "특수 청소", color: "bg-violet-50/50" },
  { id: "home-cleaning", title: "홈클리닝", color: "bg-rose-50/50" },
];
const SECTION_IMAGES: Record<string, string> = {
  regular: "/J-Cleaning1.png",
  "one-time": "/J-Cleaning2.png",
  special: "/J-Cleaning3.png",
  "home-cleaning": "/J-Cleaning4.png",
};
const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <main className="w-full bg-white">
      {MAIN_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-label={Boolean(SECTION_IMAGES[section.id]) ? section.title : undefined}
          aria-labelledby={Boolean(SECTION_IMAGES[section.id]) ? undefined : `${section.id}-title`}
          className={`flex scroll-mt-24 items-center ${section.id === "brand" || Boolean(SECTION_IMAGES[section.id]) ? "" : "min-h-[65vh] px-6 py-16 sm:py-20 md:px-12 md:py-24"} ${section.color}`}
        >
          <div className={section.id === "brand" || Boolean(SECTION_IMAGES[section.id]) ? "w-full" : "mx-auto w-full max-w-6xl"}>
            {section.id === "brand" ? (
              <div className={`relative grid items-center overflow-hidden bg-white ${activeSlide === 0 ? "min-h-[760px]" : ""}`}>
                <div
                  aria-hidden={activeSlide !== 0}
                  className={`col-start-1 row-start-1 mx-auto w-full max-w-6xl px-6 py-20 md:px-12 md:py-24 transition-opacity duration-700 ease-in-out ${activeSlide === 0 ? "text-slide-active" : "pointer-events-none absolute inset-0 opacity-0"}`}
                >
                <div className="mb-8 flex items-center gap-2 md:mb-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-emerald-700 ring-1 ring-inset ring-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    J-CLEANING · OUR STANDARD
                  </span>
                </div>
                <h1 id="brand-title" className="max-w-5xl break-keep text-4xl font-extrabold leading-[1.3] tracking-tighter text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block">하청 없는 <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">100% 직영,</span></span>
                  <span className="mt-2 block">공간을 바꾸는</span>
                  <span className="block">가장 정직한 기준.</span>
                </h1>
                <div className="mt-8 max-w-3xl space-y-2 break-keep text-base font-medium leading-relaxed tracking-tight text-slate-500 md:mt-10 md:text-lg">
                  <p>매번 바뀌는 인력과 불투명한 견적에 지치셨나요?</p>
                  <p>제이클리닝은 본사 정규 크루와 표준화된 데이터 매뉴얼로<br className="hidden md:block" /> 복불복 없는 완벽한 청결을 약속합니다.</p>
                </div>
                <section id="brand-promise" className="mt-14 w-full bg-teal-600 px-6 py-20 md:px-12 md:py-28">
  <div className="mx-auto w-full max-w-6xl">
    
    <div className="flex flex-col items-center text-center text-white">
      <span className="mb-3 text-xs font-bold tracking-widest text-teal-100 flex items-center gap-1.5">
        WHY CHOOSE US
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c0 0-4 9-4 14a4 4 0 008 0c0-5-4-14-4-14z" />
        </svg>
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        제이클리닝의 약속
      </h2>
    </div>

    <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3 lg:gap-8">
      
      <div className="flex flex-col items-center rounded-[32px] bg-teal-50/95 px-8 py-10 text-center shadow-xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">본사 100% 직영 시공</h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 break-keep">
          모든 작업은 하청 없이 본사 정규 교육을 이수한 전담 마스터 크루가 직접 책임지고 진행합니다. 일관된 퀄리티를 약속드립니다.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-[32px] bg-teal-50/95 px-8 py-10 text-center shadow-xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">50가지 표준 체크리스트</h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 break-keep">
          작업자의 감이나 눈대중이 아닌, 50여 개의 세부 체크리스트와 전문 장비를 활용하여 보이지 않는 곳까지 완벽하게 케어합니다.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-[32px] bg-teal-50/95 px-8 py-10 text-center shadow-xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">사후처리 100% 보장</h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 break-keep">
          시공 후 미흡한 부분이 발견된다면, 기간 내 무상 재방문 A/S를 진행합니다. 영업배상책임보험으로 파손 걱정도 덜어드립니다.
        </p>
      </div>

    </div>

    <div className="mt-20 grid grid-cols-2 gap-y-12 divide-teal-500/50 text-white md:mt-24 md:grid-cols-4 md:divide-x">
      
      <div className="flex flex-col items-center md:items-start md:px-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold md:text-5xl">50</span>
          <span className="text-xl font-medium text-teal-200">+</span>
        </div>
        <p className="mt-2 text-xs text-teal-100 md:text-sm">구역별 표준 체크리스트</p>
      </div>

      <div className="flex flex-col items-center md:items-start md:px-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold md:text-5xl">100</span>
          <span className="text-xl font-medium text-teal-200">%</span>
        </div>
        <p className="mt-2 text-xs text-teal-100 md:text-sm">일용직 없는 직영 시공</p>
      </div>

      <div className="flex flex-col items-center md:items-start md:px-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold md:text-5xl">24</span>
          <span className="text-xl font-medium text-teal-200">h</span>
        </div>
        <p className="mt-2 text-xs text-teal-100 md:text-sm">불만족 시 책임 A/S</p>
      </div>

      <div className="flex flex-col items-center md:items-start md:px-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold md:text-5xl">99.9</span>
          <span className="text-xl font-medium text-teal-200">%</span>
        </div>
        <p className="mt-2 text-xs text-teal-100 md:text-sm">입주/오피스 고객 만족도</p>
      </div>

    </div>

  </div>
</section>
                </div>
                {["/clean_main1.png", "/clean_main2.png"].map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`제이클리닝 소개 이미지 ${index + 1}`}
                    width={1672}
                    height={941}
                    sizes="100vw"
                    quality={75}
                    loading="lazy"
                    aria-hidden={activeSlide !== index + 1}
                    className={`block w-full h-auto object-contain ${activeSlide === index + 1 ? "col-start-1 row-start-1 photo-slide-active" : "pointer-events-none absolute inset-0 opacity-0"}`}
                  />
                ))}
              </div>
            ) : Boolean(SECTION_IMAGES[section.id]) ? (
              <Image
                src={SECTION_IMAGES[section.id]}
                alt={section.title}
                width={1448}
                height={1086}
                sizes="100vw"
                quality={75}
                loading="lazy"
                className="block h-auto w-full object-contain"
              />
            ) : (
              <h2 id={`${section.id}-title`} className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
                {section.title}
              </h2>
            )}
          </div>
        </section>
      ))}

      <style jsx>{`
        .text-slide-active {
          animation: text-slide 4s ease-in-out both;
        }
        @keyframes text-slide {
          0% { opacity: 0; transform: translateY(12px); }
          15% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        .photo-slide-active {
          animation: photo-slide 4s ease-in-out both;
        }
        @keyframes photo-slide {
          0% { opacity: 0; transform: scale(1); }
          15% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .text-slide-active {
          animation: text-slide 4s ease-in-out both;
        }
        @keyframes text-slide {
          0% { opacity: 0; transform: translateY(12px); }
          15% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        .photo-slide-active { animation: none; opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default Home;
