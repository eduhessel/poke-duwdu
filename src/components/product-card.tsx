import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatBrl } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const heroImage = product.customImages[0] ?? null;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <Card className="overflow-hidden rounded-3xl bg-card ring-border transition group-hover:-translate-y-0.5 group-hover:bg-card-strong group-hover:ring-foreground/20">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-90" />

          <div className="absolute left-3 top-3">
            <Badge
              variant="outline"
              className="rounded-full bg-background/40 text-[11px] font-semibold"
            >
              {product.condition}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge className="rounded-full text-[11px] font-semibold">
              {formatBrl(product.price)}
            </Badge>
          </div>
        </div>
        <CardContent className="px-4">
          <p className="truncate text-sm font-semibold text-foreground">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ver detalhes e referência oficial →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

