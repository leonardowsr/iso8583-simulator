/**
 * @generated SignedSource<<33b0b098a561f0e9ca7240b96a0efe95>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TransactionAddInput = {
  amount: number;
  cardCvv: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardHolderName: string;
  cardNumber: string;
  clientMutationId?: string | null | undefined;
  idempotencyKey: string;
  orderRef: string;
  userId: string;
};
export type confirmationTransactionAddMutation$variables = {
  input: TransactionAddInput;
};
export type confirmationTransactionAddMutation$data = {
  readonly TransactionAdd: {
    readonly transaction: {
      readonly amount: number | null | undefined;
      readonly id: string | null | undefined;
      readonly status: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type confirmationTransactionAddMutation = {
  response: confirmationTransactionAddMutation$data;
  variables: confirmationTransactionAddMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "TransactionAddPayload",
    "kind": "LinkedField",
    "name": "TransactionAdd",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Transaction",
        "kind": "LinkedField",
        "name": "transaction",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "confirmationTransactionAddMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "confirmationTransactionAddMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bec65a535519dd3bafbc175958c5914b",
    "id": null,
    "metadata": {},
    "name": "confirmationTransactionAddMutation",
    "operationKind": "mutation",
    "text": "mutation confirmationTransactionAddMutation(\n  $input: TransactionAddInput!\n) {\n  TransactionAdd(input: $input) {\n    transaction {\n      id\n      amount\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6b2ae6259e897fced89e9146d768b9b4";

export default node;
