import ContainerContent from "@/components/layout/container-content";
import { ProductsLayout } from "@/components/layout/products-layout";

export default async function Page() {
	return (
		<ContainerContent
			CardHeader={<h2 className="text-lg">Você está em: Produtos</h2>}
		>
			<ProductsLayout />
		</ContainerContent>
	);
}
