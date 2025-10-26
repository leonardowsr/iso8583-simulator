/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";
import { PiggyBank } from "lucide-react";
import Link from "next/link";
import { Menu } from "@/components/panel/menu";
import { SidebarToggle } from "@/components/panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const sidebar = useStore(useSidebar, (x) => x);
	if (!sidebar) return null;
	const { isOpen, toggleOpen, getOpenState, settings } = sidebar;
	return (
		<aside
			className={cn(
				"fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out ",
				!getOpenState() ? "w-[90px]" : "w-72",
				settings.disabled && "hidden",
			)}
		>
			<SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
			<div className="relative h-full flex flex-col px-3 py-2 overflow-y-auto shadow-md dark:shadow-zinc-800">
				<Button
					className={cn(
						"transition-transform ease-in-out  mb-1",
						!getOpenState() ? "translate-x-1" : "translate-x-0",
					)}
					variant="link"
					asChild
				>
					<Link href="/dashboard" className="flex items-center gap-2">
						<PiggyBank className="!w-8 !h-8 mr-2 shrink-0" />
						<h1
							className={cn(
								"font-bold text-2xl whitespace-nowrap transition-[transform,opacity,display] ease-in-out ",
								!getOpenState()
									? "-translate-x-96 opacity-0 hidden"
									: "translate-x-0 opacity-100",
							)}
						>
							Banco
						</h1>
					</Link>
				</Button>
				<Menu isOpen={getOpenState()} />
			</div>
		</aside>
	);
}
