"use client";

import { Sidebar } from "@/components/panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export default function AdminPanelLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebar = useStore(useSidebar, (x) => x);
	if (!sidebar) return null;
	const { getOpenState, settings } = sidebar;
	return (
		<>
			<Sidebar />
			<main
				className={cn(
					"min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-100 ease-in-out dark:bg-zinc-900",
					!settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
				)}
			>
				{children}
			</main>
		</>
	);
}
