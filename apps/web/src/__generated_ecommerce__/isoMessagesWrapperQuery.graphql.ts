/**
 * @generated SignedSource<<4d39d7ba82e066c06ef0fe48d94d5d48>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type isoMessagesWrapperQuery$variables = {
  after?: string | null | undefined;
  direction?: string | null | undefined;
  first?: number | null | undefined;
};
export type isoMessagesWrapperQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"isoMessagesListFragment">;
};
export type isoMessagesWrapperQuery = {
  response: isoMessagesWrapperQuery$data;
  variables: isoMessagesWrapperQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "direction"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = [
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "idempotencyKey",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rawContent",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isoResponseCode",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "direction",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transactionId",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "isoMessagesWrapperQuery",
    "selections": [
      {
        "args": (v3/*: any*/),
        "kind": "FragmentSpread",
        "name": "isoMessagesListFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "isoMessagesWrapperQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IsoMessage",
                    "kind": "LinkedField",
                    "name": "relatedMessage",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v5/*: any*/),
                      (v10/*: any*/)
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
        "args": (v3/*: any*/),
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
    "cacheID": "5cea493d5926707a8e405557f6b4a8bf",
    "id": null,
    "metadata": {},
    "name": "isoMessagesWrapperQuery",
    "operationKind": "query",
    "text": "query isoMessagesWrapperQuery(\n  $first: Int\n  $after: String\n  $direction: String\n) {\n  ...isoMessagesListFragment_1exh8A\n}\n\nfragment isoMessageItemFragment on IsoMessage {\n  id\n  rawContent\n  isoResponseCode\n  direction\n  transactionId\n  idempotencyKey\n  createdAt\n  relatedMessage {\n    id\n    rawContent\n    isoResponseCode\n    direction\n    transactionId\n    idempotencyKey\n    createdAt\n  }\n}\n\nfragment isoMessagesListFragment_1exh8A on Query {\n  isoMessages(first: $first, after: $after, direction: $direction) {\n    edges {\n      node {\n        id\n        idempotencyKey\n        ...isoMessageItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "bf2045e387208635a2b6b19c6941d0ff";

export default node;
