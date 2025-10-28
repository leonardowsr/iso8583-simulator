"use client";
import { Suspense, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import Header from "@/components/(ecommerce)/nav/header";
import { Spinner } from "@/components/ui/spinner";
import {
	createEnvironment,
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
