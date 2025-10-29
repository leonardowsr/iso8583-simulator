/**
 * @generated SignedSource<<06323876593a267f140dfcb2d460f639>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type isoMessageItemFragment$data = {
  readonly createdAt: string | null | undefined;
  readonly direction: string | null | undefined;
  readonly id: string;
  readonly idempotencyKey: string | null | undefined;
  readonly isoResponseCode: string | null | undefined;
  readonly rawContent: string | null | undefined;
  readonly transactionId: string | null | undefined;
  readonly " $fragmentType": "isoMessageItemFragment";
};
export type isoMessageItemFragment$key = {
  readonly " $data"?: isoMessageItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"isoMessageItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "isoMessageItemFragment",
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
  "type": "IsoMessage",
  "abstractKey": null
};

(node as any).hash = "669d5b0e65a177d3867160401b9f8fb1";

export default node;
