/**
 * The sole Liam Worker entry seam. Product behavior is intentionally absent
 * until a later authorized task introduces it behind approved boundaries.
 */
const worker: ExportedHandler = {
  fetch(): Response {
    return new Response("Liam runtime foundation", {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  },
};

export default worker;
