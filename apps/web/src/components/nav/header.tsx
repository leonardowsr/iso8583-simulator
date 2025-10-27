"use client";

// import { useAuthenticated } from '@/hooks/useAuthentication'
import { LogInIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { CartClient } from "../cart/cart-content";
import { CommandMenu } from "./command";
import { MainNav } from "./desktop";
import { MobileNav } from "./mobile";

export default function Header() {
	// const { authenticated } = useAuthenticated()

	return (
		<header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/90 px-[1.4rem] backdrop-blur supports-backdrop-blur:bg-background/90 md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
			<div className="flex h-14 items-center">
				<MainNav />
				<MobileNav />
				<div className="flex flex-1 items-center justify-end space-x-2">
					<div className="flex-none">
						<CommandMenu />
					</div>
					<CartNav />
					<ThemeToggle />
					<LoginDialog />
				</div>
			</div>
		</header>
	);
}

export function CartNav() {
	return <CartClient />;
}

function LoginDialog() {
	return (
		<Link href="/login">
			<Button className="flex gap-2 font-medium">
				<LogInIcon className="h-4" />
				<p>Login</p>
			</Button>
		</Link>
	);
}

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{resolvedTheme === "dark" ? (
				<SunIcon className="h-4" />
			) : (
				<MoonIcon className="h-4" />
			)}
		</Button>
	);
}
