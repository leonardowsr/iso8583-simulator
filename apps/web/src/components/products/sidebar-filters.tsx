import { Trash } from "lucide-react";
import { useCategoryFilterParam } from "@/hooks/use-category-filter-param";
import { usePriceFilterParam } from "@/hooks/use-price-filter-param";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { MaskInput } from "../ui/mask-input";
import { Slider } from "../ui/slider";

const CATEGORIES = [
	{ label: "Roupas", value: "roupas" },
	{ label: "Eletrônicos", value: "eletronicos" },
	{ label: "Móveis", value: "moveis" },
	{ label: "Calçados", value: "calcados" },
];

export function SidebarFilters() {
	const { categories, setCategories, clearCategories } =
		useCategoryFilterParam();
	const { minPrice, maxPrice, setMinPrice, setMaxPrice, clearPrice } =
		usePriceFilterParam();

	const clearAll = () => {
		clearPrice();
		clearCategories();
	};

	const handleCategoryChange = (cat: string) => {
		if (categories.includes(cat)) {
			setCategories(categories.filter((c) => c !== cat));
		} else {
			setCategories([...categories, cat]);
		}
	};

	return (
		<Card className="flex min-w-60 items-center justify-center space-y-4 p-2 pt-4 pb-4">
			<p>
				Filtros selecionados:{" "}
				{categories.length + (minPrice || maxPrice ? 1 : 0)}
			</p>
			<Button className="w-full" onClick={clearAll} variant="outline">
				<Trash />
				Remover filtros
			</Button>
			<div>
				<p>Busque por preço:</p>
				<div className="mt-2 flex gap-2">
					<MaskInput
						mask="currency"
						placeholder="R$0,00"
						className="w-24"
						value={minPrice !== undefined ? String(minPrice) : ""}
						onValueChange={(_, unmasked) => {
							const val = unmasked.replace(/\D/g, "");
							setMinPrice(val ? Number(val) : undefined);
						}}
					/>
					{"-"}
					<MaskInput
						mask="currency"
						placeholder="R$0,00"
						className="w-24"
						defaultValue="10000"
						value={maxPrice !== undefined ? String(maxPrice) : "10000"}
						onValueChange={(_, unmasked) => {
							const val = unmasked.replace(/\D/g, "");
							setMaxPrice(val ? Number(val) : undefined);
						}}
					/>
				</div>
				<Slider
					className="mt-4"
					step={1}
					min={0}
					max={10000}
					value={[minPrice ?? 0, maxPrice ?? 10000]}
					onValueChange={([min, max]) => {
						setMinPrice(min);
						setMaxPrice(max);
					}}
				/>
				<div>
					<p className="mt-4 mb-2">Categorias:</p>
					<div className="flex flex-col gap-2">
						{CATEGORIES.map((cat) => (
							<Field orientation="horizontal" key={cat.value}>
								<Checkbox
									id={`cat-${cat.value}`}
									checked={categories.includes(cat.value)}
									onCheckedChange={() => handleCategoryChange(cat.value)}
								/>
								<FieldLabel
									htmlFor={`cat-${cat.value}`}
									className="font-normal"
								>
									{cat.label}
								</FieldLabel>
							</Field>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
