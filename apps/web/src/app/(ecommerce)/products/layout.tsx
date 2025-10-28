import Header from "@/components/(ecommerce)/nav/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />

			{children}
		</>
	);
}
