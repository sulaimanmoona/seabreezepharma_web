import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import Wave from "./Wave";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <Wave className="text-sea-900" />
      <div className="bg-sea-900 text-sea-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={36} height={36} />
              <span className="text-lg font-semibold text-white">{site.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-sea-200">{site.tagline}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-sea-300" />
              <span>{site.address}</span>
            </p>
            <p className="flex gap-2">
              <Phone size={18} className="shrink-0 text-sea-300" />
              <a href={`tel:${site.phone.replace(/-/g, "")}`} className="hover:text-white">
                {site.phone}
              </a>
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {site.hours.map((h) => (
              <p key={h.days} className="flex gap-2">
                <Clock size={18} className="mt-0.5 shrink-0 text-sea-300" />
                <span>
                  {h.days}: {h.time}
                </span>
              </p>
            ))}
            <nav className="flex gap-4 pt-2">
              <Link href="/prices" className="hover:text-white">ราคายา</Link>
              <Link href="/contact" className="hover:text-white">ติดต่อเรา</Link>
            </nav>
          </div>
        </div>
        <p className="border-t border-sea-800 py-4 text-center text-xs text-sea-300">
          © {site.name}. ข้อมูลบนเว็บไซต์เพื่อความรู้เบื้องต้น ควรปรึกษาเภสัชกรก่อนใช้ยา
        </p>
      </div>
    </footer>
  );
}
