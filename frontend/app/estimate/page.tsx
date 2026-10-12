"use client";

import { useRef, useState, type FormEvent } from "react";

const CLEANING_OPTIONS = [
  { id: "move_in", label: "입주 청소", desc: "신축 건물 첫 입주 시" },
  { id: "move_out", label: "이사 청소", desc: "기존 거주자의 흔적 제거" },
  { id: "residence", label: "거주 청소", desc: "현재 살고 있는 공간 청소" },
  { id: "office", label: "상가/사무실", desc: "업무 공간 정기/일회성 청소" },
  { id: "special", label: "특수 청소", desc: "폐기물, 쓰레기집 등 특수 현장" },
  { id: "partial", label: "부분 청소", desc: "화장실, 주방 등 특정 구역만" },
];

interface HousingType {
  id: string;
  label: string;
  description: string;
}

const RESIDENTIAL_TYPES: HousingType[] = [
  { id: "apartment", label: "아파트", description: "공동주택 아파트" },
  { id: "villa", label: "빌라", description: "다세대·연립주택" },
  { id: "officetel", label: "오피스텔", description: "주거형 오피스텔" },
  { id: "house", label: "주택", description: "단독·다가구주택" },
];

const RESIDENTIAL_AREAS: HousingType[] = [
  { id: "under-10", label: "10평 이하", description: "소형 주거 공간" },
  { id: "10-20", label: "10평 ~ 20평", description: "원룸·소형 주택" },
  { id: "20-30", label: "20평 ~ 30평", description: "일반 주거 공간" },
  { id: "30-40", label: "30평 ~ 40평", description: "중형 주거 공간" },
  { id: "40-50", label: "40평 ~ 50평", description: "대형 주거 공간" },
  { id: "over-50", label: "50평 이상", description: "대형 주택·복층 공간" },
];

const COMMERCIAL_TYPES: HousingType[] = [
  { id: "office", label: "사무실", description: "업무 공간" },
  { id: "restaurant-cafe", label: "식당/카페", description: "음식점·카페 공간" },
  { id: "academy-hospital", label: "학원/병원", description: "교육·의료 공간" },
  { id: "store", label: "일반 상가/매장", description: "판매·매장 공간" },
];

const PARTIAL_CLEANING_TYPES: HousingType[] = [
  { id: "bathroom", label: "화장실 / 욕실 집중", description: "곰팡이·물때·환풍기 세척" },
  { id: "kitchen", label: "주방 / 싱크대 집중", description: "기름때·후드·상판 세척" },
  { id: "balcony", label: "창틀 / 베란다", description: "샷시 레일·틈새 오염 세척" },
  { id: "floor", label: "방 바닥 / 거실 마루", description: "묵은 때 기계 세척·코팅" },
  { id: "refrigerator", label: "냉장고 / 가전 내부", description: "찌꺼기 제거·스팀 살균" },
  { id: "air-conditioner", label: "에어컨 필터 및 분해", description: "벽걸이·스탠드·시스템 세척" },
];

const SPECIAL_CLEANING_TYPES: HousingType[] = [
  { id: "hoarding-home", label: "쓰레기집 / 방치 공간", description: "생활 쓰레기 대량 적재 공간" },
  { id: "large-waste", label: "대형 폐기물 수거", description: "가구·가전·잡동사니 철거" },
  { id: "estate-cleanout", label: "유품 정리 / 빈집 정리", description: "유품 분류·수거·실내 방역" },
  { id: "fire-damage", label: "화재 / 그을음 현장", description: "냄새·벽면·천장 그을음 제거" },
  { id: "water-damage", label: "누수 / 침수 피해 복구", description: "곰팡이 제거·건조·방역" },
  { id: "pet-waste", label: "반려동물 오염 공간", description: "악취 중화·침투 오염 제거" },
];

interface EstimateResponse {
  cleaning_type: string;
  detail_type: string;
  area_range: string | null;
  estimated_amount: number;
  currency: "KRW";
  pricing_basis: string;
  calculation: string;
  is_starting_estimate: boolean;
  message: string;
}

interface EstimateEmailRequest {
  recipient_email: string;
  cleaning_type: string;
  detail_type: string;
  area_range: string | null;
}

interface EstimateEmailResponse {
  message: string;
}

export default function EstimatePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedHousing, setSelectedHousing] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [estimateEmailId, setEstimateEmailId] = useState("");
  const [estimateEmailDomain, setEstimateEmailDomain] = useState("");
  const [selectedEstimateEmailDomain, setSelectedEstimateEmailDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [estimateError, setEstimateError] = useState("");
  const [isSendingEstimateEmail, setIsSendingEstimateEmail] = useState(false);
  const [estimateEmailMessage, setEstimateEmailMessage] = useState("");
  const submitLock = useRef(false);
  const emailSubmitLock = useRef(false);
  const stepTwoOptions = selectedOption === "office"
    ? COMMERCIAL_TYPES
    : selectedOption === "partial"
      ? PARTIAL_CLEANING_TYPES
      : selectedOption === "special"
        ? SPECIAL_CLEANING_TYPES
        : RESIDENTIAL_TYPES;
  const isResidential = selectedOption === "move_in" || selectedOption === "move_out" || selectedOption === "residence";
  const hasAreaStep = isResidential || selectedOption === "office";
  const isFinalStep = step === 3 || (step === 2 && !hasAreaStep);
  const isEstimateComplete = estimate !== null;
  const selectedCleaningLabel = CLEANING_OPTIONS.find((option) => option.id === estimate?.cleaning_type)?.label ?? "-";
  const selectedDetailLabel = [
    ...RESIDENTIAL_TYPES,
    ...COMMERCIAL_TYPES,
    ...PARTIAL_CLEANING_TYPES,
    ...SPECIAL_CLEANING_TYPES,
  ].find((option) => option.id === estimate?.detail_type)?.label ?? "-";
  const selectedAreaLabel = RESIDENTIAL_AREAS.find((area) => area.id === estimate?.area_range)?.label ?? "해당 없음";

  const handleSendEstimateEmail = async () => {
    if (!estimate || emailSubmitLock.current) return;

    const recipientEmail = `${estimateEmailId.trim()}@${estimateEmailDomain.trim()}`.toLowerCase();
    if (!estimateEmailId.trim() || !estimateEmailDomain.trim()) {
      setEstimateEmailMessage("이메일 주소를 입력해 주세요.");
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(recipientEmail)) {
      setEstimateEmailMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    const requestData: EstimateEmailRequest = {
      recipient_email: recipientEmail,
      cleaning_type: estimate.cleaning_type.trim(),
      detail_type: estimate.detail_type.trim(),
      area_range: estimate.area_range?.trim() || null,
    };

    emailSubmitLock.current = true;
    setIsSendingEstimateEmail(true);
    setEstimateEmailMessage("이메일 전송을 요청하고 있습니다...");

    try {
      const response = await fetch("/api/estimate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (!response.ok) {
        setEstimateEmailMessage(
          typeof result.detail === "string" ? result.detail : "이메일 전송 요청에 실패했습니다."
        );
        return;
      }

      const data: EstimateEmailResponse = result;
      setEstimateEmailMessage(data.message);
    } catch (error) {
      console.error("예상 견적 이메일 전송 오류:", error);
      setEstimateEmailMessage("서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSendingEstimateEmail(false);
      emailSubmitLock.current = false;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLock.current || !selectedOption || !selectedHousing || (hasAreaStep && !selectedArea)) return;

    submitLock.current = true;
    setIsSubmitting(true);
    setEstimate(null);
    setEstimateError("");

    const params = new URLSearchParams({
      cleaning_type: selectedOption.trim(),
      detail_type: selectedHousing.trim(),
    });
    if (hasAreaStep && selectedArea) params.set("area_range", selectedArea.trim());

    try {
      const response = await fetch(`/api/estimate?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const result = await response.json();

      if (!response.ok) {
        const detail = result.detail;
        setEstimateError(typeof detail === "string" ? detail : "예상 견적을 불러오지 못했습니다.");
        return;
      }

      setEstimate(result as EstimateResponse);
    } catch (error) {
      console.error("예상 견적 요청 오류:", error);
      setEstimateError("서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-white px-6 py-16 sm:py-20 md:px-12 md:py-24">
      <div className="w-full max-w-[640px] p-0">
        <div className="mb-8 text-center md:text-left">
          <img
            src="/j-cleaning-logo.png"
            alt="제이클리닝"
            className="mb-8 h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            {isEstimateComplete ? "예상 견적 결과" : step === 1 ? "어떤 청소가 필요하신가요?" : step === 2 && isResidential ? "어떤 주거 형태인가요?" : step === 3 ? "몇 평 규모인가요?" : selectedOption === "office" ? "어떤 공간인가요?" : selectedOption === "partial" ? "어느 구역을 청소할까요?" : "어떤 특수 현장인가요?"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEstimateComplete ? "선택하신 조건으로 계산한 간편 예상 견적입니다." : step === 1 ? "원하시는 서비스를 선택해 주세요." : step === 3 ? "청소할 공간의 면적을 선택해 주세요." : "청소할 공간의 형태를 선택해 주세요."}
          </p>
        </div>
        {isEstimateComplete && estimate ? (
          <section aria-live="polite" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <th scope="row" className="w-32 bg-slate-50 px-5 py-4 font-semibold text-slate-600">청소 종류</th>
                    <td className="px-5 py-4 font-medium text-slate-900">{selectedCleaningLabel}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-slate-50 px-5 py-4 font-semibold text-slate-600">공간 / 항목</th>
                    <td className="px-5 py-4 font-medium text-slate-900">{selectedDetailLabel}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-slate-50 px-5 py-4 font-semibold text-slate-600">면적</th>
                    <td className="px-5 py-4 font-medium text-slate-900">{selectedAreaLabel}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-slate-50 px-5 py-4 font-semibold text-slate-600">산정 기준</th>
                    <td className="px-5 py-4 font-medium text-slate-900">{estimate.calculation}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-emerald-50 px-5 py-5 font-bold text-emerald-800">예상 금액</th>
                    <td className="px-5 py-5 text-xl font-extrabold text-emerald-700">
                      {new Intl.NumberFormat("ko-KR").format(estimate.estimated_amount)}원{estimate.is_starting_estimate ? "부터" : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-5 py-4 text-xs leading-relaxed text-slate-500">{estimate.message}</p>
            <div className="border-t border-slate-100 px-5 py-5">
              <p className="mb-2 text-sm font-semibold text-slate-800">
                이메일로 예상 견적 결과 받아보기
              </p>
              <div className="flex w-full items-center gap-2">
                <input
                  id="estimate-email-id"
                  type="text"
                  value={estimateEmailId}
                  onChange={(event) => setEstimateEmailId(event.target.value)}
                  placeholder="아이디 입력"
                  autoCapitalize="none"
                  autoComplete="email"
                  required
                  aria-label="이메일 아이디"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span aria-hidden="true" className="shrink-0 text-sm font-medium text-slate-400">@</span>
                {selectedEstimateEmailDomain === "direct" ? (
                  <input
                    id="estimate-email-domain"
                    type="text"
                    value={estimateEmailDomain}
                    onChange={(event) => setEstimateEmailDomain(event.target.value)}
                    placeholder="도메인 직접 입력"
                    autoCapitalize="none"
                    required
                    aria-label="이메일 도메인 직접 입력"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                ) : (
                  <select
                    id="estimate-email-domain"
                    aria-label="이메일 도메인 선택"
                    value={selectedEstimateEmailDomain}
                    onChange={(event) => {
                      const domain = event.target.value;
                      setSelectedEstimateEmailDomain(domain);
                      setEstimateEmailDomain(domain === "direct" ? "" : domain);
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
              <button
                type="button"
                onClick={handleSendEstimateEmail}
                disabled={isSendingEstimateEmail}
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98]"
              >
                <span>{isSendingEstimateEmail ? "전송 중..." : "메일로 보내기"}</span>
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
              {estimateEmailMessage && (
                <p role="status" className="mt-3 text-sm text-slate-600">
                  {estimateEmailMessage}
                </p>
              )}
            </div>
            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={() => {
                  setEstimate(null);
                  setEstimateError("");
                  setSelectedOption(null);
                  setSelectedHousing(null);
                  setSelectedArea(null);
                  setEstimateEmailId("");
                  setEstimateEmailDomain("");
                  setSelectedEstimateEmailDomain("");
                  setEstimateEmailMessage("");
                  setStep(1);
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span>다른 조건으로 다시 견적 받기</span>
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
            </div>
          </section>
        ) : (
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {step === 1 ? CLEANING_OPTIONS.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button key={option.id} type="button" disabled={isSubmitting} onClick={() => { setSelectedOption(option.id); setSelectedHousing(null); setSelectedArea(null); setEstimate(null); setEstimateError(""); }} className={`group flex flex-col items-start justify-center rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-wait md:p-5 ${isSelected ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50"}`}>
                <div className={`mb-3 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-emerald-300"}`}>
                  <svg className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-transparent"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="mb-1 font-bold text-slate-900 md:text-lg">{option.label}</span>
                <span className="line-clamp-2 text-[11px] leading-tight text-slate-500 md:text-xs">{option.desc}</span>
              </button>
            );
          }) : step === 3 ? RESIDENTIAL_AREAS.map((housing) => {
            const isSelected = selectedArea === housing.id;
            return (
              <button key={housing.id} type="button" disabled={isSubmitting} onClick={() => { setSelectedArea(housing.id); setEstimate(null); setEstimateError(""); }} className={`group flex flex-col items-start justify-center rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-wait md:p-5 ${isSelected ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50"}`}>
                <div className={`mb-3 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-emerald-300"}`}><svg className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-transparent"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                <span className="mb-1 font-bold text-slate-900 md:text-lg">{housing.label}</span>
                <span className="line-clamp-2 text-[11px] leading-tight text-slate-500 md:text-xs">{housing.description}</span>
              </button>
            );
          }) : stepTwoOptions.map((housing) => {
            const isSelected = selectedHousing === housing.id;
            return (
              <button key={housing.id} type="button" disabled={isSubmitting} onClick={() => { setSelectedHousing(housing.id); setEstimate(null); setEstimateError(""); }} className={`group flex flex-col items-start justify-center rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-wait md:p-5 ${isSelected ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50"}`}>
                <div className={`mb-3 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-emerald-300"}`}>
                  <svg className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-transparent"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="mb-1 font-bold text-slate-900 md:text-lg">{housing.label}</span>
                <span className="line-clamp-2 text-[11px] leading-tight text-slate-500 md:text-xs">{housing.description}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={step === 1 || isSubmitting}
            onClick={() => { setEstimate(null); setEstimateError(""); setStep(step === 3 ? 2 : 1); }}
            className="group flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
          >
            <svg
              className="h-5 w-5 rotate-180 transition-transform duration-200 group-hover:-translate-x-1"
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
            <span>이전</span>
          </button>

          <button
            type={isFinalStep ? "submit" : "button"}
            onClick={() => { if (!isFinalStep) { setEstimate(null); setEstimateError(""); if (step === 1) setStep(2); else if (step === 2 && hasAreaStep) setStep(3); } }}
            disabled={isSubmitting || (step === 1 ? !selectedOption : step === 2 ? !selectedHousing : !selectedArea)}
            className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <span>{isSubmitting ? "견적 계산 중..." : isFinalStep ? "예상 견적 받아보기" : "다음"}</span>
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
        </div>
        {estimateError && <p role="alert" className="mt-5 text-sm font-medium text-rose-600">{estimateError}</p>}
        </form>
        )}
      </div>
    </main>
  );
}
