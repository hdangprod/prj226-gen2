export interface D1RunResult {
  readonly success: boolean;
  readonly meta?: {
    readonly changes?: number;
  };
}

export interface D1PreparedStatement {
  bind(...values: readonly unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
  batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]>;
}
