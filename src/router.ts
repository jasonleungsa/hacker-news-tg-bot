import { Router } from "./deps.ts";
import HackerNewsService from "./services/HackerNewsService.ts";
import TelegramService from "./services/TelegramService.ts";
import BotService from "./services/BotService.ts";

const router = new Router();

const telegram = new TelegramService(
  Deno.env.get("TELEGRAM_API_KEY") as string,
);
const hackerNews = new HackerNewsService();
const bot = new BotService(telegram, hackerNews);

router
  .get("/health", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/health+json");
    ctx.response.body = {
      status: "pass",
    };
  })
  .post("/", async (ctx) => {
    const { value: params } = await ctx.request.body();

    if (params.message.text.startsWith("/news")) {
      await bot.runNewsCommand(params.message.chat.id);
    }

    ctx.response.body = {};
  });

export default router;
