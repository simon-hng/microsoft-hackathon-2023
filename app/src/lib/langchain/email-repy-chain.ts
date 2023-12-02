import { PromptTemplate } from "langchain/prompts";
import { gptModel } from "../models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const CREATE_ANSWER = `Given the following input information, create an answer email for a student inquiry.

Original Question from Student: {email}

Top 3 Match Answers from Vector Database:
    Answer 1: {vdb_answer_1}
    Answer 2: {vdb_answer_2}
    Answer 3: {vdb_answer_3}

Tasks:
Review the student's original question and the filename of any attachments to understand the context and specific needs.
Evaluate the top 3 match answers from the vector database to determine which one best addresses the student's inquiry.
Select the most appropriate answer from the vector database. Consider aspects like relevance, completeness, and accuracy in relation to the student's question.
Refactor the chosen answer to enhance its informativeness. Ensure that the refactored answer:
    Directly addresses the student's question.
    Is clear, concise, and specific.
    Incorporates any relevant information from the email attachments, if applicable.
    Is structured in a friendly and professional tone suitable for email communication with a student.

Output:
Compose the answer email using the refactored and selected answer, ensuring it is tailored to the student's specific inquiry and presented in a manner that is easy to understand.`;

const createAnswer = PromptTemplate.fromTemplate(CREATE_ANSWER);
/**
 * See a full list of supported models at:
 * https://js.langchain.com/docs/modules/model_io/models/
 */
const model = gptModel;
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
export const emailReplyChain = createAnswer.pipe(model).pipe(outputParser);
