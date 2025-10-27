import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-800">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="md:col-span-2">
						<h3 className="mb-4 font-semibold text-lg text-slate-900 dark:text-slate-100">
							Página inicial
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							Sua loja online de confiança para produtos de qualidade e entrega
							rápida.
						</p>
					</div>
					<div>
						<h4 className="mb-4 font-medium text-slate-900 dark:text-slate-100">
							Links Úteis
						</h4>
						<ul className="space-y-2 text-slate-600 text-sm dark:text-slate-400">
							<li>
								<Link
									href="/products"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Produtos
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Sobre Nós
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Contato
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 font-medium text-slate-900 dark:text-slate-100">
							Suporte
						</h4>
						<ul className="space-y-2 text-slate-600 text-sm dark:text-slate-400">
							<li>
								<Link
									href="/"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Central de Ajuda
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Política de Entrega
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="hover:text-slate-900 dark:hover:text-slate-100"
								>
									Devoluções
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 border-slate-200 border-t pt-8 text-center text-slate-600 text-sm dark:border-slate-700 dark:text-slate-400">
					<p>&copy; 2025 Página inicial. Todos os direitos reservados.</p>
				</div>
			</div>
		</footer>
	);
}
