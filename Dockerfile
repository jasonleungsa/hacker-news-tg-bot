FROM hayd/alpine-deno:1.1.0

ARG TELEGRAM_API_KEY
ENV TELEGRAM_API_KEY=$TELEGRAM_API_KEY

EXPOSE 3000

USER deno

COPY ./dist/server.js .

CMD ["run", "--allow-net", "--allow-env", "server.js"]
