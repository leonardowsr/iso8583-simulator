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
			title: "Products",
			href: "/products",
		},
		{
			title: "Blog",
			href: "/blog",
		},
		{
			title: "Orders",
			href: "/profile/orders",
		},
		{
			title: "Payments",
			href: "/profile/payments",
		},
		{
			title: "Contact",
			href: "/contact",
		},
		{
			title: "About",
			href: "/about",
		},
	],
};
