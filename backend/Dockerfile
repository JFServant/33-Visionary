FROM oven/bun:1.2.20

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run env:demo

EXPOSE 49321

CMD ["bun", "start"]
