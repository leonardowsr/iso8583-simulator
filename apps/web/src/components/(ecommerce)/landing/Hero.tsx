import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="text-center">
					<Badge variant="secondary" className="mb-4">
						🚀 Bem-vindo à nossa loja
					</Badge>
					<h1 className="mb-6 font-bold text-4xl text-slate-900 tracking-tight sm:text-6xl dark:text-slate-100">
						Descubra produtos
						<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-primary">
							{" "}
							incríveis
						</span>
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
						Explore nossa coleção exclusiva de produtos de alta qualidade.
						Encontre tudo o que você precisa com entrega rápida e preços
						competitivos.
					</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button asChild size="lg" className="text-lg">
							<Link href="/products">
								Ver Produtos
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Background decoration */}
			<div className="-top-40 -right-32 absolute h-80 w-80 rounded-full bg-linear-to-br from-blue-400/20 to-purple-600/20 blur-3xl" />
			<div className="-bottom-40 -left-32 absolute h-80 w-80 rounded-full bg-linear-to-br from-purple-400/20 to-pink-600/20 blur-3xl" />
		</section>
	);
}
