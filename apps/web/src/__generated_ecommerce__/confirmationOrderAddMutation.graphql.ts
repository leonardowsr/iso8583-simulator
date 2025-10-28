/**
 * @generated SignedSource<<e0fef9faf883130bcb3cc069267a3efb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrderAddInput = {
  clientMutationId?: string | null | undefined;
  items?: ReadonlyArray<OrderItemInput | null | undefined> | null | undefined;
  userId?: string | null | undefined;
};
export type OrderItemInput = {
  price?: number | null | undefined;
  productId?: string | null | undefined;
  productName?: string | null | undefined;
  quantity?: number | null | undefined;
};
export type confirmationOrderAddMutation$variables = {
  input: OrderAddInput;
};
export type confirmationOrderAddMutation$data = {
  readonly orderAdd: {
    readonly order: {
      readonly id: string;
      readonly userId: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type confirmationOrderAddMutation = {
  response: confirmationOrderAddMutation$data;
  variables: confirmationOrderAddMutation$variables;
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
    "concreteType": "OrderAddPayload",
    "kind": "LinkedField",
    "name": "orderAdd",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Order",
        "kind": "LinkedField",
        "name": "order",
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
            "name": "userId",
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
    "name": "confirmationOrderAddMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "confirmationOrderAddMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "35bbcd6f49f69ff3593f5c81d27a78f3",
    "id": null,
    "metadata": {},
    "name": "confirmationOrderAddMutation",
    "operationKind": "mutation",
    "text": "mutation confirmationOrderAddMutation(\n  $input: OrderAddInput!\n) {\n  orderAdd(input: $input) {\n    order {\n      id\n      userId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9bb79ca80bc1c41e53e9766c1490a292";

export default node;
