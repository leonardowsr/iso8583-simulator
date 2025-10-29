/**
 * @generated SignedSource<<52862a232e3175ee7d82c7f7fa7d75bb>>
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
  readonly relatedMessage: {
    readonly createdAt: string | null | undefined;
    readonly direction: string | null | undefined;
    readonly id: string;
    readonly idempotencyKey: string | null | undefined;
    readonly isoResponseCode: string | null | undefined;
    readonly rawContent: string | null | undefined;
    readonly transactionId: string | null | undefined;
  } | null | undefined;
  readonly transactionId: string | null | undefined;
  readonly " $fragmentType": "isoMessageItemFragment";
};
export type isoMessageItemFragment$key = {
  readonly " $data"?: isoMessageItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"isoMessageItemFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rawContent",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isoResponseCode",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "direction",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transactionId",
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
  "name": "createdAt",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "isoMessageItemFragment",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "IsoMessage",
      "kind": "LinkedField",
      "name": "relatedMessage",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "IsoMessage",
  "abstractKey": null
};
})();

(node as any).hash = "4801af59564e3ae12fbd3e98a3c5f4c9";

export default node;
