import { Suspense } from "react";
import Header from "@/components/nav/header";
import { Spinner } from "@/components/ui/spinner";

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
