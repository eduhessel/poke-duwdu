import Link from "next/link";
import { Container } from "@/components/container";

export default function HowToBuyPage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl space-y-5 rounded-3xl bg-card p-6 ring-1 ring-border sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">
          Ajuda
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Como comprar na Poke Duwdu
        </h1>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Escolha as cartas e adicione no carrinho.</li>
          <li>Clique em “Finalizar via WhatsApp”.</li>
          <li>Envie a mensagem automática e combinamos tudo por lá.</li>
          <li>
            Faça o pagamento via Pix e envie o comprovante no WhatsApp.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Pronto para ver as cartas disponíveis?{" "}
          <Link href="/" className="font-semibold text-foreground underline">
            Voltar para a Home
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}

