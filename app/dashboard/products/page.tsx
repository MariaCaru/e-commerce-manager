import { getProducts } from "@/app/actions/productActions";
import ProductsClient from "./ProductsClient";

/**
 * Este é um Server Component. 
 * Ele busca os dados do Prisma diretamente no servidor antes de renderizar a página.
 */
export default async function ProductsPage() {
    // Busca a lista de produtos do banco de dados (dev.db)
    const products = await getProducts();

    // Passamos os produtos para o componente de cliente que gerencia a interface
    return (
        <ProductsClient initialProducts={products} />
    );
}