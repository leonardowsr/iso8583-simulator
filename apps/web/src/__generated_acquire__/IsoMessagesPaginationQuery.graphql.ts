/**
 * @generated SignedSource<<1c4a6cc78756cd39b836649de3e93e03>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IsoMessagesPaginationQuery$variables = {
  after?: string | null | undefined;
  direction?: string | null | undefined;
  first?: number | null | undefined;
};
export type IsoMessagesPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"isoMessagesListFragment">;
};
export type IsoMessagesPaginationQuery = {
  response: IsoMessagesPaginationQuery$data;
  variables: IsoMessagesPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": "in",
    "kind": "LocalArgument",
    "name": "direction"
  },
  {
    "defaultValue": 20,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "direction",
    "variableName": "direction"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "idempotencyKey",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rawContent",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isoResponseCode",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "direction",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transactionId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IsoMessagesPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "isoMessagesListFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IsoMessagesPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "IsoMessageConnection",
        "kind": "LinkedField",
        "name": "isoMessages",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IsoMessageEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "IsoMessage",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IsoMessage",
                    "kind": "LinkedField",
                    "name": "relatedMessage",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v3/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ClientExtension",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__id",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": [
          "direction"
        ],
        "handle": "connection",
        "key": "pages_isoMessages",
        "kind": "LinkedHandle",
        "name": "isoMessages"
      }
    ]
  },
  "params": {
    "cacheID": "109dcef8d3cf2bd07b164df4d84e0f2a",
    "id": null,
    "metadata": {},
    "name": "IsoMessagesPaginationQuery",
    "operationKind": "query",
    "text": "query IsoMessagesPaginationQuery(\n  $after: String\n  $direction: String = \"in\"\n  $first: Int = 20\n) {\n  ...isoMessagesListFragment_1exh8A\n}\n\nfragment isoMessageItemFragment on IsoMessage {\n  id\n  rawContent\n  isoResponseCode\n  direction\n  transactionId\n  idempotencyKey\n  createdAt\n  relatedMessage {\n    id\n    rawContent\n    isoResponseCode\n    direction\n    transactionId\n    idempotencyKey\n    createdAt\n  }\n}\n\nfragment isoMessagesListFragment_1exh8A on Query {\n  isoMessages(first: $first, after: $after, direction: $direction) {\n    edges {\n      node {\n        id\n        idempotencyKey\n        ...isoMessageItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3870b0cfafc36670066474ff63fb8fe4";

export default node;
