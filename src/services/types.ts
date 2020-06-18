export type HackerNewsStory = {
  id: number;
  title: string;
  by: string;
  url: string;
};

export type TelegramApiMethods = "sendMessage";

export type TelegramApiSendMessagePayload = {
  chat_id: number;
  text: string;
};
