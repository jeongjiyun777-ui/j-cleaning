"use client";

import { useEffect, useState } from "react";
import { authFetch, restoreSession, useAuthUser } from "@/lib/auth";

interface CustomerListItem {
  id: number;
  name: string;
  username: string;
  created_at: string;
}

interface CustomerListResponse {
  customers: CustomerListItem[];
  total_count: number;
}

export default function AdminMembersPage() {
  const user = useAuthUser();
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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
        const response = await authFetch("/api/customers");
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
          setTotalCount(data.total_count);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "회원 목록을 불러오지 못했습니다.",
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
  }, [isSessionReady, user]);

  return (
    <main className="min-h-[calc(100vh-160px)] flex-1 bg-slate-50 px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              J-CLEANING ADMIN
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              회원 목록
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              가입한 회원 정보를 확인합니다.
            </p>
          </div>
          {isSessionReady && user?.role === "manager" && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
              전체 회원 <span className="ml-2 font-bold text-slate-900">{totalCount}명</span>
            </div>
          )}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!isSessionReady ? (
            <p role="status" className="px-6 py-12 text-center text-sm text-slate-500">
              로그인 정보를 확인하고 있습니다...
            </p>
          ) : user?.role !== "manager" ? (
            <p role="alert" className="px-6 py-12 text-center text-sm font-medium text-slate-600">
              관리자 로그인 후 이용할 수 있습니다.
            </p>
          ) : isLoading ? (
            <p role="status" className="px-6 py-12 text-center text-sm text-slate-500">
              회원 목록을 불러오고 있습니다...
            </p>
          ) : errorMessage ? (
            <p role="alert" className="px-6 py-12 text-center text-sm font-medium text-rose-600">
              {errorMessage}
            </p>
          ) : customers.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              등록된 회원이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="w-24 px-6 py-4">회원 번호</th>
                    <th scope="col" className="px-6 py-4">이름</th>
                    <th scope="col" className="px-6 py-4">아이디</th>
                    <th scope="col" className="w-40 px-6 py-4">가입일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-medium tabular-nums text-slate-500">{customer.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{customer.name}</td>
                      <td className="px-6 py-4 text-slate-600">{customer.username}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(customer.created_at).toLocaleDateString("ko-KR", {
                          timeZone: "Asia/Seoul",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
