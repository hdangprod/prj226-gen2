declare module "node:fs/promises" {
  export function readFile(path: URL, encoding: "utf8"): Promise<string>;
  export function mkdtemp(prefix: string): Promise<string>;
  export function rm(
    path: string,
    options: { readonly recursive: boolean; readonly force: boolean },
  ): Promise<void>;
}

declare module "node:crypto" {
  export function createHash(algorithm: string): {
    update(data: string | Uint8Array): {
      digest(encoding: "hex"): string;
    };
  };
}

declare module "node:os" {
  export function tmpdir(): string;
}

declare module "node:path" {
  export function join(...paths: readonly string[]): string;
}

interface ImportMeta {
  readonly url: string;
}
