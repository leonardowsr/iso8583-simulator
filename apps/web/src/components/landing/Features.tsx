import { ShoppingBag, Star, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<Card className="text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
								<Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle>Entrega Rápida</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-slate-600 dark:text-slate-400">
								Entregamos seus produtos em até 2 dias úteis em todo o
								território nacional.
							</p>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
								<ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<CardTitle>Produtos de Qualidade</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-slate-600 dark:text-slate-400">
								Cuidamos da seleção dos melhores produtos para garantir sua
								satisfação.
							</p>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
								<Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<CardTitle>Suporte Especializado</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-slate-600 dark:text-slate-400">
								Nossa equipe está sempre pronta para ajudar com qualquer dúvida
								ou problema.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
