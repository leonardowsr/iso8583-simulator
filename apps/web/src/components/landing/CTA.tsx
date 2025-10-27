import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
	return (
		<section className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl text-center">
				<h2 className="mb-4 font-bold text-3xl sm:text-4xl">
					Pronto para começar suas compras?
				</h2>
				<p className="mb-8 text-lg text-slate-300">
					Junte-se a milhares de clientes satisfeitos e descubra por que somos a
					escolha número um.
				</p>
				<Button
					asChild
					size="lg"
					className="bg-white text-slate-900 hover:bg-slate-100"
				>
					<Link href="/products">
						Explorar Produtos
						<ShoppingBag className="ml-2 h-5 w-5" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
