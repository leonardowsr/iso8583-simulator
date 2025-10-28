/**
 * @generated SignedSource<<616acf298041008a431cd44779c86f5b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type product_product$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly images: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly name: string | null | undefined;
  readonly price: number | null | undefined;
  readonly slug: string | null | undefined;
  readonly " $fragmentType": "product_product";
};
export type product_product$key = {
  readonly " $data"?: product_product$data;
  readonly " $fragmentSpreads": FragmentRefs<"product_product">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "product_product",
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
  "type": "Product",
  "abstractKey": null
};

(node as any).hash = "c33771b7f233836a739f9e9a3f92132e";

export default node;
