"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Subject = "영어" | "스페인어" | "일본어" | "중국어";
type ClassName = "A반" | "B반" | "C반";
type StudentCourses = Record<Subject, ClassName | null>;

type AdminStudent = {
  student_id: number;
  name: string;
  username: string;
  created_at: string;
  courses: StudentCourses;
};


export default function StudentManagement() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  async function loadAdminStudents(page: number = 1) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("관리자 로그인이 필요합니다.");
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

    try {
      const response = await fetch(`${apiBaseUrl}/admin/students?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();

      console.log("관리자 학생 목록 응답", {
        url: `${apiBaseUrl}/admin/students?page=${page}`,
        status: response.status,
        data,
      });

      if (!response.ok) {
        alert(data.detail ?? `회원 목록을 불러오지 못했습니다. (${response.status})`);
        return;
      }

      setStudents(data.students ?? []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.page || page);
    } catch (error) {
      console.error("관리자 학생 목록 조회 오류:", error);
      alert("관리자 회원 목록 서버와 통신할 수 없습니다.");
    }
  }

  useEffect(() => {
    loadAdminStudents(1);
  }, []);

  const handleSearchSubmit = async (
    event?: React.FormEvent<HTMLFormElement>,
    showAll = false
  ) => {
    if (event) {
      event.preventDefault();
    }


    if (showAll) {
      setSearchName("");
      await loadAdminStudents(1);
      return;
    }

    if (!searchName.trim()) {
      alert("학생 이름을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
    const cleanSearchName = searchName.trim();
    const url = `${apiBaseUrl}/admin/students/search?name=${encodeURIComponent(cleanSearchName)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        setStudents([]);
        alert(data.detail ?? "일치하는 학생이 없습니다.");
        return;
      }

      alert(data.detail ?? "학생 정보를 불러오지 못했습니다.");
      return;
    }

    setStudents(data.students);
    setTotalPages(1);
    setCurrentPage(1);
  };

  async function handleStudentExport(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

  try {
    const response = await fetch(
      `${apiBaseUrl}/admin/students/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();

      throw new Error(
        data.detail ?? "현재 등록된 회원이 없습니다."
      );
    }

    const fileBlob = await response.blob();
    const downloadUrl = URL.createObjectURL(fileBlob);

    const contentDisposition = response.headers.get("Content-Disposition");

    const fileName =
      contentDisposition?.match(/filename="([^"]+)"/)?.[1] ??
      "students.xlsx";

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "엑셀 파일을 다운로드하지 못했습니다."
    );
  }
}




  return (
    <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-12">
      <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center sm:mb-12">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/j-academy-logo-web.png"
            alt="제이 외국어 온라인 학원 로고"
            width={48}
            height={48}
            className="h-8 w-8 sm:h-12 sm:w-12 shrink-0 object-contain"
            priority
          />
          <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl whitespace-nowrap">
            제이 외국어 온라인 학원
          </h1>
        </Link>
        <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
          학생 관리 목록
        </p>
      </div>
      <section className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8 md:p-10">
        <header className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:border-0 sm:pb-0">
          <div className="flex flex-col items-end w-full mb-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-wrap items-center justify-center gap-2 sm:justify-end"
            >
              <label
                htmlFor="student-search"
                className="text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                학생 검색하기
              </label>

              <div className="relative flex-1 sm:w-48 sm:flex-initial">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="student-search"
                  type="text"
                  placeholder="이름 입력"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="shrink-0 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                검색
              </button>
            </form>

            <button
              type="button"
              onClick={() => handleSearchSubmit(undefined, true)}
              className="mt-2 text-center text-xs text-slate-500 underline transition-colors hover:text-blue-600 sm:text-right"
            >
              전체보기 ↺
            </button>
          </div>
        </header>

        {students.length > 0 ? (
          <>
            <div className="mt-6 w-full overflow-x-auto rounded-lg border border-slate-300">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr className="divide-x divide-slate-200 border-b border-slate-200">
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">번호</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">이름</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">아이디</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">영어</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">스페인어</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">일본어</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">중국어</th>
                    <th className="px-4 py-3.5 text-center align-middle font-medium whitespace-nowrap">가입 날짜</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {students.map((student, index) => (
                    <tr
                      key={student.student_id}
                      className="divide-x divide-slate-200 transition-colors hover:bg-slate-50/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-center align-middle">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle font-medium text-slate-900 whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle text-slate-600 whitespace-nowrap">
                        {student.username}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        {student.courses["영어"] ?? "X"}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        {student.courses["스페인어"] ?? "X"}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        {student.courses["일본어"] ?? "X"}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        {student.courses["중국어"] ?? "X"}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle text-slate-500 whitespace-nowrap">
                        {new Date(student.created_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => loadAdminStudents(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => loadAdminStudents(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => loadAdminStudents(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                &gt;
              </button>
            </div>
          </>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">
            현재 등록된 학생 내역이 없습니다.
          </p>
        )}

        <form onSubmit={handleStudentExport} className="mt-8">
          <div className="flex w-full justify-center sm:justify-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 active:scale-95 sm:w-auto"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>회원목록 엑셀 다운로드</span>
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          제이 외국어 온라인 학원 학생 관리 시스템
        </p>
      </section>

      <div className="mx-auto mt-6 w-full max-w-5xl px-0">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600"
        >
          <svg 
            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span>홈으로 돌아가기</span>
        </Link>
      </div>
    </main>
  );
}
