// a nextjs route for creating a qdrant test-collection and populate it with hardcoded data
import {NextRequest, NextResponse} from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({ host: "localhost", port: 6333 });

const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
});

// Post Function that creates a qdrant collection and populates it with hardcoded data
export async function POST(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json(
            {
                message: `Error: ${error instanceof (Error) ? error.message : error
                }`
            },
            {status: 500}
        );
    }
}

async function createTestCollection() {
    const collection = await client.createCollection(
        "test-collection",
        {vectors: { size: 4, distance: "Cosine" }},
    )
}