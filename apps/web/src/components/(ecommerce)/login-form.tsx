"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { toast } from "sonner";
import type { loginFormUserQuery } from "@/__generated_ecommerce__/loginFormUserQuery.graphql";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/lib/store/use-user-store";
import { cn } from "@/lib/utils";

const UserQuery = graphql`
	query loginFormUserQuery {
		users(first: 1) {
			edges {
				node {
					id
					name
					email
				}
			}
		}
	}
`;
export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const data = useLazyLoadQuery<loginFormUserQuery>(UserQuery, {});
	const userStore = useUserStore((state) => state);
	const router = useRouter();

	useEffect(() => {
		if (!userStore.rehydrated) return;
		if (userStore.user) {
			router.push("/");
		}
	}, [userStore.user, userStore.rehydrated]);
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			{userStore.user ? (
				<div>Você já está logado</div>
			) : (
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
							<Button
								type="submit"
								onClick={() => {
									toast.success("Login realizado com sucesso!");
									userStore.setUser(data.users.edges[0].node);
								}}
							>
								Login
							</Button>
						</Field>
						<FieldSeparator>Ou</FieldSeparator>
						<Field>
							<Button variant="link" className="cursor-pointer">
								Se cadastrar
							</Button>
						</Field>
					</FieldGroup>
				</form>
			)}
		</div>
	);
}
