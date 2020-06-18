import { Application, organ } from "./deps.ts";
import router from "./router.ts";

const app = new Application();

app
  .use(organ("debug"))
  .use(router.routes())
  .use(router.allowedMethods());

export default app;

if (import.meta.main) {
  await app.listen({ port: 3000 });
}
