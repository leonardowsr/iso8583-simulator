import { ReactRelayContainer } from "@/relay/ReactRelayContainer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ReactRelayContainer useAcquirer>{children}</ReactRelayContainer>;
}
