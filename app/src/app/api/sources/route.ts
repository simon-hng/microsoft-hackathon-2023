import { getVectorStore } from "@/lib/langchain/qdrant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const question = searchParams.get("question");

  if (!question){
    return NextResponse.json({
      error: "No question provided"
    })
  }

  const vectorStore = await getVectorStore()
  const sources = await vectorStore.similaritySearch(question, 5);

  return NextResponse.json(sources);
}
