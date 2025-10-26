"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SheetMenu } from "@/components/panel/sheet-menu";
import { UserNav } from "@/components/panel/user-nav";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface NavbarProps {
	title: string;
}

export function Navbar({ title }: NavbarProps) {
	const [_isOpen, _setIsOpen] = useState(false);

	return (
		<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
			<div className="mx-4 flex h-14 items-center sm:mx-8">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<SheetMenu />
					<h1 className="font-bold">{title}</h1>
				</div>
				<div>
					<Link
						href="https://github.com/leonardowsr/leaky-bucket-bank"
						target="_blank"
						rel="noreferrer"
						className="ml-4 flex items-center gap-2 rounded-md border px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<Github />
						<span className="hidden sm:block">Acessar projeto no github</span>
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-end">
					<ModeToggle />
					<UserNav />
				</div>
			</div>
		</header>
	);
}
