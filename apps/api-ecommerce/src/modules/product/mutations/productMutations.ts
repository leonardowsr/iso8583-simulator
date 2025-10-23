import { ProductAddMutation } from "./ProductAddMutation";
import { ProductDeleteMutation } from "./ProductDeleteMutation";
import { ProductUpdateMutation } from "./ProductUpdateMutation";

export const productMutations = {
	ProductAdd: ProductAddMutation,
	ProductUpdate: ProductUpdateMutation,
	ProductDelete: ProductDeleteMutation,
};
