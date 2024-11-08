import { defineConfig } from "parallel-wait-run";

export default defineConfig({
  scripts: [
    {
      name: "web:dev",
      command: "pnpm web:dev",
    },
    {
      name: "prisma:studio",
      command: "pnpm prisma studio",
    },
  ],
});
