import { Container } from "@/components/container";
import { RegisterClient } from "@/components/register-client";

export const metadata = {
  title: "Cadastrar",
};

export default function RegisterPage() {
  return (
    <Container className="py-10 sm:py-14">
      <RegisterClient />
    </Container>
  );
}

