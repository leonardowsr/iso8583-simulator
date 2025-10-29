import Header from "@/components/(ecommerce)/nav/header";
import { ReactRelayContainer } from "@/relay/ReactRelayContainer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ReactRelayContainer useAcquirer>
			<Header />
			{children}
		</ReactRelayContainer>
	);
}
