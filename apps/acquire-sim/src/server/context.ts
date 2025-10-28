import type { BaseContext } from "@entria/graphql-mongo-helpers/lib/createLoader";
import type DataLoader from "dataloader";
import type { IIsoMessage } from "../modules/isoMessage/isoMessageModel";
import type { ITransaction } from "../modules/transaction/TransationModel";

export type Dataloaders = {
	TransactionLoader: DataLoader<string, ITransaction>;
	IsoMessageLoader: DataLoader<string, IIsoMessage>;
};

export type GQLContext = BaseContext<
	"TransactionLoader" | "IsoMessageLoader",
	ITransaction | IIsoMessage
> & {
	dataloaders: Dataloaders;
};
