import { Container } from "@/components/container";
import { CartClient } from "@/components/cart-client";

export const metadata = {
  title: "Carrinho",
};

export default function CartPage() {
  return (
    <Container className="py-10 sm:py-14">
      <CartClient />
    </Container>
  );
}

