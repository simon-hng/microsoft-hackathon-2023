import { env } from "@/env.mjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";

export const embeddingsModel = new OpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_EMBEDDINGS_MODEL,
});

export const getVectorStore = async () => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddingsModel,
    {
      url: env.QDRANT_URL,
      apiKey: env.QDRANT_TOKEN,
      collectionName: env.QDRANT_COLLECTION_NAME,
    },
  );

  return vectorStore;
}
