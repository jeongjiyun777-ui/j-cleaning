"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

interface AccountCheckRequest {
  username: string;
  name: string;
  phone: string;
  birth_date: string;
}

export interface FindPwViewProps {
  name: string;
  setName: (value: string) => void;

  emailId: string;
  setEmailId: (val: string) => void;

  emailDomain: string;
  setEmailDomain: (val: string) => void;

  selectedDomain: string;
  setSelectedDomain: (val: string) => void;

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
  isResetComplete: boolean;
  onResetSubmit: () => Promise<void>;
  isFormValid: boolean;
  isSubmitting: boolean;
  message: string;

  password: string;
  passwordMessage: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function FindPwView({
  name,
  setName,
  emailId,
  setEmailId,
  emailDomain,
  setEmailDomain,
  selectedDomain,
  setSelectedDomain,
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
  isResetComplete,
  onResetSubmit,
  isFormValid,
  isSubmitting,
  message,
  password,
  passwordMessage,
  onPasswordChange,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
}: FindPwViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            비밀번호 찾기
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            가입 시 등록한 정보로{" "}
            <span className="font-semibold text-emerald-600">
              비밀번호
            </span>
            를 안전하게 변경할 수 있습니다.
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

          <div className="flex flex-col gap-2">
            <label htmlFor="username-local" className="text-sm font-semibold text-slate-800">
              아이디
            </label>
            <div className="flex w-full items-center gap-2">
              <input
                id="username-local"
                type="text"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
                placeholder="아이디 입력"
                autoCapitalize="none"
                required
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="shrink-0 text-sm font-medium text-slate-400">@</span>
              {selectedDomain === "direct" ? (
                <input
                  id="username-domain"
                  aria-label="이메일 도메인 직접 입력"
                  type="text"
                  value={emailDomain}
                  onChange={(event) => setEmailDomain(event.target.value)}
                  placeholder="도메인 직접 입력"
                  autoCapitalize="none"
                  required
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <select
                  id="username-domain"
                  aria-label="이메일 도메인 선택"
                  value={selectedDomain}
                  onChange={(event) => {
                    const domain = event.target.value;
                    setSelectedDomain(domain);
                    setEmailDomain(domain === "direct" ? "" : domain);
                  }}
                  required
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">도메인 선택</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="nate.com">nate.com</option>
                  <option value="direct">직접 입력</option>
                </select>
              )}
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

          {message && (
            <p role="status" className="text-center text-sm text-slate-600">
              {message}
            </p>
          )}

          {isFindSuccess && (
            <div className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="new-password" className="text-sm font-semibold text-slate-800">
                  새 비밀번호
                </label>
                <div className="relative w-full">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onPasswordChange}
                  placeholder="새 비밀번호를 입력하세요"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-16 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "새 비밀번호 숨기기" : "새 비밀번호 보기"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "숨김" : "보기"}
                </button>
                </div>
                {passwordMessage && (
                  <p aria-live="polite" className={`text-xs ${passwordMessage === "사용 가능한 비밀번호입니다." ? "text-emerald-600" : "text-rose-500"}`}>
                    {passwordMessage}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-800">
                  새 비밀번호 확인
                </label>
                <div className="relative w-full">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-16 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "확인 비밀번호 숨기기" : "확인 비밀번호 보기"}
                  aria-pressed={showConfirmPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? "숨김" : "보기"}
                </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p aria-live="polite" className={`text-xs ${password === confirmPassword ? "text-emerald-600" : "text-rose-500"}`}>
                    {password === confirmPassword
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onResetSubmit}
                disabled={isSubmitting || isResetComplete}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
              >
                <span>{isSubmitting ? "비밀번호 변경 중..." : "비밀번호 리셋"}</span>
                <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
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
            <span>{isSubmitting ? "계정 확인 중..." : "계정 확인하기"}</span>
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

          {isResetComplete && (
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


const FindPwPage = () => {
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

  const [name, setName] = useState("");

  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);

    if (/\s/.test(value)) {
      setPasswordMessage("비밀번호에는 공백을 넣을 수 없습니다.");
    } else if (value.length > 64) {
      setPasswordMessage("비밀번호는 64자 이하로 입력해 주세요.");
    } else if (value.length < 8) {
      setPasswordMessage("비밀번호는 8자 이상 입력해 주세요.");
    } else if (!hasLetter) {
      setPasswordMessage("영문을 포함해 주세요.");
    } else if (!hasNumber) {
      setPasswordMessage("숫자를 포함해 주세요.");
    } else if (!hasSpecialCharacter) {
      setPasswordMessage("특수문자를 포함해 주세요.");
    } else {
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    }
  };

  const [resultMessage, setResultMessage] = useState("");
  const [isFindSuccess, setIsFindSuccess] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    emailId.trim().length > 0 &&
    emailDomain.trim().length > 0 &&
    name.trim().length > 0 &&
    phoneFirst.trim().length === 3 &&
    phoneMiddle.trim().length === 4 &&
    phoneLast.trim().length === 4 &&
    birthYear.trim().length === 4 &&
    birthMonth.trim().length > 0 &&
    birthDay.trim().length > 0 &&
    !isSubmitting;


const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!isFormValid || isSubmitting) return;

  setIsSubmitting(true);
  setIsFindSuccess(false);
  setIsResetComplete(false);
  setResultMessage("");
  setMessage("가입 정보를 확인하는 중...");

  const username =
    `${emailId.trim()}@${emailDomain.trim()}`.toLowerCase();

  const requestData: AccountCheckRequest = {
    username,
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
    const response = await fetch(
      "/api/reset-password/check-account",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setMessage(
        typeof result.detail === "string"
          ? result.detail
          : "가입 정보를 확인하지 못했습니다."
      );
      return;
    }

    setIsFindSuccess(true);
    setResultMessage(
      "본인 확인이 완료되었습니다. 새 비밀번호를 설정해 주세요."
    );
    setMessage("");
  } catch {
    setMessage("서버에 연결하지 못했습니다.");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleResetSubmit = async () => {
    if (!isFindSuccess || isSubmitting || isResetComplete) return;

    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (
      password.length < 8 || password.length > 64 ||
      /\s/.test(password) || !/[A-Za-z]/.test(password) ||
      !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)
    ) {
      setMessage("비밀번호는 공백 없이 영문, 숫자, 특수문자를 포함한 8~64자로 입력해 주세요.");
      return;
    }

    const requestData = {
      name: name.trim(),
      username: `${emailId.trim()}@${emailDomain.trim()}`.toLowerCase(),
      phone: [phoneFirst.trim(), phoneMiddle.trim(), phoneLast.trim()].join(""),
      birth_date: [
        birthYear.trim(),
        birthMonth.trim().padStart(2, "0"),
        birthDay.trim().padStart(2, "0"),
      ].join("-"),
      new_password: password,
    };

    setIsSubmitting(true);
    setMessage("비밀번호 변경 중...");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(
          typeof result.detail === "string"
            ? result.detail
            : "비밀번호를 변경하지 못했습니다."
        );
        return;
      }

      setResultMessage("");
      setMessage("비밀번호 변경이 완료되었습니다.");
      setIsResetComplete(true);
      setPassword("");
      setPasswordMessage("");
      setConfirmPassword("");
      setName("");
      setEmailId("");
      setEmailDomain("");
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
    <FindPwView
      name={name}
      setName={setName}
      emailId={emailId}
      setEmailId={setEmailId}
      emailDomain={emailDomain}
      setEmailDomain={setEmailDomain}
      selectedDomain={selectedDomain}
      setSelectedDomain={setSelectedDomain}
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
      isResetComplete={isResetComplete}
      onResetSubmit={handleResetSubmit}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      message={message}
      password={password}
      passwordMessage={passwordMessage}
      onPasswordChange={handlePasswordChange}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      onSubmit={handleSubmit}
    />
  );
};


export default FindPwPage;
