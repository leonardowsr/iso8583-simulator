"use client";
import { CircleCheck, HeartIcon, ShoppingCartIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { graphql, type PreloadedQuery, usePreloadedQuery } from "react-relay";
import pageProductDetailsQuery, {
	type pageProductDetailsQuery as PageProductDetailsQueryType,
} from "@/__generated_ecommerce__/pageProductDetailsQuery.graphql";
import { Button } from "@/components/ui/button";
import { PRODUCTS_LIST } from "@/constants/products";
import { useCartStore } from "@/lib/store/use-cart-store";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";

interface ProductDetailProps {
	queryRefs: {
		pageProductDetailsQuery: PreloadedQuery<PageProductDetailsQueryType>;
	};
}
export default function ProductDetail({ queryRefs }: ProductDetailProps) {
	const data = usePreloadedQuery(
		pageProductDetailsQuery,
		queryRefs.pageProductDetailsQuery,
	);
	const product = data.productBySlug;
	const [imageIndex, setImageIndex] = useState(0);
	const cartStore = useCartStore((s) => s);
	const router = useRouter();

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:max-w-7xl lg:px-8">
			<div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
				<div>
					<figure className="mx-auto flex shrink-0 flex-row">
						<div className="mt-4 flex flex-col justify-start gap-2 space-x-2">
							{product.images.map((imgSrc, idx) => (
								<button
									key={idx}
									onClick={() => setImageIndex(idx)}
									className={`h-16 w-16 rounded-md border-2 ${
										idx === imageIndex
											? "border opacity-10"
											: "border-transparent"
									}`}
									type="button"
								>
									<Image
										src={imgSrc}
										alt={product.name}
										width={100}
										height={100}
										className="h-full w-full rounded-md object-cover"
										unoptimized
									/>
								</button>
							))}
						</div>
						{product.images && product.images.length > 0 && (
							<Image
								src={product.images[imageIndex]}
								alt={product.name}
								width={600}
								height={400}
								className="w-full overflow-hidden rounded-lg"
								unoptimized
							/>
						)}
					</figure>
				</div>
				<div className="space-y-6">
					<div className="space-y-4">
						<h2 className="font-bold text-2xl md:text-3xl">{product.name}</h2>

						<div className="sm:flex sm:items-center sm:gap-4">
							<p className="font-semibold text-xl sm:text-2xl">
								R$ {product.price}
							</p>
							<div className="mt-2 flex items-center gap-2 sm:mt-0">
								<div className="flex items-center gap-0.5">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className="size-5 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<p className="text-muted-foreground text-sm">(5.0)</p>
								<Link href="#" className="text-sm hover:underline">
									345 Reviews
								</Link>
							</div>
						</div>

						<div className="space-y-4">
							<p className="text-muted-foreground">{product.description}</p>
						</div>
						<div className="flex gap-4">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										onClick={() =>
											cartStore.addItem({
												id: product.id,
												slug: product.slug,
												image: product.images[0],
												name: product.name,
												price: product.price,
												quantity: 1,
											})
										}
										className="flex-1"
									>
										<ShoppingCartIcon />
										Adicionar ao carrinho
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px] md:max-w-[525px]">
									<div className="-translate-x-1/2 -top-2.5 absolute left-1/2 transform rounded-full bg-primary">
										<CircleCheck />
									</div>
									<DialogHeader>
										<DialogTitle>
											Produto adicionado ao seu carrinho!
										</DialogTitle>
										<DialogDescription>
											O que você deseja fazer a seguir?
										</DialogDescription>
									</DialogHeader>

									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Continuar comprando</Button>
										</DialogClose>
										<Button onClick={() => router.push("/checkout/cart")}>
											Finalizar compra
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Button variant="outline" size="icon">
								<HeartIcon />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
