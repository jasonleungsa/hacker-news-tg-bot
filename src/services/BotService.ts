import TelegramService from "./TelegramService.ts";
import HackerNewsService from "./HackerNewsService.ts";

export default class BotService {
  #telegram: TelegramService;
  #hackerNews: HackerNewsService;

  constructor(telegram: TelegramService, hackerNews: HackerNewsService) {
    this.#telegram = telegram;
    this.#hackerNews = hackerNews;
  }

  async runNewsCommand(chatId: number) {
    const stories: any = await this.#hackerNews.getNewStories(5);

    // fire-and-forget
    Promise.all(stories.map((story: any) =>
      this.#telegram.sendMessage({
        chat_id: chatId,
        text: `${story.title}\nBy: ${story.by}\n${story.url}`,
      })
    )).catch(() => {});
  }
}
