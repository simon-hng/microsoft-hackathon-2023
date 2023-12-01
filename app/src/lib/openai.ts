import { env } from "@/env.mjs";
import OpenAI from "openai";

// const resource = env.AZURE_OPENAI_RESOURCE;
// const model = env.AZURE_OPENAI_MODEL;
// const apiKey = env.AZURE_OPENAI_API_KEY;

// export const openai = new OpenAI({
//   apiKey,
//   baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
//   defaultQuery: { "api-version": "2023-06-01-preview" },
//   defaultHeaders: { "api-key": apiKey },
// });

// Create an OpenAI API client (that's edge friendly!)
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});
