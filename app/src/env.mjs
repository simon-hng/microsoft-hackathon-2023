import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AZURE_OPENAI_API_KEY: z.string().min(1),
    AZURE_OPENAI_RESOURCE: z.string().min(1),
    AZURE_OPENAI_MODEL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_RESOURCE: process.env.AZURE_OPENAI_RESOURCE,
    AZURE_OPENAI_MODEL: process.env.AZURE_OPENAI_MODEL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
