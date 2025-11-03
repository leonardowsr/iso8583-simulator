import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./index.css";

import { Toaster } from "sonner";

import { ReactRelayContainer } from "@/relay/ReactRelayContainer";
import { ThemeProvider } from "../lib/providers/theme-provider";

export const metadata: Metadata = {
	title: "Ecommerce",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ReactRelayContainer>
					<Toaster position="top-right" />
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<NuqsAdapter>{children}</NuqsAdapter>
						<NextTopLoader />
					</ThemeProvider>
				</ReactRelayContainer>
			</body>
		</html>
	);
}
