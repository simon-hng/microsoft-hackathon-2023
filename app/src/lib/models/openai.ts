import { env } from "@/env.mjs";
import { ChatOpenAI } from "langchain/chat_models/openai";

export const openai = new ChatOpenAI({
  temperature: 0.9,
  azureOpenAIApiKey: env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: "2023-06-01-preview",
  azureOpenAIApiInstanceName: env.AZURE_OPENAI_RESOURCE,
  azureOpenAIApiDeploymentName: env.AZURE_OPENAI_MODEL,
});
