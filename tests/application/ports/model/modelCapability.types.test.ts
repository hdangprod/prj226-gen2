import { describe, expectTypeOf, it } from "vitest";
import type {
  ModelCapabilityPort,
  ModelCapabilityRequest,
  ModelCapabilityResult,
  BoundedModelContext,
} from "../../../../src/application/ports/model/modelCapability";

describe("Model Capability Port authority boundary", () => {
  it("prevents structural construction of opaque boundary values", () => {
    // @ts-expect-error the private symbol brand can only be supplied by the bounded-context factory
    const fabricatedContext: BoundedModelContext = {
      items: [],
      itemLimit: 0,
      selectionReason: "synthetic" as never,
    };
    // @ts-expect-error the private symbol brand can only be supplied by the request factory
    const fabricatedRequest: ModelCapabilityRequest = {
      capability: "generate-advice",
      interaction: "synthetic" as never,
      context: fabricatedContext,
    };
    expectTypeOf(fabricatedRequest).toMatchTypeOf<ModelCapabilityRequest>();
  });

  it("exposes only request-to-non-authoritative-result execution", () => {
    expectTypeOf<ModelCapabilityPort>().toEqualTypeOf<{
      execute(request: ModelCapabilityRequest): Promise<ModelCapabilityResult>;
    }>();
    expectTypeOf<ModelCapabilityRequest>().not.toHaveProperty("credentials");
    expectTypeOf<ModelCapabilityRequest>().not.toHaveProperty("history");
    expectTypeOf<ModelCapabilityRequest>().not.toHaveProperty("trustedInteractionIngress");
    expectTypeOf<ModelCapabilityResult>().not.toHaveProperty("authorization");
    expectTypeOf<ModelCapabilityResult>().not.toHaveProperty("trustedInteractionEvidence");
  });
});
