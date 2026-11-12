"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/prices", label: "ราคายา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-sea-100 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Seabreeze Pharma" width={40} height={40} priority />
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-ocean">Seabreeze</span>{" "}
            <span className="text-mint">Pharma</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-sea-100 text-sea-800"
                    : "text-sea-700 hover:bg-sea-50 hover:text-sea-900"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-lg p-2 text-sea-800 hover:bg-sea-50 sm:hidden"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <ul className="border-t border-sea-100 bg-white px-4 py-2 sm:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 font-medium ${
                  isActive(l.href) ? "bg-sea-100 text-sea-800" : "text-sea-700"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
