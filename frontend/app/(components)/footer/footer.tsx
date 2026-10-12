import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-50 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-16 px-6 py-20 lg:flex-row lg:gap-24 lg:px-12">
        <section className="flex flex-col justify-between lg:w-1/3">
          <div>
            <div className="flex items-center">
              <Image
                src="/j-cleaning-logo.png"
                alt="제이클리닝 로고"
                width={220}
                height={56}
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>

            <p className="mt-6 text-base font-medium leading-relaxed text-slate-600">
              입주 · 이사 · 거주 · 특수 청소 전문
              <br />
              1:1 고객 맞춤형 프리미엄 클리닝 서비스
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-[#03C75A] text-white shadow-md shadow-[#03C75A]/20 transition-all hover:scale-105 active:scale-95">
              <span className="text-xs font-black tracking-tighter">blog</span>
            </div>

            <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-[#FEE500] text-[#371D1E] shadow-md shadow-[#FEE500]/30 transition-all hover:scale-105 active:scale-95">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054l-1.09 3.998c-.097.355.305.645.61.439l4.78-3.17c.142.012.286.019.43.019 4.97 0 9-3.185 9-7.115C21 6.185 16.97 3 12 3z" />
              </svg>
            </div>

            <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20 transition-all hover:scale-105 active:scale-95">
              <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>

            <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/20 transition-all hover:scale-105 active:scale-95">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.822 0-1.554.218-1.928.583-.374.366-.464.912-.464 1.761v1.636h4.526l-.602 3.667h-3.924v7.98H9.101z" />
              </svg>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col justify-between lg:w-2/3">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <a
              href="tel:1544-0000"
              className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5"
            >
              <div>
                <span className="block text-xs font-semibold text-slate-400">대표전화</span>
                <span className="mt-1 block text-xl font-extrabold tracking-tight text-slate-900">1544-0000</span>
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">연결</span>
            </a>

            <a
              href="tel:010-1234-5678"
              className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5"
            >
              <div>
                <span className="block text-xs font-semibold text-slate-400">견적상담 직통</span>
                <span className="mt-1 block text-xl font-extrabold tracking-tight text-emerald-600">010-1234-5678</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">상담</span>
            </a>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 p-5">
              <div>
                <span className="block text-xs font-semibold text-slate-400">상담 가능 시간</span>
                <span className="mt-1 block text-base font-bold text-slate-700">평일 09:00 ~ 18:00</span>
              </div>
              <span className="text-xs text-slate-400">주말/공휴일 휴무</span>
            </div>

            <a
              href="mailto:help@jcleaning.com"
              className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-white"
            >
              <div>
                <span className="block text-xs font-semibold text-slate-400">공식 이메일</span>
                <span className="mt-1 block text-base font-bold text-slate-700">help@jcleaning.com</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 hover:underline">문의하기</span>
            </a>
          </div>

          <div className="mt-12 border-t border-slate-200/80 pt-8">
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-600">
              <Link href="/terms" className="transition-colors hover:text-slate-900">
                이용약관
              </Link>
              <span className="text-slate-300">·</span>
              <Link href="/privacy" className="text-slate-900 transition-colors hover:text-emerald-600">
                개인정보처리방침
              </Link>
            </nav>

            <div className="mt-5 space-y-1 text-xs leading-relaxed text-slate-400">
              <p>제이클리닝 · 대표자 정지윤 · 사업자등록번호: 123-45-67890</p>
              <p>주소: 서울특별시 영등포구 클린로 123, 제이빌딩 1층</p>
              <p className="pt-2 text-[11px] text-slate-400">
                본 사이트는 포트폴리오용 데모 서비스이며 표시된 정보는 실제 정보가 아닙니다.
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                COPYRIGHT © 2026 J CLEANING. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}