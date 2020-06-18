import { it, expect, nock } from "../test_deps.ts";
import TelegramService from "./TelegramService.ts";

it("TelegramService#sendMessage", async () => {
  const mockFetch = nock([{
    url: "https://api.telegram.org/bot123/sendMessage",
    response: {
      status: 200,
      body: "ok",
    },
  }]);

  const service = new TelegramService("123");
  expect(
    await service.sendMessage({
      chat_id: 123,
      text: "ok",
    }),
  ).toBe("ok");
});
