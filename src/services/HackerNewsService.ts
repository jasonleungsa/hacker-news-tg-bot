import { soxa } from "../deps.ts";
import { HackerNewsStory } from "./types.ts";

export const generateStoryUrl = (storyId: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${String(storyId)}.json`;

export default class HackerNewsService {
  async getStories(storyIds: number[]) {
    const storyUrls = storyIds.map(generateStoryUrl);

    const storyRequests = await Promise.all(
      storyUrls.map((url) => soxa.get(url)),
    );

    return storyRequests.map(({ data }) => data);
  }

  async getNewStories(limit = 5): Promise<HackerNewsStory[]> {
    try {
      const { data: storyIds } = await soxa.get(
        "https://hacker-news.firebaseio.com/v0/newstories.json",
      );

      const slicedStoryIds = storyIds.slice(0, limit);

      return await this.getStories(slicedStoryIds);
    } catch (e) {
      console.log(e);
    }

    return [];
  }
}
