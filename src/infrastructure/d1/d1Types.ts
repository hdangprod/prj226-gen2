export interface D1RunResult {
  readonly success: boolean;
}

export interface D1PreparedStatement {
  bind(...values: readonly unknown[]): D1PreparedStatement;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
  batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]>;
  first<T>(query: string, ...bindings: readonly unknown[]): Promise<T | null>;
}
