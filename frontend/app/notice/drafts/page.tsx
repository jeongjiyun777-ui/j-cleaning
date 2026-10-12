"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";

interface NoticeDraftItem {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const PAGE_SIZE = 10;
const PAGES_PER_GROUP = 10;

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function NoticeDraftsPage() {
  const [drafts, setDrafts] = useState<NoticeDraftItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleToggleDeleteMode = () => {
    if (isDeleteMode) setSelectedDraftIds([]);
    setIsDeleteMode((current) => !current);
  };

  const handleToggleDraftSelection = (draftId: number) => {
    setSelectedDraftIds((current) =>
      current.includes(draftId)
        ? current.filter((id) => id !== draftId)
        : [...current, draftId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedDraftIds.length === 0 || isDeleting) return;

    const confirmed = window.confirm(
      `정말 삭제하시겠습니까?\n선택한 임시저장 글 ${selectedDraftIds.length}개가 삭제됩니다.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setActionMessage("");
    try {
      const response = await authFetch("/api/notices/drafts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft_ids: selectedDraftIds }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionMessage(
          typeof result.detail === "string"
            ? result.detail
            : "임시저장 글을 삭제하지 못했습니다."
        );
        return;
      }

      const deletedCount = Number(result.deleted_count) || 0;
      const updatedTotalCount = Math.max(0, totalCount - deletedCount);
      const updatedTotalPages = Math.max(1, Math.ceil(updatedTotalCount / PAGE_SIZE));
      setTotalCount(updatedTotalCount);
      setTotalPages(updatedTotalPages);
      setSelectedDraftIds([]);
      setIsDeleteMode(false);
      setActionMessage(
        typeof result.message === "string"
          ? result.message
          : "선택한 임시저장 글이 삭제되었습니다."
      );
      if (page > updatedTotalPages) {
        setPage(updatedTotalPages);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (error) {
      console.error("임시저장 글 삭제 오류:", error);
      setActionMessage("서버에 연결하지 못했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadDrafts = async () => {
      try {
        const response = await authFetch(`/api/notices/drafts?page=${page}`, {
          method: "GET",
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          let error = "임시저장 보관함을 불러오지 못했습니다.";
          if (typeof result.detail === "string") {
            error = result.detail;
          }
          if (isActive) setErrorMessage(error);
          return;
        }

        if (isActive) {
          setDrafts(Array.isArray(result.drafts) ? result.drafts : []);
          setTotalCount(Number(result.total_count) || 0);
          setTotalPages(Math.max(1, Number(result.total_pages) || 1));
        }
      } catch (error) {
        console.error("임시저장 보관함 조회 오류:", error);
        if (isActive) setErrorMessage("서버에 연결하지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadDrafts();
    return () => {
      isActive = false;
    };
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
              임시저장 보관함
            </h1>
          </div>
          <p className="mt-3 text-sm font-medium tracking-[-0.02em] text-slate-500">
            저장한 초안을 선택하면 이어서 작성할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDeleteMode && (
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
                disabled={selectedDraftIds.length === 0 || isDeleting}
                className="group flex items-center gap-2 rounded-xl border border-rose-600 px-4 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{isDeleting ? "삭제 중..." : `선택 삭제 (${selectedDraftIds.length})`}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" />
                </svg>
              </button>
            </>
          )}
          {!isDeleteMode && (
            <button
              type="button"
              onClick={handleToggleDeleteMode}
              className="group flex items-center gap-2 rounded-xl border border-rose-600 px-4 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50"
            >
              <span>삭제하기</span>
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0-7 7m7-7H3" />
              </svg>
            </button>
          )}
          <Link
            href="/notice/write"
            className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 sm:px-5"
          >
            작성 화면으로
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <section aria-label="임시저장 목록" className="mt-10">
        {actionMessage && (
          <p role="status" className="mb-4 text-right text-sm text-slate-600">
            {actionMessage}
          </p>
        )}

        <div className={`${isDeleteMode ? "grid grid-cols-[2rem_2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_5rem_minmax(0,1fr)_13rem]" : "grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[5rem_minmax(0,1fr)_13rem]"} border-y-2 border-slate-700 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-600 sm:px-6 sm:text-sm`}>
          {isDeleteMode && <span aria-hidden="true" />}
          <span className="text-center">번호</span>
          <span className="pl-3 sm:pl-5">제목</span>
          <span className="hidden text-right sm:block">임시저장일</span>
        </div>

        {isLoading && (
          <p className="border-b border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            임시저장 글을 불러오는 중입니다.
          </p>
        )}

        {!isLoading && errorMessage && (
          <p role="alert" className="border-b border-slate-300 px-6 py-12 text-center text-sm text-rose-600">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && drafts.length === 0 && (
          <p className="border-b border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            저장된 초안이 없습니다.
          </p>
        )}

        {!isLoading && !errorMessage && drafts.length > 0 && (
          <div>
            {drafts.map((draft, index) => (
              <div
                key={draft.id}
                className={`${isDeleteMode ? "grid grid-cols-[2rem_2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_5rem_minmax(0,1fr)_13rem]" : "grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[5rem_minmax(0,1fr)_13rem]"} items-center border-b border-slate-200 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6 sm:py-5`}
              >
                {isDeleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedDraftIds.includes(draft.id)}
                    onChange={() => handleToggleDraftSelection(draft.id)}
                    aria-label={`${draft.title} 선택`}
                    className="mx-auto h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                )}
                <span className="text-center text-sm tabular-nums text-slate-500">
                  {totalCount - ((page - 1) * PAGE_SIZE + index)}
                </span>
                <Link
                  href={`/notice/write?draftId=${draft.id}`}
                  className="flex min-w-0 flex-col gap-1 pl-3 text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-700 sm:pl-5 sm:text-base"
                >
                  <span className="truncate">{draft.title}</span>
                  <time dateTime={draft.updated_at} className="text-xs font-normal tabular-nums text-slate-500 sm:hidden">
                    {formatSavedAt(draft.updated_at)}
                  </time>
                </Link>
                <time dateTime={draft.updated_at} className="hidden text-right text-xs tabular-nums text-slate-500 sm:block sm:text-sm">
                  {formatSavedAt(draft.updated_at)}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>

      {!isLoading && !errorMessage && (
        <nav
          aria-label="임시저장 페이지"
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
