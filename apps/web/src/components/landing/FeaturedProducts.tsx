import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/products/product";
import { Button } from "@/components/ui/button";
import { PRODUCTS_LIST } from "@/constants/products";

export function FeaturedProducts() {
	// Pegar alguns produtos para destacar na página inicial
	const featuredProducts = PRODUCTS_LIST.slice(0, 4);

	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h2 className="mb-4 font-bold text-3xl text-slate-900 dark:text-slate-100">
						Produtos em Destaque
					</h2>
					<p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
						Confira alguns dos nossos produtos mais populares e amados pelos
						clientes.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{featuredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				<div className="mt-12 text-center">
					<Button asChild size="lg" variant="outline">
						<Link href="/products">
							Ver Todos os Produtos
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
