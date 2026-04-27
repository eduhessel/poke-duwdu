"use client";

import { useMemo, useState } from "react";

type Props = {
  primarySrc: string | null;
  fallbackSrc: string | null;
  alt: string;
  className?: string;
};

export function OfficialCardImage({
  primarySrc,
  fallbackSrc,
  alt,
  className,
}: Props) {
  const initial = useMemo(() => primarySrc ?? fallbackSrc ?? null, [fallbackSrc, primarySrc]);
  const [src, setSrc] = useState<string | null>(initial);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
        Sem imagem
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
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

