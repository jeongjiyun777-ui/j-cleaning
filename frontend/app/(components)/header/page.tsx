"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, restoreSession, useAuthUser } from "@/lib/auth";

const Header = () => {
  const user = useAuthUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuLeft, setMenuLeft] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const alignMenu = (element: HTMLDivElement) => {
    const header = element.closest("header");
    if (header) {
      setMenuLeft(element.getBoundingClientRect().left - header.getBoundingClientRect().left);
    }
  };

  useEffect(() => { void restoreSession(); }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } catch {
      alert("로그아웃하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <header className="relative sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-start gap-2 px-3 sm:px-4 md:h-24 md:justify-between md:gap-3 md:px-6 lg:px-8 xl:px-12">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 rounded-md p-2 text-slate-600 hover:text-teal-700 focus:outline-none md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-80">
          <Image
            src="/j-cleaning-logo.png"
            alt="제이클리닝 로고"
            width={200}
            height={48}
            className="h-8 w-auto sm:h-10 object-contain shrink-0"
            priority
          />
        </Link>


        <nav className="hidden h-full min-w-0 flex-1 items-center justify-center gap-1 px-0 md:flex lg:gap-2 xl:gap-3 2xl:gap-8">
          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("brand"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("brand"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <Link
              href="/#brand"
              className="text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base"
            >
              <span className="whitespace-nowrap leading-none">브랜드</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "brand" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/#brand" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]"><Image
                    src="/j-cleaning-logo.png"
                    alt="제이클리닝"
                    width={200}
                    height={48}
                    className="h-10 w-10 object-contain"
                  /></div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    회사 소개
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("regular"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("regular"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <Link
              href="/#regular"
              className="text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base"
            >
              <span className="whitespace-nowrap leading-none">정기클리닝</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "regular" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    사무실
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12h18M5 12v9m14-9v9M8 12V5a1 1 0 011-1h10a1 1 0 011 1v7M10 16h4m-2-4v4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    사무실집기
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M3 21h18M10 21v-5h4v5M12 6v6m-3-3h6"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    병원
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10l2-6h14l2 6M3 10a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 13v8h14v-8M9 21v-5h6v5"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    매장
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10l9-7 9 7M5 9v12h14V9M10 21v-6h4v6M8 11h1m6 0h1M12 6v4m-2-2h4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    학원/학교
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 11l9-8 9 8M5 10v11h14V10M9 14h.01M15 14h.01M9 17c1.5 2 4.5 2 6 0"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    유치원/어린이집
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 21V10l6 4V8l6 4V3h4v18H3M7 17h1m3 0h1m3 0h1"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    공장/물류센터
                  </span>
                </Link>
                <Link href="/#regular" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6v15m18-11v11M3 17h18M3 10h16a2 2 0 012 2v5M5 10V7h5v3M3 20h18"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    기숙사/합숙소
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("one-time"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("one-time"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <Link
              href="/#one-time"
              className="text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base"
            >
              <span className="whitespace-nowrap leading-none">일회성 클리닝</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "one-time" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    사무실
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12h18M5 12v9m14-9v9M8 12V5a1 1 0 011-1h10a1 1 0 011 1v7M10 16h4m-2-4v4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    사무실집기
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M3 21h18M10 21v-5h4v5M12 6v6m-3-3h6"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    병원
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10l2-6h14l2 6M3 10a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 13v8h14v-8M9 21v-5h6v5"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    매장
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10l9-7 9 7M5 9v12h14V9M10 21v-6h4v6M8 11h1m6 0h1M12 6v4m-2-2h4"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    학원/학교
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 11l9-8 9 8M5 10v11h14V10M9 14h.01M15 14h.01M9 17c1.5 2 4.5 2 6 0"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    유치원/어린이집
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 21V10l6 4V8l6 4V3h4v18H3M7 17h1m3 0h1m3 0h1"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    공장/물류센터
                  </span>
                </Link>
                <Link href="/#one-time" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6v15m18-11v11M3 17h18M3 10h16a2 2 0 012 2v5M5 10V7h5v3M3 20h18"
                    />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    기숙사/합숙소
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("special"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("special"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <Link
              href="/#special"
              className="text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base"
            >
              <span className="whitespace-nowrap leading-none">특수</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "special" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/#special" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8h14v13M8 8V3h8v5M9 12h1m4 0h1m-6 4h1m4 0h1" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    준공 청소
                  </span>
                </Link>
                <Link href="/#special" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 3h16v18H4zM12 3v18M4 12h16M7 8l2-2m6 12l2-2" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    외벽/유리창
                  </span>
                </Link>
                <Link href="/#special" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3l-4 11M6 14h9l3 6H3l3-6M5 17h11M18 4v4m-2-2h4" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    바닥 왁스/연마
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* 5. 홈클리닝 */}
          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("home-cleaning"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("home-cleaning"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <Link
              href="/#home-cleaning"
              className="text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base"
            >
              <span className="whitespace-nowrap leading-none">홈클리닝</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "home-cleaning" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/#home-cleaning" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1M3 8h18M7 16v4m5-4v5m5-5v4" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    에어컨 분해세척
                  </span>
                </Link>
                <Link href="/#home-cleaning" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1M4 7h16M7 5h.01M10 5h.01M16 14a4 4 0 11-8 0 4 4 0 018 0M8 14c2 2 6-2 8 0" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    세탁기 케어
                  </span>
                </Link>
                <Link href="/#home-cleaning" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9-4 9 4-9 4-9-4M3 8v7l9 5 9-5V8M12 12v8M17 2v4m-2-2h4" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    매트리스 살균
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* 6. 고객센터 */}
          <div
            className="group h-full flex items-center"
            onMouseEnter={(event) => { alignMenu(event.currentTarget); setActiveMenu("customer"); }}
            onMouseLeave={() => setActiveMenu(null)}
            onFocus={(event) => { alignMenu(event.currentTarget); setActiveMenu("customer"); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}
          >
            <button type="button" className="cursor-pointer text-xs font-semibold text-slate-700 group-hover:text-emerald-500 transition-all duration-200 flex items-center gap-1 py-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] lg:text-sm 2xl:text-base">
              <span className="whitespace-nowrap leading-none">고객센터</span>
              <svg className="h-3 w-3 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-180 group-hover:translate-y-0.5 transition-all duration-300 ease-out lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute top-full left-0 w-full transition-all duration-200 bg-white border-b border-slate-100 shadow-md py-4 z-40 ${activeMenu === "customer" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 whitespace-nowrap pr-4" style={{ paddingLeft: menuLeft }}>
                <Link href="/notice" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4h4l10 4V6L7 10H3M7 14l2 7h3l-2-6M21 9v6" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    공지사항
                  </span>
                </Link>
                <Link href="/reviews" className="flex flex-col items-center justify-center min-w-[80px] p-2.5 rounded-2xl transition-all duration-200 group/item hover:bg-slate-50/80 active:scale-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100/40 flex items-center justify-center transition-all duration-200 group-hover/item:bg-emerald-100/60 group-hover/item:border-emerald-200/60 group-hover/item:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.06)]">
                    <svg
                    className="w-6 h-6 text-emerald-600/80 group-hover/item:text-emerald-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H9l-6 3V5a2 2 0 012-2M12 6l1.5 3 3.5.5-2.5 2.5.6 3.5-3.1-1.6-3.1 1.6.6-3.5L7 9.5l3.5-.5L12 6" />
                  </svg>
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-medium tracking-tight text-slate-600 group-hover/item:text-slate-900 whitespace-nowrap transition-colors">
                    시공 후기
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </nav>

        {isOpen && (
        <div className="absolute top-full left-0 z-50 flex w-full flex-col gap-2 border-b border-slate-200 bg-white px-6 py-4 shadow-xl md:hidden">
          <Link href="/#brand" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3 border-b border-slate-50">브랜드</Link>
          <Link href="/#regular" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3 border-b border-slate-50">정기클리닝</Link>
          <Link href="/#one-time" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3 border-b border-slate-50">일회성 클리닝</Link>
          <Link href="/#special" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3 border-b border-slate-50">특수</Link>
          <Link href="/#home-cleaning" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3 border-b border-slate-50">홈클리닝</Link>
          <Link href="/notice" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3">공지사항</Link>
          <Link href="/reviews" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-base font-medium text-slate-700 hover:text-teal-700 py-3">시공 후기</Link>
        </div>
      )}


        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0 md:gap-5 xl:gap-8">
          <div className="flex items-center gap-2 text-slate-600 sm:gap-3 lg:gap-4">
            {user ? (
              <div className="group relative shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  className="flex max-w-[150px] shrink-0 items-center gap-1 whitespace-nowrap py-2 text-xs font-semibold text-teal-800 sm:max-w-[210px] sm:text-sm md:max-w-[250px] md:text-base lg:text-lg"
                  aria-label="계정 메뉴"
                >
                  <span className="flex min-w-0 whitespace-nowrap">
                    <span className="min-w-0 truncate">{user.name}</span>
                    {user.name && <span className="shrink-0">&nbsp;</span>}
                    <span className="shrink-0">{user.role === "manager" ? "관리자님" : "회원님"}</span>
                  </span>
                  <svg
                    className="h-3 w-3 shrink-0 transition-transform group-hover:rotate-180 group-focus-within:rotate-180 md:h-4 md:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="invisible absolute right-0 top-full z-50 w-32 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center justify-center px-4 py-3 text-center text-xs md:text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-700 disabled:opacity-50"
                    >
                      {isLoggingOut ? "처리 중..." : "로그아웃"}
                    </button>
                    {user.role === "manager" && (
                      <Link
                        href="/admin/member_list"
                        className="flex w-full items-center justify-center border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-700 md:text-sm"
                      >
                        회원목록 보기
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
            <Link href="/login" className="flex flex-col items-center gap-0.5 whitespace-nowrap text-[11px] leading-none md:text-xs hover:text-teal-700 transition-colors">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>로그인</span>
            </Link>

            <Link href="/register_agree" className="flex flex-col items-center gap-0.5 whitespace-nowrap text-[11px] leading-none md:text-xs hover:text-teal-700 transition-colors">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>회원가입</span>
            </Link>
              </>
            )}
          </div>

          <Link
            href="/estimate" 
            className="group flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-emerald-500 p-1 text-center text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md active:scale-95 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20"
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="whitespace-nowrap text-[10px] font-bold text-white sm:text-xs md:text-sm">
                무료 견적
              </span>
              <span className="whitespace-nowrap text-[9px] font-medium text-emerald-50/90 sm:text-[10px] md:text-xs">
                받아보기
              </span>
            </span>
            <svg
              className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 md:h-3.5 md:w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>        
      </div>
    </header>
  );
};

export default Header;
