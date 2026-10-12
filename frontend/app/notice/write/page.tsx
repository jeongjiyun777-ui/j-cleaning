"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth";

export interface NoticeCreatePayload {
  title: string;
  content: string;
  is_pinned: boolean;
}

export type NoticeDraftRequest = Pick<
  NoticeCreatePayload,
  "title" | "content" | "is_pinned"
>;

export interface NoticeDraftItem extends NoticeDraftRequest {
  id: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NoticeCreateViewProps {
  formData?: NoticeCreatePayload;
  onChangeField?: <K extends keyof NoticeCreatePayload>(
    key: K,
    value: NoticeCreatePayload[K]
  ) => void;
  isSubmitting?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

const MAX_TITLE_LENGTH = 70;

const DEFAULT_FORM_DATA: NoticeCreatePayload = {
  title: "",
  content: "",
  is_pinned: false,
};

export function NoticeCreateView({
  formData = DEFAULT_FORM_DATA,
  onChangeField = () => {},
  isSubmitting = false,
  onSubmit = (e) => e.preventDefault(),
}: NoticeCreateViewProps) {
  const title = formData?.title ?? "";
  const content = formData?.content ?? "";
  const isPinned = formData?.is_pinned ?? false;

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-4xl px-6 py-16 md:px-12 md:py-24">
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
            <h1 className="whitespace-nowrap text-3xl font-extrabold tracking-tight text-slate-900">
              공지사항 작성
            </h1>
          </div>
          <p className="mt-3 text-sm text-slate-500">새로운 서비스 공지글을 등록합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/notice"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            목록으로
          </Link>
          <Link
            href="/notice/drafts"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            임시저장 보관함
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5 select-none">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => onChangeField("is_pinned", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-semibold text-slate-700">상단 고정 공지</span>
          </label>
          <span className="text-xs font-medium text-slate-400">
            {title.length} / {MAX_TITLE_LENGTH}자
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-bold text-slate-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={MAX_TITLE_LENGTH}
            value={title}
            onChange={(e) => onChangeField("title", e.target.value)}
            placeholder="공지사항 제목을 입력하세요 (최대 70자)"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-xs font-bold text-slate-700">
            내용
          </label>
          <textarea
            id="content"
            required
            rows={12}
            value={content}
            onChange={(e) => onChangeField("content", e.target.value)}
            placeholder="공지사항 본문 내용을 입력하세요"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            name="intent"
            value="draft"
            className="rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            임시저장하기
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {isSubmitting ? "등록 중..." : "게시글 등록"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<NoticeCreatePayload>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);

  const handleChangeField = <K extends keyof NoticeCreatePayload>(
    key: K,
    value: NoticeCreatePayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setEditingDraftId(null);
  };

  useEffect(() => {
    const draftIdValue = new URLSearchParams(window.location.search).get("draftId");
    if (!draftIdValue) return;

    const draftId = Number(draftIdValue);
    if (!Number.isInteger(draftId) || draftId <= 0) {
      alert("임시저장 번호가 올바르지 않습니다.");
      return;
    }

    let isActive = true;
    const loadDraft = async () => {
      try {
        const response = await authFetch(`/api/notices/drafts/${draftId}`, {
          method: "GET",
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          let errorMessage = "임시저장 내용을 불러오지 못했습니다.";
          if (typeof result.detail === "string") {
            errorMessage = result.detail;
          }
          if (isActive) alert(errorMessage);
          return;
        }

        const draft = result.draft as NoticeDraftItem;
        if (isActive) {
          setFormData({
            title: draft.title,
            content: draft.content,
            is_pinned: draft.is_pinned,
          });
          setEditingDraftId(draft.id);
        }
      } catch (error) {
        console.error("임시저장 내용 조회 오류:", error);
        if (isActive) alert("서버에 연결하지 못했습니다.");
      }
    };

    void loadDraft();
    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const isDraft = submitter !== null && submitter.value === "draft";

    const requestData: NoticeDraftRequest = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      is_pinned: formData.is_pinned,
    };

    if (!requestData.title || !requestData.content) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let endpoint = "/api/notices";
      let method = "POST";
      if (isDraft) {
        endpoint = "/api/notices/drafts";
        if (editingDraftId !== null) {
          endpoint = `/api/notices/drafts/${editingDraftId}`;
          method = "PUT";
        }
      }

      const response = await authFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        if (isDraft) {
          alert(result.message ?? "임시저장되었습니다.");
          if (typeof result.draft?.id === "number") {
            setEditingDraftId(result.draft.id);
          }
        } else {
          alert(result.message ?? "게시되었습니다.");
          handleReset();
          router.push("/notice");
        }
      } else {
        let fallbackMessage = "공지사항을 등록하지 못했습니다.";
        if (isDraft) {
          fallbackMessage = "공지사항을 임시저장하지 못했습니다.";
        }

        let errorMessage = fallbackMessage;
        if (typeof result.detail === "string") {
          errorMessage = result.detail;
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error("공지사항 등록 오류:", error);
      alert("서버에 연결하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NoticeCreateView
      formData={formData}
      onChangeField={handleChangeField}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
