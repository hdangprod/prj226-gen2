import type {
  ModelCapabilityPort,
  ModelCapabilityRequest,
  ModelCapabilityResult,
} from "../../application/ports/model/modelCapability";

export interface ModelInvocation {
  readonly request: ModelCapabilityRequest;
}

export class DeterministicModelCapability implements ModelCapabilityPort {
  readonly invocations: ModelInvocation[] = [];
  private nextIndex = 0;

  constructor(private readonly results: readonly ModelCapabilityResult[]) {
    if (results.length === 0) {
      throw new Error("DeterministicModelCapability requires at least one result");
    }
  }

  async execute(request: ModelCapabilityRequest): Promise<ModelCapabilityResult> {
    this.invocations.push({ request });
    const result = this.results[Math.min(this.nextIndex, this.results.length - 1)];
    this.nextIndex += 1;
    return result;
  }
}
