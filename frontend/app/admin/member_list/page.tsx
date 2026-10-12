"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MemberListSection, { type CustomerListItem } from "@/components/admin/MemberListSection";
import { authFetch, restoreSession, useAuthUser } from "@/lib/auth";

interface CustomerListResponse {
  customers: CustomerListItem[];
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
}

const PAGES_PER_GROUP = 10;

export default function AdminMemberListPage() {
  const user = useAuthUser();
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    void restoreSession().finally(() => {
      if (isMounted) setIsSessionReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isSessionReady || user?.role !== "manager") return;

    let isMounted = true;
    const loadCustomers = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await authFetch(`/api/customers?page=${page}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            typeof result.detail === "string"
              ? result.detail
              : "회원 목록을 불러오지 못했습니다.",
          );
        }

        const data: CustomerListResponse = result;
        if (isMounted) {
          setCustomers(data.customers);
          setPage(data.page);
          setTotalCount(data.total_count);
          setTotalPages(Math.max(1, data.total_pages));
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "회원 목록을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadCustomers();
    return () => {
      isMounted = false;
    };
  }, [isSessionReady, user, page]);

  const pageGroupStart =
    Math.floor((page - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
  const pageGroupEnd = Math.min(pageGroupStart + PAGES_PER_GROUP - 1, totalPages);
  const visiblePages = Array.from(
    { length: pageGroupEnd - pageGroupStart + 1 },
    (_, index) => pageGroupStart + index,
  );

  return (
    <main className="min-h-[calc(100vh-160px)] flex-1 bg-slate-50 px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <Link href="/" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
              <Image
                src="/j-cleaning-logo.png"
                alt="제이클리닝 로고"
                width={200}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
                priority
              />
            </Link>
            <span aria-hidden="true" className="hidden h-9 w-px bg-emerald-200 sm:block" />
            <div className="text-center sm:text-left">
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              회원 목록
            </h1>
            <p className="mt-2 text-sm text-slate-500">가입한 회원 정보를 확인합니다.</p>
            </div>
          </div>
          {isSessionReady && user?.role === "manager" && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm text-slate-600 sm:ml-auto">
              전체 회원 <span className="ml-2 font-bold text-slate-900">{totalCount}명</span>
            </div>
          )}
        </div>

        {!isSessionReady ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            로그인 정보를 확인하고 있습니다...
          </section>
        ) : user?.role !== "manager" ? (
          <section role="alert" className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-600">
            관리자 로그인 후 이용할 수 있습니다.
          </section>
        ) : (
          <MemberListSection
            customers={customers}
            isLoading={isLoading}
            errorMessage={errorMessage}
            page={page}
            totalPages={totalPages}
            pageGroupStart={pageGroupStart}
            pageGroupEnd={pageGroupEnd}
            visiblePages={visiblePages}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
