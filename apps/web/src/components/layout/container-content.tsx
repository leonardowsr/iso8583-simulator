import { Card, CardContent } from "@/components/ui/card";

export default function ContainerContent({
	children,
	CardHeader,
}: {
	children?: React.ReactNode;
	CardHeader?: React.ReactNode;
}) {
	return (
		<Card className="min-h-dvh rounded-lg border-none bg-inherit lg:m-auto lg:max-w-6/7">
			{CardHeader}
			<CardContent>
				<div>{children}</div>
			</CardContent>
		</Card>
	);
}
