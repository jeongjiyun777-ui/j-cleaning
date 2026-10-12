"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

export default function RegisterAgreedPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col bg-slate-50">
      <JoinBreadcrumb step={1} />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        <section className="relative w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all sm:p-10">
          
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/j-cleaning-logo.png"
                alt="제이클리닝 로고"
                width={160}
                height={40}
                className="h-8 w-auto object-contain drop-shadow-sm sm:h-9"
                priority
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              서비스 이용약관 동의
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              안전하고 쾌적한 청소 서비스 이용을 위해 필수 약관을 확인해 주세요.
            </p>
          </div>

          <div
            className="max-h-[360px] space-y-5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-sm leading-relaxed text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:p-6"
            tabIndex={0}
            role="region"
            aria-labelledby="terms-title"
          >
            <div className="border-b border-slate-200 pb-3">
              <h2 id="terms-title" className="text-base font-bold text-slate-900">
                청소 서비스 이용약관
              </h2>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900">제1조 (목적)</h3>
              <p>
                본 약관은 회사가 제공하는 홈클리닝, 입주청소 및 정기 청소 서비스(이하 “서비스”)의 이용 조건, 예약 절차, 그리고 회사와 고객 간의 권리와 의무를 정함을 목적으로 합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsTermsOpen(!isTermsOpen)}
              aria-expanded={isTermsOpen}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/80 py-2.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
            >
              <span>{isTermsOpen ? "상세 약관 닫기" : "상세 약관 전체 보기 (제2조 ~ 제6조)"}</span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isTermsOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`space-y-5 transition-all duration-300 ${
                isTermsOpen ? "block opacity-100 pt-2" : "hidden opacity-0"
              }`}
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">제2조 (예약 및 결제)</h3>
                <p>
                  서비스는 고객이 웹사이트를 통해 일정, 주소, 평수를 입력하고 예약을 신청한 후, 관리자의 승인 및 결제가 완료된 시점에 최종 확정됩니다. 현장 상황(오염도, 짐의 양 등)에 따라 사전 고지된 견적 외에 추가 요금이 발생할 수 있습니다.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">제3조 (취소 및 환불 규정)</h3>
                <p>
                  청소 매니저 배정 및 일정 확보를 위해, 서비스 진행일 기준 일정 기간 내에 예약을 취소할 경우 규정에 따라 위약금이 발생할 수 있습니다. (예: 서비스 전일 취소 시 결제 금액의 30% 차감 등) 상세 환불 규정은 결제 전 별도 고지합니다.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">제4조 (고객의 의무 및 준비사항)</h3>
                <p>고객은 원활한 서비스 제공을 위해 다음 사항을 준수해야 합니다.</p>
                <ul className="list-disc space-y-1 pl-5 text-slate-500">
                  <li>정확한 방문 주소 및 공동현관 출입 방법(비밀번호 등) 사전 공유</li>
                  <li>현금, 귀금속, 파손되기 쉬운 고가의 물품은 사전에 안전한 곳으로 보관</li>
                  <li>청소 범위 내에 있는 반려동물의 안전한 격리 조치</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">제5조 (손해배상 및 면책)</h3>
                <p>
                  서비스 진행 중 매니저의 과실로 인해 시설물이나 물품이 파손된 경우, 회사의 배상 규정(가입된 영업배상책임보험 등)에 따라 보상 처리를 진행합니다. 단, 고객이 사전에 고지하지 않은 파손 주의 물품, 노후화로 인한 자연 파손, 고객이 귀중품을 방치하여 발생한 분실에 대해서는 회사의 배상 책임이 제한됩니다. 파손 접수는 서비스 완료 후 48시간 이내에 이루어져야 합니다.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">제6조 (개인정보 수집 및 위치 정보 활용)</h3>
                <p>
                  회사는 원활한 매니저 방문 및 청소 서비스 제공을 위해 최소한의 개인정보(이름, 연락처, 상세 주소)를 수집하며, 해당 정보는 서비스 제공 완료 및 법정 보존 기간 경과 후 안전하게 파기됩니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-100/80 p-3.5 text-xs leading-normal text-slate-500">
                <p className="font-medium text-slate-600">운영 안내</p>
                <p>문의 채널: 서비스 내 고객센터 및 우측 하단 챗봇</p>
                <p>시행일: 2026년 09월 05일</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="terms-agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-emerald-500 checked:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-900">
                [필수] 취소/환불 규정 및 이용약관을 확인하였으며 이에 동의합니다.
              </span>
            </label>
          </div>

          <div className="mt-6">
            {isAgreed ? (
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
              >
                <span>가입 정보 입력하기</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-400"
              >
                <span>가입 정보 입력하기</span>
                <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
