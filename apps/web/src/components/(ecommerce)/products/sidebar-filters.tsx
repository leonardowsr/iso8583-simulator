"use client";
import { Trash } from "lucide-react";
import { debounce } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { sidebarFilters_categories$key } from "@/__generated_ecommerce__/sidebarFilters_categories.graphql";
import { useCategoryFilterParam } from "@/hooks/use-category-filter-param";
import { usePriceFilterParam } from "@/hooks/use-price-filter-param";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Field, FieldLabel } from "../../ui/field";
import { MaskInput } from "../../ui/mask-input";
import { Slider } from "../../ui/slider";

export const SidebarCategoriesFragment = graphql`
	fragment sidebarFilters_categories on Query {
		categories {
			edges {
				node {
					id
					name
					slug
				}
			}
		}
	}
`;

interface Props {
	fragmentRef: sidebarFilters_categories$key;
}
export function SidebarFilters({ fragmentRef }: Props) {
	const data = useFragment(SidebarCategoriesFragment, fragmentRef);

	const { categories, setCategories, clearCategories } =
		useCategoryFilterParam();
	const { minPrice, maxPrice, setMinPrice, setMaxPrice, clearPrice } =
		usePriceFilterParam();

	// combined local state for immediate UI response
	const [local, setLocal] = useState<{
		minInput: string;
		maxInput: string;
		sliderValue: [number, number];
	}>(() => ({
		minInput: minPrice !== undefined ? String(minPrice) : "",
		maxInput: maxPrice !== undefined ? String(maxPrice) : "10000",
		sliderValue: [minPrice ?? 0, maxPrice ?? 10000],
	}));

	// keep local UI in sync if external values change (e.g. clear)
	useEffect(() => {
		setLocal((s) => ({
			...s,
			minInput: minPrice !== undefined ? String(minPrice) : "",
			sliderValue: [minPrice ?? 0, s.sliderValue[1]],
		}));
	}, [minPrice]);
	useEffect(() => {
		setLocal((s) => ({
			...s,
			maxInput: maxPrice !== undefined ? String(maxPrice) : "10000",
			sliderValue: [s.sliderValue[0], maxPrice ?? 10000],
		}));
	}, [maxPrice]);

	const debouncedLimit = useCallback(() => debounce(300), []);
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
						value={local.minInput}
						onValueChange={(_, unmasked) => {
							const digits = unmasked.replace(/\D/g, "");
							setLocal((s) => ({ ...s, minInput: digits }));
							const val = digits ? Number(digits) : undefined;
							// send debounced URL update
							setMinPrice(val, { limitUrlUpdates: debouncedLimit() });
						}}
					/>
					{"-"}
					<MaskInput
						mask="currency"
						placeholder="R$0,00"
						className="w-24"
						defaultValue="10000"
						value={local.maxInput}
						onValueChange={(_, unmasked) => {
							const digits = unmasked.replace(/\D/g, "");
							setLocal((s) => ({ ...s, maxInput: digits }));
							const val = digits ? Number(digits) : undefined;
							setMaxPrice(val, { limitUrlUpdates: debouncedLimit() });
						}}
					/>
				</div>
				<Slider
					className="mt-4"
					step={1}
					min={0}
					max={10000}
					value={local.sliderValue}
					onValueChange={([min, max]) => {
						// immediate UI update
						setLocal((s) => ({ ...s, sliderValue: [min, max] }));
						// debounced URL updates
						setMinPrice(min, { limitUrlUpdates: debouncedLimit() });
						setMaxPrice(max, { limitUrlUpdates: debouncedLimit() });
					}}
				/>
				<div>
					<p className="mt-4 mb-2">Categorias:</p>
					<div className="flex flex-col gap-2">
						{data.categories.edges.map(({ node: cat }) => (
							<Field orientation="horizontal" key={cat.id}>
								<Checkbox
									id={`cat-${cat.slug}`}
									checked={categories.includes(cat.slug)}
									onCheckedChange={() => handleCategoryChange(cat.slug)}
								/>
								<FieldLabel htmlFor={`cat-${cat.slug}`} className="font-normal">
									{cat.name}
								</FieldLabel>
							</Field>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
