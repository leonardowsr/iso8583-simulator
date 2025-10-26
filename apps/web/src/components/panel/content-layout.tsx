import { Navbar } from "@/components/panel/navbar";

interface ContentLayoutProps {
	title: string;
	children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
	return (
		<div>
			<Navbar title={title} />
			<div className="container m-auto pt-8 pb-8 lg:px-8">{children}</div>
		</div>
	);
}
