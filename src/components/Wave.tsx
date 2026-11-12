type WaveProps = {
  /** Tailwind text-* class; the wave is filled with currentColor */
  className?: string;
  flip?: boolean;
  animated?: boolean;
};

const PATH =
  "M0,40 C180,90 360,0 540,30 C720,60 900,95 1080,55 C1260,15 1350,25 1440,40 L1440,100 L0,100 Z";

/** Decorative wave divider echoing the wave in the logo. */
export default function Wave({ className = "text-sand", flip, animated }: WaveProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative h-12 w-full overflow-hidden sm:h-20 ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <div className={`absolute inset-0 flex w-[200%] ${animated ? "animate-wave" : ""}`}>
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="h-full w-1/2"
          >
            <path d={PATH} fill="currentColor" />
          </svg>
        ))}
      </div>
    </div>
  );
}
