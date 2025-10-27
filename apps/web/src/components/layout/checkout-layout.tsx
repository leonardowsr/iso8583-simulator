import { CheckoutProductList } from "@/components/checkout/product-list";
import { CheckoutDisplayValue } from "../checkout/display-value";

export function CheckoutLayout() {
	return (
		<div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-6">
			<div className="flex flex-col gap-6 md:flex-row">
				<div className="flex-1">
					<CheckoutProductList />
				</div>
				<div className="w-full flex-1 md:w-64 lg:max-w-96">
					<CheckoutDisplayValue />
				</div>
			</div>
		</div>
	);
}
