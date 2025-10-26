import { useEffect, useState } from "react";
import { useSse } from "@/api/client/transaction/transaction";

export const useTransactionSubscription = (transactionId: string | "") => {
	const [isFinished, setIsFinished] = useState(false);

	const {
		data: transaction,
		error,
		isLoading,
	} = useSse(transactionId, {
		query: {
			queryKey: ["transaction-sse", transactionId],
			enabled: !!transactionId && !isFinished,
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	});

	// Reseta isFinished quando transactionId muda
	useEffect(() => {
		if (transactionId) {
			setIsFinished(false);
		}
	}, [transactionId]);

	// Marca como finalizado quando a transação não está mais pendente
	useEffect(() => {
		if (transaction && transaction.status !== "pending" && !isFinished) {
			setIsFinished(true);
		}
	}, [transaction, isFinished]);

	return {
		transaction,
		error,
		isLoading: isLoading && !isFinished,
		isFinished,
	};
};
