// a Next.js route for creating a qdrant test-collection and populate it with hardcoded data
import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_TOKEN,
});

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_EMBEDDINGS_MODEL,
});

// Post Function that creates a qdrant collection and populates it with hardcoded data
export async function POST(request: NextRequest) {
  try {
    console.log("Creating test collection");
    await createTestCollection();
    console.log("Populating test collection");
    await populateTestCollection();
    console.log("Retrieving test results");
    let testResult = await handleTestSearch("seminar");

    console.log(testResult);

    return NextResponse.json(
      {
        message: "Successfully created and populated test collection",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error: ${error instanceof Error ? error.message : error}`,
      },
      { status: 500 },
    );
  }
}

async function createTestCollection() {
  try {
    const existingCollection = await client.getCollection("test-collection");

    if (existingCollection.status === "green") {
      console.log("Collection already exists");
    } else {
      const collection = await client.createCollection("test-collection", {
        vectors: { size: 1536, distance: "Cosine" },
      });
      console.log("Collection created:", collection);
    }
  } catch (error) {
    console.error("Couldn't interact with collection:", error);
  }
}

async function populateTestCollection() {
  const vectorStore = await QdrantVectorStore.fromTexts(
    [
      "Grundsätzlich ist Ihr Studienprogramm so strukturiert, dass Sie idealerweise jedes Semester 30 Credits erfüllen. Advanced Seminars und Other Limited Courses sind keine Pflicht, aber empfehlenswert zu belegen. Die Anzahl der Advanced Seminars bzw. Other Limited Courses, die Sie belegen können, hängt davon ab, wo Sie einen Fixplatz erhalten. Es gibt keine Vorgaben bei der Wahl Ihrer Electives, sodass Sie jegliche Module wählen können, die unter den wirtschaftswissenschaftlichen Wahlmodulen bzw. den sonstigen wirtschaftswissenschaftlichen Wahlmodulen in Ihrem Studienbaum in TUMonline aufgeführt sind.",
      "Ja, Sie können und sollten zu den Lehrveranstaltungen erscheinen, auch wenn Sie zu Vorlesungsbeginn noch nicht vollständig immatrikuliert sind. Es empfiehlt sich, die gewünschten Lehrveranstaltungen zu besuchen und sich nachträglich über TUMonline anzumelden, sobald die vollständige Immatrikulation erfolgt ist. Dies gilt besonders für Pflichtmodule, die in den ersten zwei Semestern belegt werden sollten, und für die auch Übungen und Tutorien angeboten werden, für die eine Anmeldung ebenfalls über TUMonline möglich ist. Die Immatrikulation setzt die Einreichung aller erforderlichen Dokumente voraus, einschließlich des BA-Abschlusszeugnisses, das nachgereicht werden kann, sofern dies im Zeitrahmen des ersten Semesters erfolgt.",
      "Unfortunately, if you have chosen the incorrect preferences, you are excluded from the seminar’s allocation procedure. However, you could attend the kick-off event of the seminars you are interested in, as there might be open spots due to no-shows of other students who had been allocated a place.",
    ],
    [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_TOKEN,
      collectionName: "test-collection",
    },
  );
}

async function handleTestSearch(text: string) {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_TOKEN,
      collectionName: "test-collection",
    },
  );
  return await vectorStore.similaritySearch(text, 2);
}
