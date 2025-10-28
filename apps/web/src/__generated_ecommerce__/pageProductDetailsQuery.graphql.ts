/**
 * @generated SignedSource<<b6b96cb9d3a6a3941fd5d3f01a222717>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type pageProductDetailsQuery$variables = {
  slug: string;
};
export type pageProductDetailsQuery$data = {
  readonly productBySlug: {
    readonly description: string | null | undefined;
    readonly id: string;
    readonly images: ReadonlyArray<string | null | undefined> | null | undefined;
    readonly name: string | null | undefined;
    readonly price: number | null | undefined;
    readonly slug: string | null | undefined;
  } | null | undefined;
};
export type pageProductDetailsQuery = {
  response: pageProductDetailsQuery$data;
  variables: pageProductDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "slug",
        "variableName": "slug"
      }
    ],
    "concreteType": "Product",
    "kind": "LinkedField",
    "name": "productBySlug",
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
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "price",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "slug",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "images",
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
    "name": "pageProductDetailsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageProductDetailsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "650ee536417bbb74c99f25a678cb9f56",
    "id": null,
    "metadata": {},
    "name": "pageProductDetailsQuery",
    "operationKind": "query",
    "text": "query pageProductDetailsQuery(\n  $slug: String!\n) {\n  productBySlug(slug: $slug) {\n    id\n    name\n    description\n    price\n    slug\n    images\n  }\n}\n"
  }
};
})();

(node as any).hash = "c2de231e88def6b2fc9420b0f5ec9a17";

export default node;
