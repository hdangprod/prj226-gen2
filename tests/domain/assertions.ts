export function requireResult<Value, Kind extends string>(
  result: { readonly kind: Kind; readonly value: Value } | { readonly kind: string },
  expectedKind: Kind,
): Value {
  if (result.kind !== expectedKind || !("value" in result)) {
    throw new Error(`Expected ${expectedKind}, received ${result.kind}`);
  }
  return result.value;
}
