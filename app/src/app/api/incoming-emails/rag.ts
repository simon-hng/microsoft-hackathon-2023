import {QdrantVectorStore} from "langchain/vectorstores/qdrant";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_EMBEDDINGS_MODEL,
});

export async function handleQdrantSearch(text: string, limit: number = 2) {
    console.log(`Searching for ${text}`);
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_TOKEN,
            collectionName: process.env.QDRANT_COLLECTION_NAME,
        }
    );
    return await vectorStore.similaritySearch(text, limit);
}

