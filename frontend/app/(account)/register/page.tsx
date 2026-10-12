"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  name: string;
  setName: (value: string) => void;

  emailId: string;
  setEmailId: (value: string) => void;

  emailDomain: string;
  setEmailDomain: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  confirmPassword: string;
  setConfirmPassword: (value: string) => void;

  birthYear: string;
  setBirthYear: (value: string) => void;

  birthMonth: string;
  setBirthMonth: (value: string) => void;

  birthDay: string;
  setBirthDay: (value: string) => void;

  phoneFirst: string;
  setPhoneFirst: (value: string) => void;

  phoneMiddle: string;
  setPhoneMiddle: (value: string) => void;

  showPassword: boolean;
  setShowPassword: (value: boolean) => void;

  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;

  passwordMessage: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  phoneLast: string;
  setPhoneLast: (value: string) => void;
  onCheckUsername: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  message: string;
  isSubmitting: boolean;
  isFormValid: boolean;
}


interface JoinBreadcrumbProps {
  step: 1 | 2 | 3;
}

function JoinBreadcrumb({ step }: JoinBreadcrumbProps) {
  return (
    <div className="flex w-full items-center justify-end border-b border-slate-200/60 bg-slate-100/50 px-6 py-3.5 sm:px-10 lg:px-24">
      <ol className="flex items-center gap-2 text-xs font-medium text-slate-400 sm:text-sm">
        <li className={step === 1 ? "font-bold text-emerald-600" : ""}>01 약관동의</li>
        <li>
          <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className={step === 2 ? "font-bold text-emerald-600" : ""}>02 정보입력</li>
        <li>
          <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className={step === 3 ? "font-bold text-emerald-600" : ""}>03 가입완료</li>
      </ol>
    </div>
  );
}


function RegisterForm({
  name, setName,
  emailId, setEmailId,
  emailDomain, setEmailDomain,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  birthYear, setBirthYear,
  birthMonth, setBirthMonth,
  birthDay, setBirthDay,
  phoneFirst, setPhoneFirst,
  phoneMiddle, setPhoneMiddle,
  phoneLast, setPhoneLast,
  showPassword, setShowPassword,
  showConfirmPassword, setShowConfirmPassword,
  onCheckUsername, onSubmit, message, isSubmitting, isFormValid, passwordMessage, onPasswordChange,
}: RegisterFormProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-16">
      
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">기본정보입력</h2>
        <p className="text-xs text-slate-500">
          <span className="text-emerald-500">*</span> 는 필수 입력사항으로 온라인 회원가입시 반드시 필요한 항목입니다.
        </p>
      </div>
      <form
        id="register-form"
        onSubmit={onSubmit}
        autoComplete="off"
        className="border-t-2 border-emerald-600 bg-white text-sm shadow-sm"
      >
        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            아이디 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex w-full max-w-lg items-center gap-2">
              <input
                type="text"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
                maxLength={12}
                id="username-local"
                className="w-full flex-1 rounded border border-slate-300 px-3 py-2.5 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-400">@</span>
              <select
                id="username-domain"
                value={emailDomain}
                onChange={(event) => setEmailDomain(event.target.value)}
                className="w-full flex-1 rounded border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">도메인을 선택해 주세요</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="kakao.com">kakao.com</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="nate.com">nate.com</option>
                <option value="direct">직접 입력</option>
              </select>

              <button
                type="button"
                onClick={onCheckUsername}
                className="shrink-0 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                중복확인
              </button>
            </div>
            <p className="text-xs text-slate-500">
              (영문 또는 영문+숫자조합으로 3~12자. 가입후 ID변경 불가)
            </p>
          </div>
        </div>

        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            비밀번호 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="relative w-full max-w-sm">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onPasswordChange}
                placeholder="비밀번호 입력"
                className="w-full rounded border border-slate-300 py-2.5 pl-3 pr-14 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                {showPassword ? "숨김" : "보기"}
              </button>
            </div>
            <p className="text-xs text-slate-500">(영문, 숫자, 특수기호 포함 8자 이상)</p>
            {passwordMessage && (
              <p
                className={`text-xs ${
                  passwordMessage === "사용 가능한 비밀번호입니다."
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {passwordMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            비밀번호 확인 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="relative w-full max-w-sm">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full rounded border border-slate-300 py-2.5 pl-3 pr-14 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? "숨김" : "보기"}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p
                className={`text-xs ${
                  password === confirmPassword
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {password === confirmPassword
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            이름 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={15}
              className="w-full max-w-sm rounded border border-slate-300 px-3 py-2.5 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex flex-col border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            생년월일 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex w-full max-w-sm items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                id="birth-year"
                placeholder="YYYY"
                maxLength={4}
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
                className="w-20 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="shrink-0 text-sm font-medium text-slate-500">년</span>
              <input
                type="text"
                inputMode="numeric"
                id="birth-month"
                placeholder="MM"
                maxLength={2}
                value={birthMonth}
                onChange={(event) => setBirthMonth(event.target.value)}
                className="w-16 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="shrink-0 text-sm font-medium text-slate-500">월</span>
              <input
                type="text"
                inputMode="numeric"
                id="birth-day"
                placeholder="DD"
                maxLength={2}
                value={birthDay}
                onChange={(event) => setBirthDay(event.target.value)}
                className="w-16 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="shrink-0 text-sm font-medium text-slate-500">일</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 sm:flex-row sm:items-start sm:p-6 sm:px-8">
          <div className="mb-2 w-full shrink-0 pt-2 font-semibold text-slate-800 sm:mb-0 sm:w-40">
            휴대폰 번호 <span className="text-emerald-500">*</span>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex w-full max-w-sm items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                id="phone-first"
                placeholder="010"
                maxLength={3}
                value={phoneFirst}
                onChange={(event) => setPhoneFirst(event.target.value)}
                className="w-16 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="shrink-0 text-slate-400">-</span>
              <input
                type="text"
                inputMode="numeric"
                id="phone-middle"
                placeholder="1234"
                maxLength={4}
                value={phoneMiddle}
                onChange={(event) => setPhoneMiddle(event.target.value)}
                className="w-20 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="shrink-0 text-slate-400">-</span>
              <input
                type="text"
                inputMode="numeric"
                id="phone-last"
                placeholder="5678"
                maxLength={4}
                value={phoneLast}
                onChange={(event) => setPhoneLast(event.target.value)}
                className="w-20 shrink-0 rounded border border-slate-300 px-3 py-2.5 text-center outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="mt-10 flex items-center justify-center gap-3 sm:gap-4">
        <Link
          href="/register_agree"
          className="group flex h-12 w-32 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
        >
          <svg
            className="h-5 w-5 rotate-180 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          이전
        </Link>

        <button
          type="submit"
          form="register-form"
          disabled={!isFormValid || isSubmitting}
          className="group flex h-12 w-32 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{isSubmitting ? "처리 중..." : "회원가입"}</span>
          {!isSubmitting && (
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </div>

      <p role="status" className="mt-4 text-center text-sm text-slate-700">
        {message}
      </p>
    </div>
  );
}


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isFormValid =
  name.trim().length > 0 &&
  emailId.trim().length > 0 &&
  emailDomain.trim().length > 0 &&
  password.length >= 8 &&
  password.length <= 64 &&
  !/\s/.test(password) &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password) &&
  confirmPassword.length > 0 &&
  password === confirmPassword &&
  birthYear.length === 4 &&
  birthMonth.length > 0 &&
  birthDay.length > 0 &&
  phoneFirst.length === 3 &&
  phoneMiddle.length === 4 &&
  phoneLast.length === 4;

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;
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
}

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckUsername = async () => {
    const id = emailId.trim();
    const domain = emailDomain.trim();

    if (!id || !domain || domain === "direct") {
      alert("아이디와 이메일 도메인을 입력해 주세요.");
      return;
    }

    const username = `${id}@${domain}`.toLowerCase();
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(username)) {
      alert("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch("/api/customers/check-username", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (response.status === 409) {
        alert("중복된 아이디가 있습니다.");
        return;
      }
      if (!response.ok) {
        alert("아이디 중복확인에 실패했습니다.");
        return;
      }
      alert("사용 가능한 아이디입니다.");
    } catch {
      alert("서버에 연결하지 못했습니다.");
    }
  };
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (isSubmitting) return;

    const requiredValues = [
      name, emailId, emailDomain, password, confirmPassword,
      birthYear, birthMonth, birthDay,
      phoneFirst, phoneMiddle, phoneLast,
    ];

    if (requiredValues.some((value) => value.trim() === "")) {
      setMessage("모든 항목을 입력해 주세요.");
      return;
    }

    if (/\s/.test(password) || /\s/.test(confirmPassword)) {
      setMessage("비밀번호에는 공백을 넣을 수 없습니다.");
      return;
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (
      password.length < 8 ||
      password.length > 64 ||
      !hasLetter ||
      !hasNumber ||
      !hasSpecial
    ) {
      setMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~64자로 입력해 주세요."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const username =
      `${emailId.trim()}@${emailDomain.trim()}`.toLowerCase();

    if (/\s/.test(username)) {
      setMessage("이메일에는 공백을 넣을 수 없습니다.");
      return;
    }

    const data = {
      name: name.trim(),
      username,
      password,
      birth_date: [
        birthYear.trim(),
        birthMonth.trim().padStart(2, "0"),
        birthDay.trim().padStart(2, "0"),
      ].join("-"),
      phone: `${phoneFirst}${phoneMiddle}${phoneLast}`
        .replace(/\s/g, ""),
    };

    setIsSubmitting(true);
    setMessage("가입 처리 중...");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          typeof result.detail === "string"
            ? result.detail
            : "입력 형식을 확인해 주세요."
        );
        return;
      }


      setName("");
      setEmailId("");
      setEmailDomain("");
      setPassword("");
      setConfirmPassword("");
      setBirthYear("");
      setBirthMonth("");
      setBirthDay("");
      setPhoneFirst("");
      setPhoneMiddle("");
      setPhoneLast("");
      alert("회원가입이 완료되었습니다.");
      router.push("/register_result");
    } catch {
      setMessage("서버에 연결하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const router = useRouter();

  return (
    <main className="w-full bg-slate-50">
      <JoinBreadcrumb step={2} />

      <RegisterForm
        name={name}
        setName={setName}
        emailId={emailId}
        setEmailId={setEmailId}
        emailDomain={emailDomain}
        setEmailDomain={setEmailDomain}
        passwordMessage={passwordMessage}
        onPasswordChange={handlePasswordChange}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        birthYear={birthYear}
        setBirthYear={setBirthYear}
        birthMonth={birthMonth}
        setBirthMonth={setBirthMonth}
        birthDay={birthDay}
        setBirthDay={setBirthDay}
        phoneFirst={phoneFirst}
        setPhoneFirst={setPhoneFirst}
        phoneMiddle={phoneMiddle}
        setPhoneMiddle={setPhoneMiddle}
        phoneLast={phoneLast}
        setPhoneLast={setPhoneLast}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        onCheckUsername={handleCheckUsername}
        onSubmit={handleSubmit}
        message={message}
        isSubmitting={isSubmitting}
        isFormValid={isFormValid}
      />
    </main>
  );
};

export default RegisterPage;
