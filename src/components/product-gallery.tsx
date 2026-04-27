"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const normalized = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = normalized[activeIndex] ?? null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted ring-1 ring-border">
        {active ? (
          <Image
            src={active}
            alt={`${name} (foto real)`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem imagens
          </div>
        )}
      </div>

      {normalized.length > 1 ? (
        <div className="flex gap-2 overflow-auto pb-1">
          {normalized.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted ring-1",
                idx === activeIndex
                  ? "ring-accent"
                  : "ring-border hover:ring-muted-foreground/40"
              )}
              aria-label={`Ver imagem ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${name} miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

