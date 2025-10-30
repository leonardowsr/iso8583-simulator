export const CONFIG = {
	name: "Página inicial",
	description: "An e-commerce platform built with Next.js and Tailwind CSS.",
};

export interface NavItem {
	title: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
	icon?: React.ReactNode;
	label?: string;
}
interface DocsConfig {
	sidebarNav: NavItem[];
}

export const docsConfig: DocsConfig = {
	sidebarNav: [
		{
			title: "Início",
			href: "/",
		},
		{
			title: "Produtos",
			href: "/products",
		},
		{
			title: "IsoMessages",
			href: "/messages",
		},
	],
};
