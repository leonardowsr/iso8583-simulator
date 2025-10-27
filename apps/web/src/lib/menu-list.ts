import { LayoutGrid, type LucideIcon, Settings, Users } from "lucide-react";
import type { Route } from "next";

type Submenu = {
	href: Route;
	label: string;
	active?: boolean;
};

type Menu = {
	href: Route;
	label: string;
	active?: boolean;
	icon: LucideIcon;
	submenus?: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(_pathname: string): Group[] {
	return [
		{
			groupLabel: "Navegação",
			menus: [
				{
					href: "/dashboard",
					label: "Dashboard",
					icon: LayoutGrid,
					submenus: [],
				},

				{
					href: "/users",
					label: "Usuários",
					icon: Users,
				},
				{
					href: "/account",
					label: "Minha conta",
					icon: Settings,
				},
			],
		},
	];
}
