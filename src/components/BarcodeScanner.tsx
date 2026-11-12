"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOff, Flashlight, FlashlightOff, X } from "lucide-react";

// ชนิดบาร์โค้ดที่พบบนสินค้าในร้าน (EAN/UPC ของสินค้า + Code128/39/ITF ของฉลากที่ร้านพิมพ์เอง)
const FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf", "codabar"];

type Detector = { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> };
type NativeDetectorClass = {
  new (options?: { formats: string[] }): Detector;
  getSupportedFormats(): Promise<string[]>;
};

/** ใช้ตัวอ่านบาร์โค้ดของเบราว์เซอร์ถ้ามี (Chrome Android) ไม่งั้นโหลดตัวอ่าน ZXing (iPhone/Safari ฯลฯ) */
async function createDetector(): Promise<Detector> {
  const Native = (globalThis as { BarcodeDetector?: NativeDetectorClass }).BarcodeDetector;
  if (Native) {
    try {
      const supported = await Native.getSupportedFormats();
      const formats = FORMATS.filter((f) => supported.includes(f));
      if (formats.includes("ean_13")) return new Native({ formats });
    } catch {
      // ใช้ตัวสำรองด้านล่าง
    }
  }
  const { BarcodeDetector, prepareZXingModule } = await import("barcode-detector/ponyfill");
  prepareZXingModule({
    overrides: {
      locateFile: (file: string, prefix: string) =>
        file.endsWith(".wasm") ? `/zxing/${file}` : prefix + file,
    },
  });
  return new BarcodeDetector({ formats: FORMATS as never });
}

function cameraErrorMessage(error: unknown) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการใช้กล้องในการตั้งค่าเบราว์เซอร์ แล้วลองใหม่";
  if (name === "NotFoundError" || name === "OverconstrainedError")
    return "ไม่พบกล้องบนอุปกรณ์นี้";
  if (name === "NotReadableError") return "กล้องถูกใช้งานโดยแอปอื่นอยู่ กรุณาปิดแอปนั้นแล้วลองใหม่";
  return "ไม่สามารถเปิดกล้องได้";
}

/** มีกล้องให้ใช้ไหม (ต้องเป็น https หรือ localhost) */
export function canUseCamera() {
  return (
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    window.isSecureContext &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

export default function BarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "error">("starting");
  const [error, setError] = useState("");
  const [torch, setTorch] = useState<{ track: MediaStreamTrack; on: boolean } | null>(null);

  // ส่งค่าล่าสุดเข้า effect โดยไม่ต้องเปิดกล้องใหม่ทุกครั้งที่ parent render
  const onDetectedRef = useRef(onDetected);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onDetectedRef.current = onDetected;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    let stopped = false;
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };

    (async () => {
      try {
        const [media, detector] = await Promise.all([
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          }),
          createDetector(),
        ]);
        stream = media;
        if (stopped) return stop();

        const video = videoRef.current!;
        video.srcObject = media;
        await video.play();
        if (stopped) return;
        setStatus("scanning");

        // ไฟฉาย (มีเฉพาะมือถือบางรุ่น)
        const track = media.getVideoTracks()[0];
        const caps = track?.getCapabilities?.() as { torch?: boolean } | undefined;
        if (caps?.torch) setTorch({ track, on: false });

        const scan = async () => {
          if (stopped) return;
          try {
            if (video.readyState >= 2) {
              const [hit] = await detector.detect(video);
              const code = hit?.rawValue?.trim();
              if (code && !stopped) {
                navigator.vibrate?.(80);
                stop();
                onDetectedRef.current(code);
                return;
              }
            }
          } catch {
            // เฟรมที่อ่านไม่ได้ ข้ามไปเฟรมถัดไป
          }
          timer = setTimeout(scan, 120);
        };
        scan();
      } catch (e) {
        if (stopped) return;
        stop();
        setError(
          e instanceof DOMException ? cameraErrorMessage(e) : "โหลดตัวอ่านบาร์โค้ดไม่สำเร็จ กรุณาลองใหม่",
        );
        setStatus("error");
      }
    })();

    return stop;
  }, []);

  // ปิดด้วยปุ่ม Esc และล็อกการเลื่อนหน้าขณะเปิดกล้อง
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  async function toggleTorch() {
    if (!torch) return;
    const on = !torch.on;
    try {
      await torch.track.applyConstraints({ advanced: [{ torch: on } as MediaTrackConstraintSet] });
      setTorch({ ...torch, on });
    } catch {
      setTorch(null);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="สแกนบาร์โค้ดด้วยกล้อง"
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-medium">สแกนบาร์โค้ด</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิดกล้อง"
          className="rounded-full p-2 hover:bg-white/10"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />

        {status !== "error" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* กรอบเล็ง */}
            <div className="relative h-40 w-[80%] max-w-md rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
              <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-2xl border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-2xl border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-2xl border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-2xl border-b-4 border-r-4 border-white" />
              {status === "scanning" && (
                <span className="absolute inset-x-4 top-1/2 h-0.5 animate-pulse bg-red-500" />
              )}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <CameraOff size={48} className="text-white/70" />
            <p>{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white px-5 py-2 font-medium text-black"
            >
              ปิด
            </button>
          </div>
        )}
      </div>

      <div className="flex min-h-24 flex-col items-center justify-center gap-3 px-4 py-4 text-center text-sm text-white/80">
        {status === "starting" && <p>กำลังเปิดกล้อง…</p>}
        {status === "scanning" && <p>เล็งบาร์โค้ดให้อยู่ในกรอบ ระบบจะค้นหาให้อัตโนมัติ</p>}
        {torch && status === "scanning" && (
          <button
            type="button"
            onClick={toggleTorch}
            className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 hover:bg-white/25"
          >
            {torch.on ? <FlashlightOff size={18} /> : <Flashlight size={18} />}
            {torch.on ? "ปิดไฟฉาย" : "เปิดไฟฉาย"}
          </button>
        )}
      </div>
    </div>
  );
}
