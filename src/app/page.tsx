import { Container } from "@/components/container";
import { ProductSearchGrid } from "@/components/product-search-grid";
import { getProducts } from "@/data/products";
import { isTcgPocketProduct } from "@/lib/tcgPocket";

export default function Home() {
  const products = getProducts().filter((p) => !isTcgPocketProduct(p));

  return (
    <Container className="py-10 sm:py-14">
      <ProductSearchGrid products={products} />
    </Container>
  );
}
