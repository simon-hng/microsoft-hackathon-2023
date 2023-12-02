import { PromptTemplate } from "langchain/prompts";
import { openai } from "../models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const TEMPLATE = `You are a helpful support bot that helps students at TUM

Current conversation:
{chat_history}

User: {input}
AI:`;

const prompt = PromptTemplate.fromTemplate(TEMPLATE);
/**
 * See a full list of supported models at:
 * https://js.langchain.com/docs/modules/model_io/models/
 */
const model = openai;
/**
 * Chat models stream message chunks rather than bytes, so this
 * output parser handles serialization and encoding.
 */
const outputParser = new BytesOutputParser();

/*
 * Can also initialize as:
 *
 * import { RunnableSequence } from "langchain/schema/runnable";
 * const chain = RunnableSequence.from([prompt, model, outputParser]);
 */
export const retrievalChain = prompt.pipe(model).pipe(outputParser);
