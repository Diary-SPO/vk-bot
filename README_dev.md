# vk-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun --watch run main.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

To lint:
#### First of

```bash
bun upgrade --canary
```

#### Then

```bash
bun run eslint . --ext ts --fix
```