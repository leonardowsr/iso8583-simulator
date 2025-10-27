import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							defaultValue={"admin@example.com"}
							type="email"
							placeholder="m@example.com"
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="password">Senha</FieldLabel>
						<Input
							id="password"
							type="password"
							defaultValue={"admin123"}
							placeholder="••••••••"
							required
						/>
					</Field>
					<Field>
						<Button type="submit">Login</Button>
					</Field>
					<FieldSeparator>Ou</FieldSeparator>
					<Field>
						<Button variant="link" className="cursor-pointer">
							Se cadastrar
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
