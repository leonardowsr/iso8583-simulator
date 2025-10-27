import ContainerContent from "@/components/layout/container-content";
import { ProductsLayout } from "@/components/layout/products-layout";
import { CardHeader } from "@/components/ui/card";

export default async function Page() {
	return (
		<ContainerContent
			CardHeader={
				<CardHeader>
					<h2 className="text-lg">Você está em: Produtos</h2>
				</CardHeader>
			}
		>
			<ProductsLayout />
		</ContainerContent>
	);
}
