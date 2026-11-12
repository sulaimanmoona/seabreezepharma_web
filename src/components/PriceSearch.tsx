"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Barcode,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  ScanBarcode,
  Search,
  X,
} from "lucide-react";
import BarcodeScanner, { canUseCamera } from "./BarcodeScanner";

const noSubscribe = () => () => {};

type Product = {
  id: string;
  name: string;
  unit: string;
  barcode: string;
  price: number | null;
};

type Result = { items: Product[]; total: number; page: number; pageSize: number };

const priceFormat = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(price: number | null) {
  return price == null ? "-" : `฿${priceFormat.format(price)}`;
}

export default function PriceSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlPage = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

  const [input, setInput] = useState(urlQuery);
  const [retry, setRetry] = useState(0);
  // Result of the most recent completed request, tagged with the request key.
  const [fetched, setFetched] = useState<{
    key: string;
    data: Result | null;
    error: string | null;
  } | null>(null);

  const requestKey = `${urlQuery}|${urlPage}|${retry}`;
  const loading = fetched?.key !== requestKey;
  const data = fetched?.data ?? null; // keep previous results visible while loading
  const error = loading ? null : (fetched?.error ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ปุ่มกล้องแสดงเฉพาะเครื่องที่ใช้กล้องได้ (false ตอน render ฝั่ง server)
  const cameraAvailable = useSyncExternalStore(noSubscribe, canUseCamera, () => false);
  const [scanning, setScanning] = useState(false);

  function updateUrl(q: string, page = 1) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounce typing → update the URL (which triggers the fetch below)
  useEffect(() => {
    if (input.trim() === urlQuery) return;
    const t = setTimeout(() => updateUrl(input), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Fetch whenever the URL query/page changes
  useEffect(() => {
    const controller = new AbortController();
    const key = requestKey;
    const params = new URLSearchParams({ q: urlQuery, page: String(urlPage) });
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then(async (res) => {
        const json = (await res.json().catch(() => ({}))) as Partial<Result> & {
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "เกิดข้อผิดพลาด");
        setFetched({ key, data: json as Result, error: null });
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setFetched((prev) => ({
          key,
          data: prev?.data ?? null,
          error: e.message || "เกิดข้อผิดพลาด",
        }));
      });
    return () => controller.abort();
  }, [requestKey, urlQuery, urlPage]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      {/* Search box — Enter submits immediately so USB barcode scanners work */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          updateUrl(input);
          inputRef.current?.select();
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sea-500" size={22} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="search"
          inputMode="search"
          autoFocus
          placeholder="พิมพ์ชื่อยา หรือสแกน / พิมพ์บาร์โค้ด"
          aria-label="ค้นหาชื่อยาหรือบาร์โค้ด"
          className={`h-14 w-full rounded-2xl border-2 border-sea-200 bg-white pl-12 ${cameraAvailable ? "pr-40" : "pr-28"} text-lg shadow-sm outline-none transition placeholder:text-sea-400 focus:border-sea-500 focus:ring-4 focus:ring-sea-200/60 [&::-webkit-search-cancel-button]:hidden`}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {input && (
            <button
              type="button"
              aria-label="ล้างคำค้นหา"
              onClick={() => {
                setInput("");
                updateUrl("");
                inputRef.current?.focus();
              }}
              className="rounded-full p-2 text-sea-500 hover:bg-sea-50"
            >
              <X size={18} />
            </button>
          )}
          {cameraAvailable && (
            <button
              type="button"
              aria-label="สแกนบาร์โค้ดด้วยกล้อง"
              title="สแกนบาร์โค้ดด้วยกล้อง"
              onClick={() => setScanning(true)}
              className="rounded-xl border-2 border-sea-200 p-1.5 text-ocean hover:bg-sea-50"
            >
              <ScanBarcode size={24} />
            </button>
          )}
          <button
            type="submit"
            className="rounded-xl bg-linear-to-r from-ocean to-sea-500 px-4 py-2 font-medium text-white hover:opacity-90"
          >
            ค้นหา
          </button>
        </div>
      </form>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-sea-600">
        <Barcode size={16} className="shrink-0" />
        {cameraAvailable
          ? "กดปุ่มกล้องเพื่อสแกนบาร์โค้ดบนกล่องยา หรือใช้เครื่องสแกนบาร์โค้ดได้เลย"
          : "รองรับเครื่องสแกนบาร์โค้ด — สแกนได้ทันทีเมื่อเคอร์เซอร์อยู่ในช่องค้นหา"}
      </p>

      {scanning && (
        <BarcodeScanner
          onClose={() => setScanning(false)}
          onDetected={(code) => {
            setScanning(false);
            setInput(code);
            updateUrl(code);
          }}
        />
      )}

      {/* Summary */}
      <div className="mt-6 flex min-h-6 items-center justify-between text-sm text-sea-700">
        {data && !error && (
          <span>
            {urlQuery ? (
              <>
                ผลการค้นหา “<strong>{urlQuery}</strong>” พบ{" "}
              </>
            ) : (
              <>รายการยาทั้งหมด </>
            )}
            <strong>{data.total.toLocaleString("th-TH")}</strong> รายการ
          </span>
        )}
      </div>

      {/* States */}
      {error ? (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <button onClick={() => setRetry((n) => n + 1)} className="mt-1 text-sm underline">
              ลองใหม่
            </button>
          </div>
        </div>
      ) : loading && !data ? (
        <SkeletonList />
      ) : data && data.items.length === 0 ? (
        <div className="mt-3 flex flex-col items-center rounded-2xl border border-dashed border-sea-200 bg-white py-14 text-center">
          <PackageSearch size={44} className="text-sea-300" />
          <p className="mt-3 font-medium text-sea-800">ไม่พบข้อมูลยาที่ค้นหา</p>
          <p className="text-sm text-sea-600">ลองค้นหาด้วยชื่ออื่น หรือสอบถามเภสัชกรของเรา</p>
        </div>
      ) : data ? (
        <div className={`mt-3 transition-opacity ${loading ? "opacity-50" : ""}`}>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-sm md:block">
            <table className="w-full text-left">
              <thead className="bg-sea-50 text-sm text-sea-700">
                <tr>
                  <th className="px-5 py-3 font-medium">บาร์โค้ด</th>
                  <th className="px-5 py-3 font-medium">ชื่อยา</th>
                  <th className="px-5 py-3 font-medium">หน่วย</th>
                  <th className="px-5 py-3 text-right font-medium">ราคา</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sea-50">
                {data.items.map((p) => (
                  <tr key={p.id} className="hover:bg-sea-50/50">
                    <td className="px-5 py-3 font-mono text-sm text-sea-600">{p.barcode || "-"}</td>
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-sea-700">{p.unit || "-"}</td>
                    <td className="px-5 py-3 text-right text-lg font-semibold text-mint">
                      {formatPrice(p.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {data.items.map((p) => (
              <li key={p.id} className="rounded-2xl border border-sea-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium leading-snug">{p.name}</p>
                  <p className="shrink-0 text-lg font-semibold text-mint">{formatPrice(p.price)}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-sea-600">
                  <span className="flex items-center gap-1 font-mono">
                    <Barcode size={14} /> {p.barcode || "-"}
                  </span>
                  <span>ต่อ{p.unit || "หน่วย"}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-3" aria-label="เปลี่ยนหน้า">
              <button
                disabled={urlPage <= 1}
                onClick={() => updateUrl(urlQuery, urlPage - 1)}
                className="flex items-center gap-1 rounded-full border border-sea-200 bg-white px-4 py-2 text-sm text-sea-700 hover:bg-sea-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} /> ก่อนหน้า
              </button>
              <span className="text-sm text-sea-700">
                หน้า {urlPage} / {totalPages}
              </span>
              <button
                disabled={urlPage >= totalPages}
                onClick={() => updateUrl(urlQuery, urlPage + 1)}
                className="flex items-center gap-1 rounded-full border border-sea-200 bg-white px-4 py-2 text-sm text-sea-700 hover:bg-sea-50 disabled:opacity-40"
              >
                ถัดไป <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      ) : null}

      <p className="mt-6 text-xs text-sea-600">
        * ราคาอาจมีการเปลี่ยนแปลง กรุณาสอบถามที่ร้านเพื่อยืนยันราคาล่าสุด
      </p>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="mt-3 space-y-3" aria-label="กำลังโหลด">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-sea-100/70" />
      ))}
    </div>
  );
}
