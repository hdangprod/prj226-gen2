import type {
  WorkersAiBindingLike,
  WorkersAiInvocationInput,
} from "../../../../src/infrastructure/adapters/model/workersAiTypes";

export interface WorkersAiInvocation {
  readonly model: string;
  readonly input: WorkersAiInvocationInput;
}

export class FakeWorkersAiBinding implements WorkersAiBindingLike {
  readonly invocations: WorkersAiInvocation[] = [];

  constructor(private readonly response: unknown | (() => unknown | Promise<unknown>)) {}

  async run(model: string, input: WorkersAiInvocationInput): Promise<unknown> {
    this.invocations.push({ model, input });
    return typeof this.response === "function" ? this.response() : this.response;
  }
}
