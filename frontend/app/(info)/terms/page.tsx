import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <header className="border-b border-slate-200 pb-8 text-center">
          <Image src="/j-cleaning-logo.png" alt="제이클리닝 로고" width={200} height={48} className="mx-auto mb-4 h-10 w-auto object-contain" />
          <h1 className="mt-2 text-3xl font-bold text-slate-900">이용약관</h1>
          <p className="mt-3 text-sm text-slate-500">시행일: 2026년 10월 12일</p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">제1조 목적</h2>
            <p className="mt-2">본 약관은 제이클리닝이 제공하는 청소 서비스 안내와 온라인 예상 견적 기능의 이용 조건을 설명합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제2조 회원가입 및 계정 관리</h2>
            <p className="mt-2">회원은 정확한 정보를 입력하고 계정 및 비밀번호를 안전하게 관리해야 합니다. 계정 정보를 타인과 공유하거나 부정하게 사용해서는 안 됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제3조 서비스 이용</h2>
            <p className="mt-2">이용자는 청소 유형과 공간 정보를 입력해 예상 견적을 확인하고, 이메일로 견적 결과를 요청할 수 있습니다. 예상 견적은 입력한 정보에 따른 참고 금액이며 실제 작업 범위와 현장 상태에 따라 달라질 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">제4조 안내</h2>
            <p className="mt-2">이 페이지는 제이클리닝 포트폴리오 데모를 위한 이용약관 예시입니다. 실제 서비스를 운영할 때에는 제공 범위, 취소·환불 기준, 문의 절차 등 운영 조건을 확정해 반영해야 합니다.</p>
          </section>
        </article>
      </section>
      <div className="mx-auto mt-6 w-full max-w-3xl">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0 7-7m-7 7h18" />
          </svg>
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
