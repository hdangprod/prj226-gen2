import type { D1DatabaseLike, D1PreparedStatement, D1RunResult } from "../../../src/infrastructure/d1/d1Types";

export interface RecordedStatement {
  readonly query: string;
  readonly bindings: readonly unknown[];
}

class FakeStatement implements D1PreparedStatement {
  constructor(readonly query: string, readonly bindings: readonly unknown[] = []) {}
  bind(...values: readonly unknown[]): D1PreparedStatement {
    return new FakeStatement(this.query, values);
  }
}

export class FakeD1 implements D1DatabaseLike {
  readonly batches: RecordedStatement[][] = [];
  readonly receipts = new Map<string, string>();
  failBatch: unknown;
  partialResult = false;

  prepare(query: string): D1PreparedStatement {
    return new FakeStatement(query);
  }

  async batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]> {
    const recorded = statements as readonly FakeStatement[];
    this.batches.push(recorded.map(({ query, bindings }) => ({ query, bindings })));
    if (this.failBatch !== undefined) throw this.failBatch;
    const receipt = recorded.at(-1);
    if (receipt?.query.includes("persistence_operations")) {
      const [operationId, fingerprint] = receipt.bindings as [string, string];
      if (this.receipts.has(operationId)) throw new Error("UNIQUE constraint failed");
      this.receipts.set(operationId, fingerprint);
    }
    return recorded.map((_, index) => ({ success: !(this.partialResult && index === 0) }));
  }

  async first<T>(_query: string, ...bindings: readonly unknown[]): Promise<T | null> {
    const fingerprint = this.receipts.get(String(bindings[0]));
    return fingerprint === undefined ? null : ({ fingerprint } as T);
  }
}
