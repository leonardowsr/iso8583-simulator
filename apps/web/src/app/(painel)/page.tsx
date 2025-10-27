import { CTA } from "@/components/landing/CTA";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/nav/header";

export default function Page() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<Header />
			<Hero />
			<Features />
			<FeaturedProducts />
			<CTA />
			<Footer />
		</div>
	);
}
