"use client";

import { LayoutGrid, LogOut, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useFindMeAccount } from "@/api/client/account/account";
import { useFindMeUser } from "@/api/client/users/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserNav() {
	const { push } = useRouter();

	const { data: userData } = useFindMeUser();
	const { data: account } = useFindMeAccount();

	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value / 100);
	};

	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src="#" alt="Avatar" />
									<AvatarFallback className="bg-transparent">
										{getInitials(userData?.name)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent className="w-80" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="font-medium text-sm leading-none">
							{userData?.name || "Usuário"}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{userData?.email || "email@example.com"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{account && (
					<>
						<div className="px-2 py-2">
							<p className="mb-2 flex items-center font-semibold text-muted-foreground text-xs">
								<Wallet className="mr-2 h-3 w-3" />
								Minha Conta
							</p>
							{/* Número da conta em destaque */}
							<div className="mb-2 rounded bg-muted p-2">
								<p className="text-muted-foreground text-xs">
									Número da conta:
								</p>
								<p className="font-bold font-mono text-sm">
									{account.accountNumber || "N/A"}
								</p>
							</div>
							{/* Saldo da conta */}
							<div className="rounded border border-border p-2">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-xs">Saldo:</span>
									<span className="font-medium text-sm">
										{formatCurrency(account.balance || 0)}
									</span>
								</div>
							</div>
						</div>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/dashboard" className="flex items-center">
							<LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/account" className="flex items-center">
							<User className="mr-3 h-4 w-4 text-muted-foreground" />
							Gerenciar Conta
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="hover:cursor-pointer"
					onClick={() => {
						push("/api/logout");
					}}
				>
					<LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
