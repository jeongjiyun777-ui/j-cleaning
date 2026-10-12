import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <header className="border-b border-slate-200 pb-8 text-center">
          <Image src="/j-cleaning-logo.png" alt="제이클리닝 로고" width={200} height={48} className="mx-auto mb-4 h-10 w-auto object-contain" />
          <h1 className="mt-2 text-3xl font-bold text-slate-900">개인정보처리방침</h1>
          <p className="mt-3 text-sm text-slate-500">시행일: 2026년 10월 12일</p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">1. 수집하는 정보</h2>
            <p className="mt-2">회원가입 시 이름, 이메일 주소(아이디), 생년월일, 휴대전화번호를 입력받습니다. 견적 요청 시에는 청소 유형, 세부 항목, 공간 규모와 견적 결과를 받을 이메일 주소를 입력받을 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">2. 정보 이용 목적</h2>
            <p className="mt-2">회원 식별과 계정 관리, 청소 견적 산출, 견적 요청에 대한 안내와 이메일 전송 등 청소 서비스 관련 기능을 제공하기 위해 정보를 이용합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">3. 정보 보관 및 보호</h2>
            <p className="mt-2">계정 정보와 요청 정보는 서비스 기능을 제공하는 데 필요한 범위에서 관리합니다. 비밀번호는 원문이 아닌 해시 형태로 저장하도록 구성되어 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">4. 안내</h2>
            <p className="mt-2">이 페이지는 제이클리닝 포트폴리오 데모를 위한 예시입니다. 실제 서비스에 적용할 때에는 운영 주체, 보유 기간, 파기 절차와 문의처 등 실제 운영 정보를 반영해야 합니다.</p>
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
