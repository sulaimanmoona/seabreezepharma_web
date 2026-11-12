import type { Metadata } from "next";
import { Suspense } from "react";
import Wave from "@/components/Wave";
import PriceSearch, { SkeletonList } from "@/components/PriceSearch";

export const metadata: Metadata = {
  title: "ราคายา",
  description: "ค้นหาราคายาด้วยชื่อยาหรือบาร์โค้ด ที่ร้าน Seabreeze Pharma",
};

export default function PricesPage() {
  return (
    <>
      <section className="bg-ocean-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 pb-4 pt-10">
          <h1 className="text-3xl font-bold sm:text-4xl">ค้นหาราคายา</h1>
          <p className="mt-2 font-light text-white/90">
            ค้นหาด้วยชื่อยา (ไทย/อังกฤษ) หรือบาร์โค้ดบนกล่องยา
          </p>
        </div>
        <Wave className="text-sand" />
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16 pt-4">
        <Suspense fallback={<SkeletonList />}>
          <PriceSearch />
        </Suspense>
      </div>
    </>
  );
}
