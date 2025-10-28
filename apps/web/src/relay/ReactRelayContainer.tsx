"use client";
import { Suspense, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import Header from "@/components/nav/header";
import { Spinner } from "@/components/ui/spinner";
import { createEnvironment, getClientEnvironment } from "./environment";

export function ReactRelayContainer({
	children,
}: {
	children: React.ReactNode;
	records?: Record<string, unknown>;
}) {
	const environment = getClientEnvironment();

	return (
		<RelayEnvironmentProvider environment={environment}>
			{children}
		</RelayEnvironmentProvider>
	);
}

const Fallback = () => {
	return (
		<div>
			<Header />
			<div className="flex min-h-screen items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		</div>
	);
};
