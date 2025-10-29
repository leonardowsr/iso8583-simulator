/**
 * @generated SignedSource<<0352172d6d9b972388b553f02bad452c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IsoMessageAddedInput = {
  clientSubscriptionId?: string | null | undefined;
};
export type useIsoMessageAddedSubscription$variables = {
  connections: ReadonlyArray<string>;
  input: IsoMessageAddedInput;
};
export type useIsoMessageAddedSubscription$data = {
  readonly IsoMessageAdded: {
    readonly isoMessage: {
      readonly createdAt: string | null | undefined;
      readonly direction: string | null | undefined;
      readonly id: string;
      readonly idempotencyKey: string | null | undefined;
      readonly isoResponseCode: string | null | undefined;
      readonly rawContent: string | null | undefined;
      readonly transactionId: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type useIsoMessageAddedSubscription = {
  response: useIsoMessageAddedSubscription$data;
  variables: useIsoMessageAddedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "IsoMessage",
  "kind": "LinkedField",
  "name": "isoMessage",
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
      "name": "rawContent",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isoResponseCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "direction",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "transactionId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "idempotencyKey",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useIsoMessageAddedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "IsoMessageAddedPayload",
        "kind": "LinkedField",
        "name": "IsoMessageAdded",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useIsoMessageAddedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "IsoMessageAddedPayload",
        "kind": "LinkedField",
        "name": "IsoMessageAdded",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "isoMessage",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "IsoMessageEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "41bca3c946c9b4d37f2ff220068403f2",
    "id": null,
    "metadata": {},
    "name": "useIsoMessageAddedSubscription",
    "operationKind": "subscription",
    "text": "subscription useIsoMessageAddedSubscription(\n  $input: IsoMessageAddedInput!\n) {\n  IsoMessageAdded(input: $input) {\n    isoMessage {\n      id\n      rawContent\n      isoResponseCode\n      direction\n      transactionId\n      idempotencyKey\n      createdAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "511be5e3bfd4fc5b8e5e9028cdc61dec";

export default node;
