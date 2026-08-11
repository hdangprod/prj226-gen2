import { describe, expect, it } from "vitest";

import worker from "../../src/index";

describe("runtime foundation Worker", () => {
  it("is reachable through the single non-mutating fetch seam", async () => {
    const response = await worker.fetch!(new Request("https://local.test/"), {}, {
      passThroughOnException() {},
      props: {},
      waitUntil() {},
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
    await expect(response.text()).resolves.toBe("Liam runtime foundation");
  });
});
