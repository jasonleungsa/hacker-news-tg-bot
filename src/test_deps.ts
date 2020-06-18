export { delay } from "https://deno.land/std@0.57.0/async/delay.ts";
export { readJsonSync } from "https://deno.land/std@0.57.0/fs/mod.ts";
import { mock } from "https://deno.land/x/expect@v0.2.1/mod.ts";
export { expect, it } from "https://deno.land/x/expect@v0.2.1/mod.ts";
export { superoak } from "https://deno.land/x/superoak@1.0.2/mod.ts";

export type NockRequests = {
  url: string;
  response: {
    status: number;
    body: string | object;
  };
};

const nock = (requests: NockRequests[]) => {
  const originalFetch = window.fetch;
  window.fetch = mock.fn(async (input: string, init: any) => {
    const headers = new Headers();
    const request = requests.find(({ url }) => url === input);

    if (!request) {
      return await originalFetch(input, init);
    }

    const isJson = typeof request.response.body === "object";

    if (isJson) {
      headers.append("Content-Type", "application/json");
    }

    return Promise.resolve({
      headers,
      ok: request.response.status < 400,
      status: request.response.status,
      text: () =>
        Promise.resolve(
          isJson
            ? JSON.stringify(request.response.body)
            : request.response.body,
        ),
    } as Response);
  });

  return {
    destroy: () => {
      window.fetch = originalFetch;
    },
  };
};

export { mock, nock };
