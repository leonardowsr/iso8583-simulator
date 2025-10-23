import { Suspense, useMemo } from "react";
import { ReactRelayContext } from "react-relay";
import { createEnvironment } from "./environment";
import { type NextPageWithLayout, RelayHydrate } from "./RelayHydrate";

export function ReactRelayContainer<T>({
	Component,
	props,
}: {
	Component: NextPageWithLayout<T>;
	props: any;
}) {
	const environment = useMemo(() => createEnvironment(), []);
	return (
		<ReactRelayContext.Provider value={{ environment }}>
			<Suspense fallback={null}>
				<RelayHydrate Component={Component} props={props} />
			</Suspense>
		</ReactRelayContext.Provider>
	);
}
