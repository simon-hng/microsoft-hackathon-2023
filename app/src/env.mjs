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
});
