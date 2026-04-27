import { cn } from "@/lib/utils";

const OFFICIAL_ART_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const GEN1_IDS = Array.from({ length: 151 }, (_, i) => i + 1);

/** Mosaico decorativo com a Pokédex nacional 1–151 (Kanto). */
export function Gen1HeroCollage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid h-full w-full auto-rows-fr grid-cols-11 gap-px bg-slate-300/40 p-1 dark:bg-slate-600/35",
        className,
      )}
      aria-hidden
    >
      {GEN1_IDS.map((id) => (
        <div
          key={id}
          className="flex min-h-0 min-w-0 items-center justify-center rounded-[2px] bg-white/95 dark:bg-slate-900/70"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- muitas URLs externas; lazy nativo */}
          <img
            src={`${OFFICIAL_ART_BASE}/${id}.png`}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="max-h-[92%] max-w-[92%] object-contain"
          />
        </div>
      ))}
    </div>
  );
}
