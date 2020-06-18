import app from "./app.ts";
import { it, superoak, readJsonSync, nock, NockRequests, delay } from "./test_deps.ts";
import { HackerNewsStory } from "./services/types.ts";

const hackerNewsFixture = readJsonSync(
  "./src/services/__fixtures__/hackerNews.json",
) as HackerNewsStory[];
const normalizedHackNewsFixture: Record<number, HackerNewsStory> =
  hackerNewsFixture.reduce((acc: Record<number, HackerNewsStory>, current) => {
    acc[current.id] = current;
    return acc;
  }, {});
const createMockStoryRequest = (id: number): NockRequests => ({
  url: `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  response: {
    status: 200,
    body: normalizedHackNewsFixture[id],
  },
});

it("should return 200 in /health", async () => {
  const request = await superoak(app);
  await request.get("/health").expect({ status: "pass" });
});

it("should not handle if the command is not /news", async () => {
  const request = await superoak(app);
  await request
    .post("/")
    .send({
      message: {
        text: "hello",
      },
    })
    .expect({});
});

it("should handle /news command", async () => {
  const mockFetch = nock([
    {
      url: "https://hacker-news.firebaseio.com/v0/newstories.json",
      response: {
        status: 200,
        body: Object.keys(normalizedHackNewsFixture),
      },
    },
    ...Object.keys(normalizedHackNewsFixture).map((id) =>
      createMockStoryRequest(Number(id))
    ),
    {
      url: "https://api.telegram.org/bot123/sendMessage",
      response: {
        status: 200,
        body: "ok",
      },
    },
  ]);

  const request = await superoak(app);
  await request
    .post("/")
    .send({
      message: {
        chat: {
          id: 123,
        },
        text: "/news",
      },
    })
    .expect({});

  await delay(1)
});
