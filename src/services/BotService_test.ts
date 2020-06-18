import { it, mock, expect, readJsonSync, delay } from "../test_deps.ts";
import BotService from "./BotService.ts";
import TelegramService from "./TelegramService.ts";
import HackerNewsService from "./HackerNewsService.ts";
import { HackerNewsStory } from "./types.ts";

const hackerNewsFixture = readJsonSync(
  "./src/services/__fixtures__/hackerNews.json",
) as HackerNewsStory[];

it("runNewsCommand", async () => {
  const story = hackerNewsFixture[0];
  const mockTelegram = {
    sendMessage: mock.fn(),
  } as TelegramService;
  const mockHackNews = {
    getNewStories: mock.fn(() => [story]),
  } as HackerNewsService;

  const bot = new BotService(mockTelegram, mockHackNews);
  bot.runNewsCommand(123);

  await delay(1);

  expect(mockTelegram.sendMessage).toHaveBeenCalledTimes(1);
  expect(mockTelegram.sendMessage).toHaveBeenCalledWith({
    chat_id: 123,
    text: `${story.title}\nBy: ${story.by}\n${story.url}`,
  });
});
