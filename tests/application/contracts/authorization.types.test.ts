import { describe, expectTypeOf, it } from "vitest";

import type {
  ConfirmedDeletionAuthorization,
  OrdinaryMutationAuthorization,
} from "../../../src/application/contracts/humanControl";
import { applyExplicitContextSelection } from "../../../src/domain/context";
import {
  captureKnowledge,
  correctKnowledge,
} from "../../../src/domain/knowledge";
import {
  acceptContextFacts,
  acceptProgress,
  completeAction,
  completeProject,
  correctProgress,
  createAction,
  createProject,
  reopenAction,
  reopenProject,
} from "../../../src/domain/transitions";

describe("opaque authorization capabilities", () => {
  it("requires the Human Control-issued ordinary capability for accepted creation", () => {
    type AcceptedMutationAuthorization =
      | Parameters<typeof createProject>[3]
      | Parameters<typeof createAction>[4]
      | Parameters<typeof completeProject>[2]
      | Parameters<typeof reopenProject>[2]
      | Parameters<typeof completeAction>[2]
      | Parameters<typeof reopenAction>[2]
      | Parameters<typeof acceptContextFacts>[3]
      | Parameters<typeof acceptProgress>[3]
      | Parameters<typeof correctProgress>[4]
      | Parameters<typeof captureKnowledge>[3]
      | Parameters<typeof correctKnowledge>[4]
      | Parameters<typeof applyExplicitContextSelection>[3];

    expectTypeOf<AcceptedMutationAuthorization>().toEqualTypeOf<OrdinaryMutationAuthorization>();
    expectTypeOf<{ readonly kind: "ordinary-mutation-authorization" }>().not.toMatchTypeOf<OrdinaryMutationAuthorization>();
  });

  it("keeps ordinary mutation and confirmed deletion capabilities distinct", () => {
    expectTypeOf<OrdinaryMutationAuthorization>().not.toMatchTypeOf<ConfirmedDeletionAuthorization>();
    expectTypeOf<ConfirmedDeletionAuthorization>().not.toMatchTypeOf<OrdinaryMutationAuthorization>();
  });
});
