"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCardStore } from "@/lib/store/use-card-store";
import { MaskInput } from "../ui/mask-input";

export default function CardPaymentMethod() {
	const router = useRouter();
	const setCard = useCardStore((s) => s.setCard);

	const cardSchema = z.object({
		name: z.string().min(1, "Nome obrigatório"),
		number: z.string().min(19, "Número inválido"),
		expiryMonth: z.string().min(1, "Mês obrigatório"),
		expiryYear: z.string().min(1, "Ano obrigatório"),
		cvv: z.string().min(3, "CVV obrigatório"),
	});

	const form = useForm<z.infer<typeof cardSchema>>({
		resolver: zodResolver(cardSchema),
		defaultValues: {
			name: "",
			number: "",
			expiryMonth: "",
			expiryYear: "",
			cvv: "",
		},
	});

	function onSubmit(data: z.infer<typeof cardSchema>) {
		const expiry = `${data.expiryMonth}/${data.expiryYear}`;
		setCard({ name: data.name, number: data.number, expiry, cvc: data.cvv });
		router.push("/checkout/confirmation");
	}
	return (
		<div className="w-full flex-col items-center space-y-4 p-4 pt-4 md:flex md:flex-col md:space-y-0">
			<div className="m-auto max-w-[450px]">
				<Link
					href={"/checkout/cart"}
					className="text-muted-foreground text-sm hover:text-primary"
				>
					Voltar ao carrinho
				</Link>
			</div>
			<Card className="m-auto w-full max-w-[450px]">
				<CardHeader>
					<CardTitle>Adicionar Método de Pagamento</CardTitle>
					<CardDescription>Insira os dados do cartão</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Nome no cartão</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder="Nome no cartão"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="number"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="card-number">
											Número do cartão
										</FieldLabel>
										<MaskInput
											{...field}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											id="card-number"
											mask="creditCard"
											placeholder="0000 0000 0000 0000"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<div className="grid grid-cols-3 gap-4">
								<Controller
									name="expiryMonth"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="card-month">Expiração</FieldLabel>
											<Select
												value={field.value}
												aria-invalid={fieldState.invalid}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													className="w-full"
													aria-invalid={fieldState.invalid}
													id="card-month"
													aria-label="Month"
												>
													<SelectValue placeholder="Mês" />
												</SelectTrigger>
												<SelectContent aria-invalid={fieldState.invalid}>
													<SelectItem value="01">Janeiro</SelectItem>
													<SelectItem value="02">Fevereiro</SelectItem>
													<SelectItem value="03">Março</SelectItem>
													<SelectItem value="04">Abril</SelectItem>
													<SelectItem value="05">Maio</SelectItem>
													<SelectItem value="06">Junho</SelectItem>
													<SelectItem value="07">Julho</SelectItem>
													<SelectItem value="08">Agosto</SelectItem>
													<SelectItem value="09">Setembro</SelectItem>
													<SelectItem value="10">Outubro</SelectItem>
													<SelectItem value="11">Novembro</SelectItem>
													<SelectItem value="12">Dezembro</SelectItem>
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									name="expiryYear"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="card-year">Ano</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													className="w-full"
													id="card-year"
													aria-invalid={fieldState.invalid}
													aria-label="Year"
												>
													<SelectValue placeholder="Ano" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 10 }, (_, i) => {
														const year = `${new Date().getFullYear() + i}`;
														return (
															<SelectItem key={year} value={year}>
																{year}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									name="cvv"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="card-cvv">CVV</FieldLabel>
											<Input
												{...field}
												maxLength={3}
												id="card-cvv"
												placeholder="cvv"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>
						</FieldGroup>
						<CardFooter className="mt-6">
							<Button className="w-full" type="submit">
								Finalizar pagamento
							</Button>
						</CardFooter>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

const _Icons = {
	card: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			className="mb-3 h-6 w-6"
		>
			<title>Cartão de Crédito</title>
			<rect width="20" height="14" x="2" y="5" rx="2" />
			<path d="M2 10h20" />
		</svg>
	),
	apple: () => (
		<svg role="img" viewBox="0 0 24 24" className="mb-3 size-6">
			<title>Apple Pay</title>
			<path
				d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
				fill="currentColor"
			/>
		</svg>
	),
	paypal: () => (
		<svg role="img" viewBox="0 0 24 24" className="mb-3 size-6">
			<title>Paypal</title>
			<path
				d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"
				fill="currentColor"
			/>
		</svg>
	),
};
