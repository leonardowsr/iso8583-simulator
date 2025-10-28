/**
 * @generated SignedSource<<242cbd36db3deab3f61b7b1247f796a2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type loginFormUserQuery$variables = Record<PropertyKey, never>;
export type loginFormUserQuery$data = {
  readonly users: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly email: string | null | undefined;
        readonly id: string;
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type loginFormUserQuery = {
  response: loginFormUserQuery$data;
  variables: loginFormUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 1
      }
    ],
    "concreteType": "UserConnection",
    "kind": "LinkedField",
    "name": "users",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UserEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "node",
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
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "users(first:1)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "loginFormUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "loginFormUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "5762c38a87c8e6e2d704795bed791794",
    "id": null,
    "metadata": {},
    "name": "loginFormUserQuery",
    "operationKind": "query",
    "text": "query loginFormUserQuery {\n  users(first: 1) {\n    edges {\n      node {\n        id\n        name\n        email\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b5f65b4f9f2f44814cf99a6c64f33e04";

export default node;
