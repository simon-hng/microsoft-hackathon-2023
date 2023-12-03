import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AZURE_OPENAI_API_KEY: z.string().min(1),
    AZURE_OPENAI_RESOURCE: z.string().min(1),
    AZURE_OPENAI_MODEL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    QDRANT_URL: z.string().min(1),
    QDRANT_TOKEN: z.string().min(1),
    QDRANT_COLLECTION_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_JSONLINK_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_RESOURCE: process.env.AZURE_OPENAI_RESOURCE,
    AZURE_OPENAI_MODEL: process.env.AZURE_OPENAI_MODEL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    QDRANT_URL: process.env.QDRANT_URL,
    QDRANT_TOKEN: process.env.QDRANT_TOKEN,
    QDRANT_COLLECTION_NAME: process.env.QDRANT_COLLECTION_NAME,
    NEXT_PUBLIC_JSONLINK_API_KEY: process.env.NEXT_PUBLIC_JSONLINK_API_KEY,
  },
});
