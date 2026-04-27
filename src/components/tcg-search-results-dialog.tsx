"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardThumbImage } from "@/components/card-thumb-image";

export type TcgSearchResultRow = {
  id: string;
  name: string;
  localId: string | number | null;
  primaryImage: string | null;
  fallbackImage: string | null;
  set: { id: string; name: string | null } | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryLabel: string;
  results: TcgSearchResultRow[];
  onSelectCard: (id: string) => void;
};

export function TcgSearchResultsDialog({
  open,
  onOpenChange,
  queryLabel,
  results,
  onSelectCard,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,920px)] w-[min(100vw-1rem,52rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        <DialogHeader className="shrink-0 space-y-1 border-b border-border px-4 py-4 pr-12 text-left sm:px-6">
          <DialogTitle>Resultados da busca</DialogTitle>
          <DialogDescription>
            {results.length} carta{results.length === 1 ? "" : "s"} para “{queryLabel}”
            — clique na carta desejada para preencher o ID.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[min(70vh,680px)] px-3 pb-4 sm:px-6">
          <div className="grid gap-3 py-2 sm:grid-cols-2">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelectCard(r.id);
                  onOpenChange(false);
                }}
                className="text-left"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-background/40 transition-colors hover:bg-muted/50">
                  <div className="flex gap-3 p-3 sm:gap-4">
                    <div
                      className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border sm:w-32"
                      style={{ aspectRatio: "63 / 88" }}
                    >
                      {r.primaryImage || r.fallbackImage ? (
                        <CardThumbImage
                          primarySrc={r.primaryImage}
                          fallbackSrc={r.fallbackImage}
                          alt={r.name}
                          objectFit="contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-muted-foreground">
                          sem imagem
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                      <p className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                        {r.name}
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {r.set?.name
                          ? r.set.name
                          : r.set?.id
                            ? r.set.id
                            : "Set desconhecido"}
                        {r.localId !== null
                          ? ` • Nº ${String(r.localId)}`
                          : ""}
                      </p>
                      <Badge variant="outline" className="w-fit text-xs">
                        {r.set?.id ?? "—"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
