import { Container } from "@/components/container";

export default function LoadingProduct() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-100" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 w-40 animate-pulse rounded-full bg-zinc-100" />
          <div className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100" />
        </div>
      </div>
    </Container>
  );
}

