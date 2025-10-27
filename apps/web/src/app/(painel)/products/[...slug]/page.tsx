import ProductDetail from "@/components/products/product-details";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return <ProductDetail slug={slug[0]} />;
}
