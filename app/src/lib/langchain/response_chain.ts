import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { openai } from "../openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const LANGUAGE_PROMPT = `Can you tell me what language this email is written in?

Student Email:
{message}

AI:`;

const TRANSLATE_PROMPT = `Can you please translate this text to {language}

Student email:
{message}

AI:`;

const model = openai;

const language_prompt = PromptTemplate.fromTemplate(LANGUAGE_PROMPT);
const translate_prompt = PromptTemplate.fromTemplate(TRANSLATE_PROMPT);
const llm = new LLMChain({ prompt: language_prompt, llm: model});

