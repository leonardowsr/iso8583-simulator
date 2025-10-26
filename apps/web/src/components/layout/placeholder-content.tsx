import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent({
	children,
	CardHeader,
}: {
	children?: React.ReactNode;
	CardHeader?: React.ReactNode;
}) {
	return (
		<Card className="rounded-lg border">
			{CardHeader}
			<CardContent>
				<div>{children}</div>
			</CardContent>
		</Card>
	);
}
