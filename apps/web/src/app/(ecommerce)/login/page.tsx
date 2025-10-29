import { LoginForm } from "@/components/(ecommerce)/login-form";
import Header from "@/components/(ecommerce)/nav/header";
export const dynamic = "force-dynamic";

export default function LoginPage() {
	return (
		<>
			<Header />
			<div className="mx-auto my-20 flex max-w-[350] flex-col items-center justify-center gap-6 rounded-lg border p-6 shadow-lg md:max-w-sm md:p-10">
				<div className="w-full max-w-sm">
					<LoginForm />
				</div>
			</div>{" "}
		</>
	);
}
