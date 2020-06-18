import { it, expect, readJsonSync, nock } from "../test_deps.ts";
import HackerNewsService, { generateStoryUrl } from "./HackerNewsService.ts";
import { HackerNewsStory } from "./types.ts";

const hackerNewsFixture = readJsonSync(
  "./src/services/__fixtures__/hackerNews.json",
) as HackerNewsStory[];
const story = hackerNewsFixture[0];

it("should generate single item url", () => {
  expect(generateStoryUrl(123))
    .toBe("https://hacker-news.firebaseio.com/v0/item/123.json");
});

it("HackerNewsService#getStories", async () => {
  const mockFetch = nock([{
    url: `https://hacker-news.firebaseio.com/v0/item/${story.id}.json`,
    response: {
      status: 200,
      body: story,
    },
  }]);

  const service = new HackerNewsService();
  const response = await service.getStories([story.id]);
  expect(response).toEqual([story]);

  mockFetch.destroy();
});

it("HackerNewsService#getStories", async () => {
  const mockFetch = nock([{
    url: "https://hacker-news.firebaseio.com/v0/newstories.json",
    response: {
      status: 200,
      body: [story.id],
    },
  }, {
    url: `https://hacker-news.firebaseio.com/v0/item/${story.id}.json`,
    response: {
      status: 200,
      body: story,
    },
  }]);

  const service = new HackerNewsService();
  expect(await service.getNewStories()).toEqual([story]);

  mockFetch.destroy();
});
