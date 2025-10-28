import type { BaseContext } from "@entria/graphql-mongo-helpers/lib/createLoader";
import type DataLoader from "dataloader";
import type { ISpyMessage } from "../modules/spyMessage/SpyMessageModel";
import type { ITransaction } from "../modules/transaction/TransationModel";

export type Dataloaders = {
	TransactionLoader: DataLoader<string, ITransaction>;
	SpyMessageLoader: DataLoader<string, ISpyMessage>;
};

export type GQLContext = BaseContext<
	"TransactionLoader" | "SpyMessageLoader",
	ITransaction | ISpyMessage
> & {
	dataloaders: Dataloaders;
};
