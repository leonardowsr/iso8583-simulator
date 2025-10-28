import type { BaseContext } from "@entria/graphql-mongo-helpers/lib/createLoader";
import type DataLoader from "dataloader";
import type { ICategory } from "../modules/category/CategoryModel";
import type { IOrder } from "../modules/order/OrderModel";
import type { IProduct } from "../modules/product/ProductModel";

export type Dataloaders = {
	ProductLoader: DataLoader<string, IProduct>;
	CategoryLoader: DataLoader<string, ICategory>;
	OrderLoader: DataLoader<string, IOrder>;
};

export type GQLContext = BaseContext<
	"ProductLoader" | "CategoryLoader" | "OrderLoader",
	IProduct | ICategory | IOrder
> & {
	dataloaders: Dataloaders;
};
