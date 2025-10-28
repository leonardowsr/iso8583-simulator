import { Cta } from "@/components/(ecommerce)/landing/cta";
import { FeaturedProducts } from "@/components/(ecommerce)/landing/FeaturedProducts";
import { Features } from "@/components/(ecommerce)/landing/Features";
import { Hero } from "@/components/(ecommerce)/landing/Hero";
import { Footer } from "@/components/(ecommerce)/layout/Footer";
import Header from "@/components/(ecommerce)/nav/header";

export default function Page() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<Header />
			<Hero />
			<Features />
			<FeaturedProducts />
			<Cta />
			<Footer />
		</div>
	);
}
