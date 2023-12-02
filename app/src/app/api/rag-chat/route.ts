import {NextRequest, NextResponse} from "next/server";
import {env} from "@/env.mjs";

import { PromptTemplate } from "langchain/prompts";
import {
    RunnableSequence,
    RunnablePassthrough,
} from "langchain/schema/runnable";

import {ChatOpenAI} from "langchain/chat_models/openai";

import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {QdrantVectorStore} from "langchain/vectorstores/qdrant";
import {StringOutputParser} from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const gptModel = new ChatOpenAI({
    temperature: 0.7,
    azureOpenAIApiKey: env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: "2023-06-01-preview",
    azureOpenAIApiInstanceName: env.AZURE_OPENAI_RESOURCE,
    azureOpenAIApiDeploymentName: env.AZURE_OPENAI_MODEL,
});

const embeddingsModel = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_EMBEDDINGS_MODEL,
});

const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate
);

const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);
const formatChatHistory = (chatHistory: [string, string][]) => {
    const formattedDialogueTurns = chatHistory.map(
        (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    );
    return formattedDialogueTurns.join("\n");
};

//Chat with Conversational Retrieval Chain
export async function POST(request: NextRequest) {

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddingsModel,
        {
            url: env.QDRANT_URL,
            apiKey: env.QDRANT_TOKEN,
            collectionName: env.QDRANT_COLLECTION_NAME,
        }
    );

    const retriever = vectorStore.asRetriever()

    type ConversationalRetrievalQAChainInput = {
        question: string;
        chat_history: [string, string][];
    };

    const standaloneQuestionChain = RunnableSequence.from([
        {
            question: (input: ConversationalRetrievalQAChainInput) => input.question,
            chat_history: (input: ConversationalRetrievalQAChainInput) =>
                formatChatHistory(input.chat_history),
        },
        CONDENSE_QUESTION_PROMPT,
        gptModel,
        new StringOutputParser(),
    ]);


    const answerChain = RunnableSequence.from([
        {
            context: retriever.pipe(
                // @ts-ignore
                formatDocumentsAsString
            ),
            question: new RunnablePassthrough(),
        },
        ANSWER_PROMPT,
        gptModel,
    ]);

    const conversationalRetrievalQAChain =
        standaloneQuestionChain.pipe(answerChain);

    const body = await request.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const stream = await conversationalRetrievalQAChain.stream({
        chat_history: formattedPreviousMessages,
        question: currentMessageContent,
    });

    return new StreamingTextResponse(stream);

}
