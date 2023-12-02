import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
});

async function handleSearch(text: string) {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
            url: process.env.QDRANT_URL,
            collectionName: "test-collection",
        }
    );

    const response = await vectorStore.similaritySearch("hello", 1);
    console.log(response);
}