"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authFetch, restoreSession, useAuthUser } from "@/lib/auth";

interface NoticeListItem {
  id: number;
  title: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
}

const PAGE_SIZE = 10;
const PAGES_PER_GROUP = 10;

function formatPostedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function NoticePage() {
  const router = useRouter();
  const user = useAuthUser();
  const isManager = user?.role === "manager";
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWriteNotice = () => {
    router.push("/notice/write");
  };

  const handleToggleDeleteMode = () => {
    if (isDeleteMode) setSelectedNoticeIds([]);
    setIsDeleteMode((current) => !current);
  };

  const handleToggleNoticeSelection = (noticeId: number) => {
    setSelectedNoticeIds((current) =>
      current.includes(noticeId)
        ? current.filter((id) => id !== noticeId)
        : [...current, noticeId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!isManager || selectedNoticeIds.length === 0 || isDeleting) return;

    const confirmed = window.confirm(
      `정말 삭제하시겠습니까?\n선택한 공지사항 ${selectedNoticeIds.length}개가 삭제됩니다.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setActionMessage("");

    try {
      const response = await authFetch("/api/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice_ids: selectedNoticeIds }),
      });
      const result = await response.json();

      if (!response.ok) {
        setActionMessage(
          typeof result.detail === "string"
            ? result.detail
            : "공지사항을 삭제하지 못했습니다."
        );
        return;
      }

      const deletedCount = Number(result.deleted_count) || 0;
      const updatedTotalCount = Math.max(0, totalCount - deletedCount);
      const updatedTotalPages = Math.max(
        1,
        Math.ceil(updatedTotalCount / PAGE_SIZE)
      );

      setTotalCount(updatedTotalCount);
      setTotalPages(updatedTotalPages);
      setSelectedNoticeIds([]);
      setIsDeleteMode(false);
      setActionMessage(
        typeof result.message === "string"
          ? result.message
          : "선택한 공지사항이 삭제되었습니다."
      );

      if (page > updatedTotalPages) {
        setPage(updatedTotalPages);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (error) {
      console.error("공지사항 삭제 오류:", error);
      setActionMessage("서버에 연결하지 못했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/notices?page=${page}`);
        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(
            typeof result.detail === "string"
              ? result.detail
              : "공지사항을 불러오지 못했습니다."
          );
          return;
        }

        setNotices(Array.isArray(result.notices) ? result.notices : []);
        setTotalCount(Number(result.total_count) || 0);
        setTotalPages(Math.max(1, Number(result.total_pages) || 1));
      } catch (error) {
        console.error("공지사항 조회 오류:", error);
        setErrorMessage("서버에 연결하지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotices();
  }, [page, refreshKey]);

  const pageGroupStart =
    Math.floor((page - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
  const pageGroupEnd = Math.min(pageGroupStart + PAGES_PER_GROUP - 1, totalPages);
  const visiblePages = Array.from(
    { length: pageGroupEnd - pageGroupStart + 1 },
    (_, index) => pageGroupStart + index
  );

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-6xl px-6 py-16 md:px-12 md:py-24">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/j-cleaning-logo.png"
              alt="제이클리닝"
              width={2172}
              height={724}
              priority
              className="h-auto w-24 sm:w-32"
            />
            <span aria-hidden="true" className="h-8 w-px bg-emerald-200" />
            <h1 className="whitespace-nowrap text-3xl font-semibold tracking-[-0.045em] text-slate-800 sm:text-4xl">
              공지사항
            </h1>
          </div>
          <div className="mt-3 flex items-center gap-2 pl-1 text-sm font-medium tracking-[-0.02em] text-slate-500">
            <span aria-hidden="true" className="h-px w-5 bg-emerald-500" />
            제이클리닝의 새로운 소식을 확인하세요.
          </div>
        </div>
        {isManager && (
          <div className="flex items-center gap-2">
            {isDeleteMode ? (
              <>
                <button
                  type="button"
                  onClick={handleToggleDeleteMode}
                  disabled={isDeleting}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedNoticeIds.length === 0 || isDeleting}
                  className="group flex items-center gap-2 rounded-xl border border-rose-600 px-4 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{isDeleting ? "삭제 중..." : `선택 삭제 (${selectedNoticeIds.length})`}</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleToggleDeleteMode}
                aria-expanded={isDeleteMode}
                className="group flex items-center gap-2 rounded-xl border border-rose-600 px-4 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50"
              >
                <span>삭제하기</span>
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleWriteNotice}
              className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 sm:px-5"
            >
              <span>작성하기</span>
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {actionMessage && (
        <p role="status" className="mt-4 text-right text-sm text-slate-600">
          {actionMessage}
        </p>
      )}

      <section aria-label="공지사항 목록" className="mt-10">
        <div className={`${isDeleteMode && isManager ? "grid grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_8rem] sm:grid-cols-[3rem_5rem_minmax(0,1fr)_13rem]" : "grid grid-cols-[3.5rem_minmax(0,1fr)_8rem] sm:grid-cols-[5rem_minmax(0,1fr)_13rem]"} border-y-2 border-slate-700 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-600 sm:px-6 sm:text-sm`}>
          {isDeleteMode && isManager && <span aria-hidden="true" />}
          <span className="text-center">번호</span>
          <span className="pl-3 sm:pl-5">제목</span>
          <span className="text-right">게시일</span>
        </div>

        {isLoading ? (
          <p className="border-b border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            공지사항을 불러오는 중입니다.
          </p>
        ) : errorMessage ? (
          <p role="alert" className="border-b border-slate-300 px-6 py-12 text-center text-sm text-rose-600">
            {errorMessage}
          </p>
        ) : notices.length === 0 ? (
          <p className="border-b border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          notices.map((notice, index) => (
            <div
              key={notice.id}
              className={`${isDeleteMode && isManager ? "grid grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_8rem] sm:grid-cols-[3rem_5rem_minmax(0,1fr)_13rem]" : "grid grid-cols-[3.5rem_minmax(0,1fr)_8rem] sm:grid-cols-[5rem_minmax(0,1fr)_13rem]"} group items-center border-b border-slate-200 px-4 py-5 transition-colors hover:bg-slate-50 sm:px-6 sm:py-6`}
            >
              {isDeleteMode && isManager && (
                <input
                  type="checkbox"
                  checked={selectedNoticeIds.includes(notice.id)}
                  onChange={() => handleToggleNoticeSelection(notice.id)}
                  aria-label={`${notice.title} 선택`}
                  className="mx-auto h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              )}
              <span className="text-center text-sm tabular-nums text-slate-500">
                {totalCount - ((page - 1) * PAGE_SIZE + index)}
              </span>
              <Link href={`/notice/${notice.id}`} className="flex min-w-0 items-center gap-2 pl-3 text-sm font-semibold text-slate-800 group-hover:text-emerald-700 sm:pl-5 sm:text-base">
                  {notice.is_pinned && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">
                      고정
                    </span>
                  )}
                  <span className="truncate">{notice.title}</span>
              </Link>
              <time dateTime={notice.created_at} className="text-right text-xs tabular-nums text-slate-500 sm:text-sm">
                {formatPostedAt(notice.created_at)}
              </time>
            </div>
          ))
        )}
      </section>

      {!isLoading && !errorMessage && (
        <nav
          aria-label="공지사항 페이지"
          className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, pageGroupStart - PAGES_PER_GROUP))}
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
              onClick={() => setPage(pageNumber)}
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
            onClick={() => setPage(pageGroupStart + PAGES_PER_GROUP)}
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
    </main>
  );
}
