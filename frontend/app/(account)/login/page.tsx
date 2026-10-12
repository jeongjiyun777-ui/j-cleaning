"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { acceptLogin, type AuthUser, type LoginResponse } from "@/lib/auth";

interface LoginViewProps {
  emailId: string;
  setEmailId: (val: string) => void;
  emailDomain: string;
  setEmailDomain: (val: string) => void;
  selectedDomain: string;
  setSelectedDomain: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isFormValid: boolean;
  message: string;
  user: AuthUser | null;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}


function LoginView({
  emailId,
  setEmailId,
  emailDomain,
  setEmailDomain,
  selectedDomain,
  setSelectedDomain,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isFormValid,
  message,
  user,
  onSubmit,
}: LoginViewProps) {

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
            로그인
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            회원가입하면 첫 청소{" "}
            <span className="font-bold text-emerald-600">10% 할인</span>과<br />
            견적 내역 저장 혜택을 받을 수 있어요.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
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
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-slate-800">비밀번호</label>
              <Link href="/find_pw" className="text-xs font-medium text-slate-400 transition-colors hover:text-emerald-600">
                비밀번호 찾기
              </Link>
            </div>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                {showPassword ? "숨김" : "보기"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`group mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-bold transition-all ${
              isFormValid
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <span>로그인</span>
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

          <div className="mt-4 flex items-center justify-center gap-5 text-sm font-medium text-slate-400">
            <Link href="/register" className="font-bold text-emerald-600 transition-colors hover:text-emerald-700">
              회원가입
            </Link>
            <div className="h-3 w-px bg-slate-200" />
            <Link href="/find_id" className="transition-colors hover:text-slate-700">
              아이디 찾기
            </Link>
            <div className="h-3 w-px bg-slate-200" />
            <Link href="/" className="transition-colors hover:text-slate-700">
              홈으로
            </Link>
          </div>

        </form>

      </div>
    </main>
  );
}
const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const isFormValid = Boolean(emailId.trim() && emailDomain.trim() && password) && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setUser(null);
    setMessage("로그인 확인 중...");
    try {
      const response = await fetch("/api/login", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: `${emailId.trim()}@${emailDomain.trim()}`.toLowerCase(),
          password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.alert("아이디/비밀번호가 틀렸습니다.");
          setMessage("");
          return;
        }
        setMessage(typeof result.detail === "string" ? result.detail : "로그인에 실패했습니다.");
        return;
      }
      const data: LoginResponse = result;
      acceptLogin(data);
      setUser(data.user);
      setMessage(data.user.greeting ?? data.message);
      setPassword("");
      router.replace("/");
    } catch {
      setMessage("서버에 연결하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginView
      emailId={emailId} setEmailId={setEmailId}
      emailDomain={emailDomain} setEmailDomain={setEmailDomain}
      selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain}
      password={password} setPassword={setPassword}
      showPassword={showPassword} setShowPassword={setShowPassword}
      isFormValid={isFormValid} message={message} user={user} onSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
