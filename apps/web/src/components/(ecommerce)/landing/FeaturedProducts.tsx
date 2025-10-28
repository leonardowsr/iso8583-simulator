"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { FeaturedProductsQuery as FeaturedProductsQueryType } from "@/__generated_ecommerce__/FeaturedProductsQuery.graphql";
import type { Product } from "@/_types/product";
import ProductCard from "@/components/(ecommerce)/products/product";
import { Button } from "@/components/ui/button";
import { PRODUCTS_LIST } from "@/constants/products";

const FeaturedProductsQuery = graphql`
	query FeaturedProductsQuery {
		products(first: 4) {
			edges {
				node {
					...product_product
				}
			}
		}
	}`;

export function FeaturedProducts() {
	const data = useLazyLoadQuery<FeaturedProductsQueryType>(
		FeaturedProductsQuery,
		{},
	);

	if (!data?.products.edges.length) {
		return <div>Nenhum produto em destaque encontrado.</div>;
	}

	const featuredProducts = data.products.edges;

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
					{featuredProducts.map(({ node }, i) => (
						<ProductCard key={i} product={node} />
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
