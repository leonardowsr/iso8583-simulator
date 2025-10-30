"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { commitMutation } from "relay-runtime";
import { toast } from "sonner";
import * as z from "zod";
import type {
	confirmationOrderAddMutation$data,
	confirmationOrderAddMutation$variables,
} from "@/__generated_ecommerce__/confirmationOrderAddMutation.graphql";
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
import { useCartStore } from "@/lib/store/use-cart-store";
import { useUserStore } from "@/lib/store/use-user-store";
import { confirmationTransactionAddMutation } from "@/mutations/acquire/confirmationTransactionAddMutation";
import { confirmationOrderAddMutation } from "@/mutations/ecommerce/confirmationOrderAddMutation";
import { getClientEnvironmentAcquirer } from "@/relay/environment";
import { MaskInput } from "../ui/mask-input";
import { Spinner } from "../ui/spinner";

const cardSchema = z.object({
	name: z.string().min(1, "Nome obrigatório"),
	expiryMonth: z.string().min(1, "Mês obrigatório"),
	expiryYear: z.string().min(1, "Ano obrigatório"),
	cvv: z.string().min(3, "CVV obrigatório"),
	number: z
		.string("Número do cartão obrigatório")
		.length(19, "Cartão muito curto")
		.refine((pan) => {
			const cleanedPan = pan.replaceAll(" ", "");
			// VISA: começa com 4
			if (cleanedPan.startsWith("4")) return true;
			// MASTERCARD:
			if (cleanedPan.length === 16) {
				const first2 = Number(cleanedPan.slice(0, 2));
				const first6 = Number(cleanedPan.slice(0, 6));
				const mc_51_55 = first2 >= 51 && first2 <= 55;
				const mc_2221_2720 = first6 >= 222100 && first6 <= 272099;
				if (mc_51_55 || mc_2221_2720) return true;
			}
			return false;
		}, "Somente cartões Visa ou Mastercard são aceitos"),
});

export default function CardPaymentMethod() {
	const [statesForm, setStatesForm] = useState({
		isPending: false,
		isError: false,
		isSuccess: false,
	});
	const router = useRouter();
	const {
		cartItems,
		cartItemsPayment,
		clearCart,
		rehydrated,
		setCartItemsPayment,
	} = useCartStore();
	const user = useUserStore((s) => s.user);
	const finalValue = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const [commitOrderAddMutation] = useMutation(confirmationOrderAddMutation);

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

	async function onSubmit() {
		setStatesForm((prev) => ({
			...prev,
			isError: false,
			isSuccess: false,
			isPending: true,
		}));
		const data = form.getValues();
		const idempotencyKey = crypto.randomUUID();
		const orderVariables = {
			input: {
				userId: user.id,
				items: cartItems.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
				})),
			},
		} satisfies confirmationOrderAddMutation$variables;

		commitOrderAddMutation({
			variables: orderVariables,
			onCompleted: (response: confirmationOrderAddMutation$data) => {
				const orderId = response.orderAdd.order.id;
				const transactionVariables = {
					input: {
						userId: user.id,
						orderRef: orderId,
						amount: finalValue * 100,
						idempotencyKey,
						cardNumber: data?.number.replaceAll(" ", ""),
						cardHolderName: data?.name,
						cardExpiryMonth: data?.expiryMonth,
						cardExpiryYear: data?.expiryYear.slice(-2),
						cardCvv: data?.cvv,
					},
				};

				commitMutation(getClientEnvironmentAcquirer(), {
					mutation: confirmationTransactionAddMutation,
					variables: transactionVariables,
					onCompleted: () => {
						toast.success("Pagamento foi confirmado com sucesso!");
						setStatesForm((prev) => ({
							...prev,
							isPending: false,
							isSuccess: true,
						}));
						setCartItemsPayment();
						clearCart();
					},
					onError: () => {
						setStatesForm((prev) => ({
							...prev,
							isPending: false,
							isError: true,
						}));

						toast.error(
							"Erro ao processar o pagamento, verifique os dados do seu cartão.",
						);
					},
				});
			},
			onError: () => {
				toast.error("Erro ao criar o pedido.");
				setStatesForm((prev) => ({ ...prev, isPending: false, isError: true }));
			},
		});
	}

	useEffect(() => {
		if (!rehydrated) return;
		if (cartItems.length === 0 || !user) {
			router.push("/checkout/cart");
		}
	}, [rehydrated, user]);

	const isSubmitting = form.formState.isSubmitting || statesForm.isPending;
	const finalValuePaymentCart = cartItemsPayment.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);
	return (
		<div className="w-full flex-col items-center space-y-4 p-4 pt-4 md:flex md:flex-col md:space-y-0">
			<div className="m-auto max-w-[450px]">
				<Link
					href={statesForm.isSuccess ? "/products" : "/checkout/cart"}
					className="text-muted-foreground text-sm hover:text-primary"
				>
					{statesForm.isSuccess ? "Voltar aos produtos" : "Voltar ao carrinho"}
				</Link>
			</div>
			<Card className="m-auto w-full max-w-[450px]">
				{statesForm.isSuccess ? (
					<>
						<CardHeader className="text-primary">
							Pagamento foi aprovado com sucesso!
						</CardHeader>
						<CardContent>
							<div>
								<p>Resumo do pedido:</p>
								<p>Valor total: R$ {finalValuePaymentCart}</p>
								<ul>
									{cartItemsPayment.map((item) => (
										<li
											key={item.id ?? item.name}
											className="flex items-center gap-3 py-3"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted font-medium text-muted-foreground text-sm">
												<img src={item.image} alt="" />
											</div>

											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-sm">
													{item.name}
												</p>
												<p className="text-muted-foreground text-xs">
													Qtd {item.quantity} ×{" "}
													{Number(item.price).toLocaleString("pt-BR", {
														style: "currency",
														currency: "BRL",
													})}
												</p>
											</div>

											<div className="ml-4 font-semibold text-sm">
												{Number(item.price * item.quantity).toLocaleString(
													"pt-BR",
													{ style: "currency", currency: "BRL" },
												)}
											</div>
										</li>
									))}
								</ul>
							</div>
							<div className="text-center">
								<Button
									onClick={() => {
										router.push("/");
									}}
									variant="outline"
								>
									Voltar ao início
								</Button>
							</div>
						</CardContent>
					</>
				) : (
					<>
						<CardHeader>
							<CardTitle className="mb-2">
								Adicionar Método de Pagamento
							</CardTitle>
							<div className="flex size-15 items-center justify-center rounded-2xl border border-primary bg-muted p-4">
								<CardIcon />
							</div>
							<CardDescription>Insira os dados do cartão</CardDescription>
						</CardHeader>

						<CardContent>
							<form id="payment-form" onSubmit={form.handleSubmit(onSubmit)}>
								<FieldGroup>
									<Controller
										name="name"
										control={form.control}
										disabled={isSubmitting}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													Nome no cartão
												</FieldLabel>
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
										disabled={isSubmitting}
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="card-number">
													Número do cartão
												</FieldLabel>
												<MaskInput
													onValueChange={(value) => field.onChange(value)}
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
											disabled={isSubmitting}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor="card-month">
														Expiração
													</FieldLabel>
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
											disabled={isSubmitting}
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
											disabled={isSubmitting}
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor="card-cvv">CVV</FieldLabel>
													<Input
														maxLength={3}
														id="card-cvv"
														onChange={(e) => {
															field.onChange(e.target.value.replace(/\D/g, ""));
														}}
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
							</form>
						</CardContent>
						<CardFooter className="flex flex-col">
							{statesForm.isError && (
								<FieldLabel className="mb-2 text-destructive">
									Erro ao autorizar pagamento com o seu cartão
								</FieldLabel>
							)}
							<Button
								form="payment-form"
								className="w-full"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<Spinner className="size-6" />
								) : (
									"Finalizar pagamento"
								)}
							</Button>
						</CardFooter>
						<FieldLabel className="flex w-full justify-center text-center text-muted-foreground text-sm">
							{isSubmitting
								? "Processando pagamento..."
								: "Seu pagamento será processado com segurança."}
						</FieldLabel>
					</>
				)}
			</Card>
		</div>
	);
}

const CardIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
	>
		<title>Cartão de Crédito</title>
		<rect width="20" height="14" x="2" y="5" rx="2" />
		<path d="M2 10h20" />
	</svg>
);
