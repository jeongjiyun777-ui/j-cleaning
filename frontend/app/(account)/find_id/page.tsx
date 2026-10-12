"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export interface FindIdViewProps {
  name: string;
  setName: (value: string) => void;

  phoneFirst: string;
  setPhoneFirst: (value: string) => void;
  phoneMiddle: string;
  setPhoneMiddle: (value: string) => void;
  phoneLast: string;
  setPhoneLast: (value: string) => void;

  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;

  resultMessage: string;
  isFindSuccess: boolean;
  isFormValid: boolean;
  message: string;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface FindIdRequest {
  name: string;
  phone: string;
  birth_date: string;
}

export interface FindIdResponse {
  username: string;
}

function FindIdView({
  name,
  setName,
  phoneFirst,
  setPhoneFirst,
  phoneMiddle,
  setPhoneMiddle,
  phoneLast,
  setPhoneLast,
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  resultMessage,
  isFindSuccess,
  isFormValid,
  message,
  onSubmit,
}: FindIdViewProps) {

return (
    <main className="flex min-h-[calc(100vh-160px)] w-full flex-col items-center justify-center bg-white px-6 py-12 md:px-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-left">
          <Link
            href="/"
            className="inline-flex items-center"
          >
            <img
              src="/j-cleaning-logo.png"
              alt="제이클리닝"
              className="block h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            아이디 찾기
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            가입 시 등록한 정보로 <span className="font-semibold text-emerald-600">아이디(이메일)</span>를 찾아드립니다.
          </p>
        </div>

        <form onSubmit={onSubmit} autoComplete="off" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-800">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone-first" className="text-sm font-semibold text-slate-800">
              휴대전화 번호
            </label>
            <div className="flex w-full items-center gap-2">
              <input
                id="phone-first"
                type="tel"
                maxLength={3}
                value={phoneFirst}
                onChange={(e) => setPhoneFirst(e.target.value)}
                placeholder="010"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="shrink-0 text-sm font-medium text-slate-400">-</span>
              <input
                id="phone-middle"
                type="tel"
                maxLength={4}
                value={phoneMiddle}
                onChange={(e) => setPhoneMiddle(e.target.value)}
                placeholder="1234"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="shrink-0 text-sm font-medium text-slate-400">-</span>
              <input
                id="phone-last"
                type="tel"
                maxLength={4}
                value={phoneLast}
                onChange={(e) => setPhoneLast(e.target.value)}
                placeholder="5678"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="birth-year" className="text-sm font-semibold text-slate-800">
              생년월일
            </label>
            <div className="flex w-full items-center gap-2">
              <input
                id="birth-year"
                type="text"
                maxLength={4}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="출생년도"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <input
                id="birth-month"
                type="text"
                maxLength={2}
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                placeholder="월"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <input
                id="birth-day"
                type="text"
                maxLength={2}
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                placeholder="일"
                required
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {resultMessage && (
            <div
              className={`rounded-xl p-4 text-center text-sm font-medium ${
                isFindSuccess
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-rose-50 text-rose-600 border border-rose-200/60"
              }`}
            >
              {resultMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`group mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all ${
              isFormValid
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <span>아이디 찾기</span>
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

          {isFindSuccess && (
            <Link
              href="/login"
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
            >
              <span>로그인하러 가기</span>
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          )}

          <div className="mt-4 flex items-center justify-center gap-5 text-sm font-medium text-slate-400">
            <Link
              href="/find_pw"
              className="transition-colors hover:text-slate-700"
            >
              비밀번호 찾기
            </Link>

            <div className="h-3 w-px bg-slate-200" />

            <Link
              href="/"
              className="transition-colors hover:text-slate-700"
            >
              홈으로
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};


const FindIdPage = () => {
  const [name, setName] = useState("");

  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [username, setUsername] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isFindSuccess, setIsFindSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    name.trim().length > 0 &&
    /^010$/.test(phoneFirst.trim()) &&
    /^\d{4}$/.test(phoneMiddle.trim()) &&
    /^\d{4}$/.test(phoneLast.trim()) &&
    /^\d{4}$/.test(birthYear.trim()) &&
    /^(0?[1-9]|1[0-2])$/.test(birthMonth.trim()) &&
    /^(0?[1-9]|[12]\d|3[01])$/.test(birthDay.trim()) &&
    !isSubmitting;


const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!isFormValid || isSubmitting) return;

  setIsSubmitting(true);
  setIsFindSuccess(false);
  setUsername("");
  setResultMessage("");
  setMessage("아이디 찾는 중...");

  const requestData: FindIdRequest = {
    name: name.trim(),
    phone: [
      phoneFirst.trim(),
      phoneMiddle.trim(),
      phoneLast.trim(),
    ].join(""),
    birth_date: [
      birthYear.trim(),
      birthMonth.trim().padStart(2, "0"),
      birthDay.trim().padStart(2, "0"),
    ].join("-"),
  };

  try {
    const response = await fetch("/api/find-id", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(
        typeof result.detail === "string"
          ? result.detail
          : "입력 정보를 확인해 주세요."
      );
      return;
    }

    const data: FindIdResponse = result;

    setUsername(data.username);
    setResultMessage(`가입하신 아이디는 ${data.username}입니다.`);
    setIsFindSuccess(true);
    setMessage("");
    setName("");
    setPhoneFirst("");
    setPhoneMiddle("");
    setPhoneLast("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
  } catch {
    setMessage("서버에 연결하지 못했습니다.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <FindIdView
      name={name}
      setName={setName}
      phoneFirst={phoneFirst}
      setPhoneFirst={setPhoneFirst}
      phoneMiddle={phoneMiddle}
      setPhoneMiddle={setPhoneMiddle}
      phoneLast={phoneLast}
      setPhoneLast={setPhoneLast}
      birthYear={birthYear}
      setBirthYear={setBirthYear}
      birthMonth={birthMonth}
      setBirthMonth={setBirthMonth}
      birthDay={birthDay}
      setBirthDay={setBirthDay}
      resultMessage={resultMessage}
      isFindSuccess={isFindSuccess}
      isFormValid={isFormValid}
      message={message}
      onSubmit={handleSubmit}
    />
  );
};


export default FindIdPage;
