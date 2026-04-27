import { useId } from "react";
import { cn } from "@/lib/utils";

/** Master Ball estilizada (SVG) para marca no header — cores próximas ao jogo. */
export function MasterBallIcon({ className }: { className?: string }) {
  const rawId = useId();
  const clipId = rawId.replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="16" cy="16" r="13.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="2" y="2" width="28" height="13" fill="#4C1D95" />
        <rect x="2" y="15" width="28" height="15" fill="#FAFAFA" />
        <rect x="2" y="13" width="28" height="6" fill="#171717" />
        <circle cx="7" cy="16" r="3.25" fill="#F0ABFC" />
        <circle cx="25" cy="16" r="3.25" fill="#F0ABFC" />
        <circle cx="16" cy="16" r="5.25" fill="#171717" />
        <circle cx="16" cy="16" r="4.25" fill="#FAFAFA" />
        <circle cx="16" cy="16" r="2.35" fill="#C084FC" />
        <path
          d="M14.15 15.15h.55l.85 1.35.85-1.35h.55v2.7h-.45v-2.05l-.75 1.15h-.4l-.75-1.15v2.05h-.45v-2.7Z"
          fill="#FAFAFA"
        />
      </g>
      <circle
        cx="16"
        cy="16"
        r="13.5"
        className="stroke-border"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
