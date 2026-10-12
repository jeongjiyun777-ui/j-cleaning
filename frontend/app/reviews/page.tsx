import Image from "next/image";
import ReviewGallery from "./ReviewGallery";

export default function ReviewsPage() {
  return (
    <main className="min-h-[65vh] w-full bg-slate-50 px-6 py-16 md:px-12 md:py-24">
      <section className="mx-auto w-full max-w-6xl">
        <div className="text-left">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <Image
              src="/j-cleaning-logo.png"
              alt="제이클리닝"
              width={2172}
              height={724}
              priority
              className="h-auto w-24 sm:w-36"
            />
            <span aria-hidden="true" className="h-8 w-px bg-emerald-200" />
            <h1 className="whitespace-nowrap text-3xl font-semibold tracking-[-0.045em] text-slate-800 sm:text-4xl">
              시공 후기
            </h1>
          </div>
          <div className="mt-4 flex items-center justify-start gap-2 text-sm font-medium leading-6 tracking-[-0.02em] text-slate-500 sm:text-base">
            <span aria-hidden="true" className="h-px w-5 bg-emerald-500" />
            제이클리닝이 정성껏 작업한 공간을 둘러보세요.
            <span aria-hidden="true" className="h-px w-5 bg-emerald-500" />
          </div>
        </div>

        <ReviewGallery />
      </section>
    </main>
  );
}
