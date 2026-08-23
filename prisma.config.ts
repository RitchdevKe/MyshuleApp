import { defineConfig } from '@prisma/config';

export default defineConfig({
  // @ts-ignore
  migrate: {
    url: process.env.DATABASE_URL,
  },
});
