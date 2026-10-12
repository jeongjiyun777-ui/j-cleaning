import type { ReactNode } from "react";

export interface CustomerListItem {
  id: number;
  name: string;
  username: string;
  phone?: string;
  created_at: string;
}

interface MemberListSectionProps {
  customers: CustomerListItem[];
  isLoading: boolean;
  errorMessage: string;
  page: number;
  totalPages: number;
  pageGroupStart: number;
  pageGroupEnd: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
  children?: ReactNode;
}

const formatJoinDate = (createdAt: string) =>
  new Date(createdAt).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const formatPhone = (phone: string | undefined) => {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (digits.length !== 11) return phone?.trim() || "—";
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function MemberListSection({
  customers,
  isLoading,
  errorMessage,
  page,
  totalPages,
  pageGroupStart,
  pageGroupEnd,
  visiblePages,
  onPageChange,
  children,
}: MemberListSectionProps) {
  let content: ReactNode;

  if (isLoading) {
    content = (
      <p role="status" className="px-6 py-12 text-center text-sm text-slate-500">
        회원 목록을 불러오고 있습니다...
      </p>
    );
  } else if (errorMessage) {
    content = (
      <p role="alert" className="px-6 py-12 text-center text-sm font-medium text-rose-600">
        {errorMessage}
      </p>
    );
  } else if (customers.length === 0) {
    content = (
      <p className="px-6 py-12 text-center text-sm text-slate-500">
        등록된 회원이 없습니다.
      </p>
    );
  } else {
    content = (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-center text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-500 sm:text-sm">
            <tr>
              <th scope="col" className="px-5 py-4 sm:px-6">이름</th>
              <th scope="col" className="px-5 py-4 sm:px-6">아이디</th>
              <th scope="col" className="px-5 py-4 sm:px-6">전화번호</th>
              <th scope="col" className="px-5 py-4 sm:px-6">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-4 font-semibold text-slate-900 sm:px-6">{customer.name}</td>
                <td className="px-5 py-4 text-slate-600 sm:px-6">{customer.username}</td>
                <td className="px-5 py-4 text-slate-600 sm:px-6">{formatPhone(customer.phone)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-500 sm:px-6">
                  {formatJoinDate(customer.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {children}
        {content}
      </section>

      {!isLoading && !errorMessage && (
        <nav
          aria-label="회원 목록 페이지"
          className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
        >
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, pageGroupStart - 10))}
            disabled={pageGroupStart === 1}
            aria-label="이전 페이지 묶음"
            className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
            이전
          </button>

          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={page === pageNumber ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm transition-colors sm:h-10 sm:min-w-10 sm:px-3 ${
                page === pageNumber
                  ? "font-bold text-emerald-700 underline decoration-2 underline-offset-4"
                  : "font-medium text-slate-600 hover:text-emerald-600"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(pageGroupStart + 10)}
            disabled={pageGroupEnd >= totalPages}
            aria-label="다음 페이지 묶음"
            className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:px-3 sm:text-sm"
          >
            다음
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      )}
    </>
  );
}
