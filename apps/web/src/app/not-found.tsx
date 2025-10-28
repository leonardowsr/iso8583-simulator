import Link from "next/link";
import Header from "@/components/(ecommerce)/nav/header";

export default function NotFound() {
	return (
		<>
			<Header />
			<div className="flex flex-col items-center justify-center">
				<h1 className="mt-10 font-bold text-9xl">404</h1>
				<div className="bottom-4 text-center">
					<p className="text-lg">Página não encontrada</p>
					<Link href="/" className="text-blue-500 hover:underline">
						Voltar para a página inicial
					</Link>
				</div>
			</div>
		</>
	);
}
