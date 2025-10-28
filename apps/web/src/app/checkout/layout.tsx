import { CheckoutHeader } from "@/components/checkout/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<CheckoutHeader />
			{children}
		</>
	);
}
