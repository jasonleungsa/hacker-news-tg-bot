import { soxa } from "../deps.ts";
import { TelegramApiMethods, TelegramApiSendMessagePayload } from "./types.ts";

export default class TelegramService {
  #apiKey: string;

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  private buildEndpoint(method: TelegramApiMethods) {
    return `https://api.telegram.org/bot${this.#apiKey}/${method}`;
  }

  async sendMessage(payload: TelegramApiSendMessagePayload) {
    const { data } = await soxa.post(
      this.buildEndpoint("sendMessage"),
      payload,
    );

    return data;
  }
}
