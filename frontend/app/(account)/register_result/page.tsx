"use client";

import Link from "next/link";
import { useEffect } from "react";

interface JoinBreadcrumbProps {
  step: 1 | 2 | 3;
} 


function JoinBreadcrumb({ step }: JoinBreadcrumbProps) {
  return (
    <div className="flex w-full items-center justify-end border-b border-slate-200/60 bg-slate-100/50 px-6 py-3.5 sm:px-10 lg:px-24">
      <ol className="flex items-center gap-2 text-xs font-medium text-slate-400 sm:text-sm">
        <li className={step === 1 ? "font-bold text-emerald-600" : ""}>01 약관동의</li>
        <li>
          <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className={step === 2 ? "font-bold text-emerald-600" : ""}>02 정보입력</li>
        <li>
          <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className={step === 3 ? "font-bold text-emerald-600" : ""}>03 가입완료</li>
      </ol>
    </div>
  );
}


function RegisterCompleteView() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col bg-slate-50">
      <JoinBreadcrumb step={3} />

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          회원가입을 축하드립니다!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          제이클리닝과 함께 쾌적하고 청결한 공간을 경험해 보세요.
        </p>

        <div className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-slate-500">가입 일시</span>
            <span className="font-medium text-slate-700">
              {new Date().toLocaleDateString("ko-KR", {
                timeZone: "Asia/Seoul",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            홈으로 가기
          </Link>
          <Link
            href="/login"
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
          >
            <span>로그인하기</span>
            <svg
              className="ml-1 inline h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
const RegisterCompletePage = () => {
  useEffect(() => {
    sessionStorage.removeItem("registerComplete");
  }, []);

  return <RegisterCompleteView />;
};

export default RegisterCompletePage;
