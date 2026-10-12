"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface NoticeNeighbor {
  id: number;
  title: string;
}

interface NoticeDetailResponse {
  notice: NoticeDetail;
  previous_notice: NoticeNeighbor | null;
  next_notice: NoticeNeighbor | null;
}

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

export default function NoticeDetailPage() {
  const params = useParams<{ noticeId: string }>();
  const noticeId = params.noticeId;
  const [data, setData] = useState<NoticeDetailResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotice = async () => {
      try {
        const response = await fetch(`/api/notices/${noticeId}`);
        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(
            typeof result.detail === "string"
              ? result.detail
              : "공지사항을 불러오지 못했습니다."
          );
          return;
        }

        setData(result as NoticeDetailResponse);
      } catch (error) {
        console.error("공지사항 상세 조회 오류:", error);
        setErrorMessage("서버에 연결하지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotice();
  }, [noticeId]);

  if (isLoading) {
    return <main className="mx-auto min-h-[65vh] max-w-4xl px-6 py-16 text-center text-slate-500">공지사항을 불러오는 중입니다.</main>;
  }

  if (errorMessage || !data) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-4xl px-6 py-16 text-center">
        <p role="alert" className="text-sm text-rose-600">{errorMessage || "공지사항을 찾을 수 없습니다."}</p>
        <Link href="/notice" className="mt-6 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800">목록으로</Link>
      </main>
    );
  }

  const { notice, previous_notice, next_notice } = data;

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-5xl px-6 py-16 md:px-12 md:py-24">
      <div className="border-y-2 border-slate-700">
        <div className="border-b border-slate-200 px-5 py-7 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {notice.is_pinned && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">고정 공지</span>}
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{notice.title}</h1>
            </div>
            <time dateTime={notice.created_at} className="text-xs tabular-nums text-slate-500 sm:text-sm">
              {formatPostedAt(notice.created_at)}
            </time>
          </div>
          <p className="mt-4 text-xs text-slate-400">조회 {notice.view_count}</p>
        </div>

        <article className="min-h-80 whitespace-pre-wrap px-5 py-10 text-sm leading-8 text-slate-700 sm:px-8 sm:py-14 sm:text-base">
          {notice.content}
        </article>
      </div>

      <nav aria-label="이전·다음 공지사항" className="mt-8 border-y border-slate-300">
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] border-b border-slate-200 px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold text-slate-500">이전글</span>
          {previous_notice ? (
            <Link href={`/notice/${previous_notice.id}`} className="truncate text-sm text-slate-700 hover:text-emerald-700">{previous_notice.title}</Link>
          ) : <span className="text-sm text-slate-400">이전 글이 없습니다.</span>}
        </div>
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold text-slate-500">다음글</span>
          {next_notice ? (
            <Link href={`/notice/${next_notice.id}`} className="truncate text-sm text-slate-700 hover:text-emerald-700">{next_notice.title}</Link>
          ) : <span className="text-sm text-slate-400">다음 글이 없습니다.</span>}
        </div>
      </nav>

      <div className="mt-8 flex justify-end">
        <Link href="/notice" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">목록으로</Link>
      </div>
    </main>
  );
}
