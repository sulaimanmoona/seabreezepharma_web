import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import Wave from "@/components/Wave";
import { site } from "@/lib/site";

function Facebook({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ที่อยู่ เบอร์โทร และช่องทางติดต่อร้านยา Seabreeze Pharma",
};

const tel = (n: string) => `tel:${n.replace(/-/g, "")}`;

const channels = [
  { icon: Phone, label: "โทรศัพท์ร้าน", value: site.phone, href: tel(site.phone) },
  { icon: Smartphone, label: "มือถือ", value: site.mobile, href: tel(site.mobile) },
  { icon: MessageCircle, label: "LINE Official", value: site.line.id, href: site.line.url, external: true },
  { icon: Facebook, label: "Facebook", value: site.facebook.name, href: site.facebook.url, external: true },
  { icon: Mail, label: "อีเมล", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-ocean-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-10">
          <h1 className="text-3xl font-bold sm:text-4xl">ติดต่อเรา</h1>
          <p className="mt-2 font-light text-white/90">
            สอบถามเรื่องยา ปรึกษาเภสัชกร หรือสั่งจองยาล่วงหน้า ยินดีให้บริการค่ะ
          </p>
        </div>
        <Wave className="text-sand" />
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {/* Address */}
          <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="text-ocean" /> ที่อยู่ร้าน
            </h2>
            <p className="mt-1 font-medium text-sea-900">{site.nameTh}</p>
            <p className="mt-1 leading-relaxed text-sea-800/85">{site.address}</p>
          </div>

          {/* Hours */}
          <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="text-mint" /> เวลาทำการ
            </h2>
            <dl className="mt-3 divide-y divide-sea-50">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 py-2 text-sm">
                  <dt className="text-sea-700">{h.days}</dt>
                  <dd className="font-medium">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Channels */}
          <div className="grid gap-3 sm:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-3 rounded-2xl border border-sea-100 bg-white p-4 shadow-sm transition hover:border-sea-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-ocean to-mint text-white">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-sea-600">{label}</span>
                  <span className="block truncate font-medium text-sea-900 group-hover:text-ocean">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="min-h-80 overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-sm">
          <iframe
            title="แผนที่ร้าน Seabreeze Pharma"
            src={site.mapEmbedUrl}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
