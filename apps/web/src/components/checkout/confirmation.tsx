"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { commitMutation, useMutation } from "react-relay";
import { v4 as uuidv4 } from "uuid";
import type {
	confirmationOrderAddMutation$data,
	confirmationOrderAddMutation$variables,
} from "@/__generated_ecommerce__/confirmationOrderAddMutation.graphql";
import { Button } from "@/components/ui/button";
import { useCardStore } from "@/lib/store/use-card-store";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useUserStore } from "@/lib/store/use-user-store";
import { confirmationTransactionAddMutation } from "@/mutations/acquire/confirmationTransactionAddMutation";
import { confirmationOrderAddMutation } from "@/mutations/ecommerce/confirmationOrderAddMutation";
import { getClientEnvironmentAcquirer } from "@/relay/environment";

function maskCardNumber(number: string) {
	return number.replace(/.(?=.{4})/g, "*");
}

export function Confirmation() {
	const card = useCardStore((s) => s.card);
	const router = useRouter();
	const cartItems = useCartStore((s) => s.cartItems);
	const user = useUserStore((s) => s.user);
	const finalValue = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);
	const [commitOrderAddMutation, isOrderAddMutationInFlight] = useMutation(
		confirmationOrderAddMutation,
	);

	const [_error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [
		isTransactionAddMutationInFlight,
		setIsTransactionAddMutationInFlight,
	] = useState<boolean>(false);

	const handleConfirmPayment = () => {
		setError(null);
		setSuccess(false);
		setIsTransactionAddMutationInFlight(true);
		const idempotencyKey = uuidv4();
		const orderVariables = {
			input: {
				userId: user.id,
				items: cartItems.map((item) => ({
					productId: item.id, // ajuste aqui para usar o ID real
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
						cardNumber: card?.number.replaceAll(" ", ""),
						cardHolderName: card?.name,
						cardExpiryMonth: card?.expiry.split("/")[0],
						cardExpiryYear: card?.expiry.split("/")[1].slice(-2),
						cardCvv: card?.cvc,
					},
				};

				commitMutation(getClientEnvironmentAcquirer(), {
					mutation: confirmationTransactionAddMutation,
					variables: transactionVariables,
					onCompleted: () => {
						setSuccess(true);
						setError(null);
						setIsTransactionAddMutationInFlight(false);
					},
					onError: (err) => {
						setError(err.message);
						setSuccess(false);
						setIsTransactionAddMutationInFlight(false);
					},
				});
			},
			onError: (err) => {
				setError(err.message);
				setSuccess(false);
				setIsTransactionAddMutationInFlight(false);
			},
		});
	};

	useEffect(() => {
		if (!card) {
			router.push("/checkout/payment");
		}
	}, [card, router.push]);
	return (
		<>
			<div className="mb-0 w-full md:w-2xl">
				<Link
					href={"/checkout/payment"}
					className="text-muted-foreground text-sm hover:text-primary"
				>
					Voltar ao método de pagamento
				</Link>
			</div>
			<div className="mx-auto mt-8 w-full max-w-2xl rounded bg-white p-6 shadow">
				<h2 className="mb-4 font-bold text-xl">Confirmação do Pagamento</h2>
				{success ? (
					<div className="mb-4 text-green-600">
						Pagamento confirmado com sucesso!
					</div>
				) : null}

				<div className="mb-4">
					<div className="mb-2">
						<span className="font-medium">Nome no cartão: </span>
						{card?.name ? (
							card.name
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					<div className="mb-2">
						<span className="font-medium">Número do cartão: </span>
						{card?.number ? (
							maskCardNumber(card.number)
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					<div className="mb-2">
						<span className="font-medium">Validade: </span>
						{card?.expiry ? (
							card.expiry
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					{/* Não exibe o CVC */}
				</div>
				<div className="mb-6">
					<span className="font-medium">Valor final: </span>
					<span className="font-bold text-green-600">
						R$ {finalValue.toFixed(2)}
					</span>
				</div>
				<div className="flex justify-center">
					<Button
						className="w-full md:w-1/2"
						size="lg"
						onClick={handleConfirmPayment}
						disabled={
							isOrderAddMutationInFlight || isTransactionAddMutationInFlight
						}
					>
						{isOrderAddMutationInFlight || isTransactionAddMutationInFlight
							? "Processando..."
							: "Confirmar Pagamento"}
					</Button>
				</div>
			</div>
		</>
	);
}
