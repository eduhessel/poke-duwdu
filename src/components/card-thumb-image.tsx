"use client";

import { useMemo, useState } from "react";

export function CardThumbImage({
  primarySrc,
  fallbackSrc,
  alt,
  objectFit = "cover",
}: {
  primarySrc: string | null;
  fallbackSrc: string | null;
  alt: string;
  /** `contain` mostra a carta inteira (melhor em thumbs grandes). */
  objectFit?: "cover" | "contain";
}) {
  const initial = useMemo(
    () => primarySrc ?? fallbackSrc ?? null,
    [fallbackSrc, primarySrc]
  );
  const [src, setSrc] = useState<string | null>(initial);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={
        objectFit === "contain"
          ? "absolute inset-0 h-full w-full object-contain"
          : "absolute inset-0 h-full w-full object-cover"
      }
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

