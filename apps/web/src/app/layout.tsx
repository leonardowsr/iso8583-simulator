import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import "./index.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "../components/providers/theme-provider";

export const metadata: Metadata = {
	title: "Banco",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				{/* <ReactQueryProvider> */}
					<Toaster position="top-right" />
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<NextTopLoader />
					</ThemeProvider>
				{/* </ReactQueryProvider> */}
			</body>
		</html>
	);
}
