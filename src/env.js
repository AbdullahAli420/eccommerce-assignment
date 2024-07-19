import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    smtp_email: z.string(),
    smtp_url: z.string(),
    api_key: z.string(),
    salt_code: z.string(),
    JWT_SECRET_KEY: z.string(),
    TOKEN_HEADER_KEY : z.string(),
    smtp_user: z.string(),
    smtp_password: z.string(),
    smtp_name: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    smtp_email: process.env.smtp_email,
    smtp_url: process.env.smtp_url,
    api_key: process.env.api_key,
    salt_code: process.env.salt_code,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,
    smtp_user: process.env.smtp_user,
    smtp_password: process.env.smtp_password,
    smtp_name: process.env.smtp_name,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
