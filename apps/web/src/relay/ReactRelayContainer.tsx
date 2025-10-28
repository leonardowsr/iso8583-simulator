"use client";
import { RelayEnvironmentProvider } from "react-relay";
import {
	getClientEnvironment,
	getClientEnvironmentAcquirer,
} from "./environment";

export function ReactRelayContainer({
	children,
	useAcquirer = false,
}: {
	children: React.ReactNode;
	useAcquirer?: boolean;
	records?: Record<string, unknown>;
}) {
	const environment = useAcquirer
		? getClientEnvironmentAcquirer()
		: getClientEnvironment();

	return (
		<RelayEnvironmentProvider environment={environment}>
			{children}
		</RelayEnvironmentProvider>
	);
}
