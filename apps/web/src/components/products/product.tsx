"use client";
import { CircleCheck, HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/_types/product";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

interface Props {
	product: Product;
}

const ProductCard = ({ product }: Props) => {
	const [liked, setLiked] = useState<boolean>(false);
	const addItem = useCartStore((state) => state.addItem);
	const router = useRouter();

	const imageSrc = product?.images?.[0] || "/placeholder.png";
	const description = product?.description || "";
	const title = product?.title || "Produto";
	const price = typeof product?.price === "number" ? product.price : 0;
	const slug = product?.slug || "";
	const category = product?.category?.name || "";

	// Handler para navegação
	const handleNavigate = (e: React.MouseEvent) => {
		// Evita navegação se clicar no botão
		if ((e.target as HTMLElement).closest("button")) return;
		router.push(`/products/${slug}`);
	};

	return (
		<Card
			className="relative cursor-pointer gap-3 from-neutral-600 to-violet-300 pt-0 pb-2 shadow-lg md:min-w-46 lg:max-w-60"
			onClick={handleNavigate}
		>
			<CardContent className="px-0">
				<img
					src={imageSrc ?? "https://placehold.co/400x400"}
					alt="Banner"
					className="aspect-video h-60 rounded-t-xl object-cover"
				/>
			</CardContent>
			<Button
				size="icon"
				onClick={(e) => {
					e.stopPropagation();
					setLiked(!liked);
				}}
				className="absolute top-4 right-4 rounded-full bg-primary/10 hover:bg-primary/20"
			>
				<HeartIcon
					className={cn(
						"size-4",
						liked ? "fill-destructive stroke-destructive" : "stroke-white",
					)}
				/>
				<span className="sr-only">Like</span>
			</Button>
			<CardHeader className="m-0 flex-1 p-0 px-2">
				<CardTitle className="m-0 p-0">{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 px-2 py-0">
				<p className="w-full text-[12px] text-muted-foreground">
					{description.length > 70
						? `${description.substring(0, 70)}...`
						: description}
				</p>
			</CardContent>
			<CardFooter className="flex-1 flex-col justify-between gap-1 max-sm:items-stretch">
				<div className="flex w-full items-center justify-between">
					<span className="font-medium text-sm">Preço</span>
					<span className="font-semibold text-xl">R$ {price}</span>
				</div>
				<div>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								size="lg"
								onClick={(e) => {
									e.stopPropagation();
									addItem({
										id: slug,
										name: title,
										image: imageSrc,
										price: price,
										quantity: 1,
										category: category,
									});
								}}
							>
								Adicionar ao carrinho
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px] md:max-w-[525px]">
							<div className="-translate-x-1/2 -top-2.5 absolute left-1/2 transform rounded-full bg-primary">
								<CircleCheck />
							</div>
							<DialogHeader>
								<DialogTitle>Produto adicionado ao seu carrinho!</DialogTitle>
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
				</div>
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
