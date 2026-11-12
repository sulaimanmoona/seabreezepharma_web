import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MessageCircleHeart, Search, ShieldPlus } from "lucide-react";
import Wave from "@/components/Wave";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { site } from "@/lib/site";

const highlights = [
  {
    icon: BadgeCheck,
    title: "เภสัชกรประจำร้าน",
    text: "ให้คำปรึกษาเรื่องยาโดยเภสัชกรที่มีใบอนุญาตประกอบวิชาชีพ",
  },
  {
    icon: ShieldPlus,
    title: "ยาคุณภาพ ได้มาตรฐาน",
    text: "ยาทุกรายการมีทะเบียนตำรับยา เก็บรักษาอย่างถูกวิธี",
  },
  {
    icon: MessageCircleHeart,
    title: "ปรึกษาฟรีทุกช่องทาง",
    text: "สอบถามได้ทั้งที่ร้าน โทรศัพท์ และ LINE Official",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ocean-gradient relative text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-14 md:grid-cols-[1.3fr_1fr] md:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-mint-light" /> เปิดทุกวัน {site.hours[0].time}
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              สุขภาพดี สดชื่น
              <br />
              <span className="text-sea-100">เหมือนสายลมทะเล</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg font-light leading-relaxed text-white/90">
              {site.nameTh} — {site.tagline} พร้อมความรู้เรื่องการใช้ยาที่ถูกต้องและปลอดภัย
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/prices"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ocean shadow-lg shadow-sea-950/20 transition hover:bg-sea-50"
              >
                <Search size={18} /> ค้นหาราคายา
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-xs md:block">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" />
            <div className="relative rounded-[2.5rem] bg-white/95 p-10 shadow-2xl shadow-sea-950/30">
              <Image src="/logo.png" alt="โลโก้ Seabreeze Pharma" width={320} height={320} priority />
            </div>
          </div>
        </div>
        <Wave className="text-sand" animated />
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-sea-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-ocean to-mint text-white">
                <Icon size={24} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-sea-800/80">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-sea-600">รู้ไว้ ใช้ยาปลอดภัย</p>
            <h2 className="text-2xl font-bold sm:text-3xl">บทความเกี่ยวกับการใช้ยา</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
