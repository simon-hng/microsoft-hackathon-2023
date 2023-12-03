import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";

import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";

import { ChatOpenAI } from "langchain/chat_models/openai";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  Message,
} from "ai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { Document } from "langchain/dist/document";

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

const condenseQuestionTemplate = `You are the direct representative of the TUM Help Desc for School of Management. Given the following conversation and a follow up question, rephrase the follow up question to be a standalone (basically, the new question has to be contexted on the prior chat history) question, in its original language. This will help to stay on track with the follow up questions. 

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  condenseQuestionTemplate,
);

const answerTemplate = `
## Setup:
You are the direct representative of the TUM Help Desc for School of Management.
The student is reaching out to you regarding their question (studies, exchange, personal, contacts, and similar/related information).


## Tasks:
Review the student's original question, the provided relevant **Question <-> Proper Answer** pairs, and the other context provided to understand the query and specific needs.
Select the most appropriate answer based on all context. Consider aspects like relevance, completeness, and accuracy in relation to the student's question.
If you feel like you need more information (degree program, semester, etc.) to answer the question, please ask the student for it.
Refactor the chosen answer to enhance its informativeness. Ensure that the refactored answer:
    Directly addresses the student's question.
    Is clear, concise, and specific.
    CRUCIAL DISCLAIMER 1: Use as many relevant links as possible.
    CRUCIAL DISCLAIMER 2: After your answer generate action items (as bullet points). E.g., needed prepared documents, next steps, links, contacts, etc.

## Abbriviations, Programs, Contacts, and Links:
# Abbreviations:
  - SoM = School of Management
  - MGT = Managament
  - UPE = Undergraduate Program Education PM = Program Management / Program Manager
  - PC = Program Coordinator
  - GM = Grade Management
  - IO = International Office
  - BMT = Bachelor in Management and Technology = TUM BWL
  - BSMT = Bachelor in Sustainable Management and Technology
  - MMT = Master in Management and Technology = TUM BWL Master
  - MiM = Master in Management
  - MCS = Master in Consumer Science
  - MMDT = Master in Management and Digital Technology
  - FIM = Master in Finance and Information Management
  - MSMT = Master in Sustainable Management and Technology
  - MiMI = Master in Management and Innovation
  - MMDT = Master in Management and Digital Technology
  - JIP = Joint International Program
  - EEP = Entrepreneurship Exchange Program
  - STEP = Sustainable Transitions Exchange Program
  - HEC = Grand École des Hautes Études Commerciales
  - DTU = Denmarks Tekniske Universitet
  - EMBA = Executive MBA
  - BIT = Executive MBA in Business & IT
  - IBC = Executive MBA in Innovation & Business Creation
  - CST = Center for Study and Teaching
  - APSO = Allgemeinen Prüfungs- und Studienordnung = General Academic and Examination Regulations
  - FPSO = Fachspezifischen Prüfungs- und Studienordnung = Program-specific Academic and Examination Regulations
  - WTW = wirtschaftswissenschaftlich-technischen Wahlbereich
  - (A)IE = (Advanced) International Experience
  - PS = Project Studies = Projektstudium
  - GOP = Grundlagen- und Orientierungsprüfung
  - SFK = Studienfortschrittskontrolle
  - NPV = Noten- und Prüfungsverwaltung
  - PA = Prüfungsausschuss
  - PAU = Prüfungsausschuss
  - SH = Student Hub
  - MUC = Munich
  - HN = Heilbronn
  - VDASA = Vice Dean of Academic and Student Affairs
  - E&P = Economics & Policy
  - F&A = Finance & Accounting
  - I&E = Innovation & Entrepreneurship
  - MSL = Marketing, Strategy & Leadership
  - OT = Operations & Technology

# Here's the different study programs that the TUM School of Management offers:
  - Bachelor in Management & Technology (BMT) features courses in management studies as well as in natural sciences or engineering. We also call it TUM-BWL. It is available in Munich and Heilbronn campus.
  - Master in Management & Technology (MMT): consecutive to BMT
  - Master in Management & Digital Technology (MMDT) (Heilbronn): is the ideal blend of management, informatics, and technology.
  - Master in Management (MiM): is aimed exclusively at engineers and natural scientists who want to receive a wide range of skills in management, law, economics and business. Also available at TUM Campus Heilbronn.
  - Master in Consumer Science (MCS): is a truly interdisciplinary program that offers you a combination of management studies with social and consumer sciences. Students choosing this program usually have academic backgrounds in management, economics, sociology or psychology.
  - Master in Finance & Information Management (FIM): In the Finance and Information Management (FIM) master's program, students learn how to push digital technologies in finance forward and how to deal with Big Data by integrating technologies.
  - Bachelor in Sustainable Management & Technology (BSMT) (Straubing): aims to provide students with basic business knowledge for developing sustainable technologies, products, and processes. Coupled with interdisciplinary and social skills, the aim is to enable our students to support the change towards sustainable companies.
  - Master in Sustainable Management & Technology (MSMT) (Straubing): By focusing on sustainability in entrepreneurial thinking and action, this specialization also shapes the profile of the TUMCS for Sustainability and Biotechnology and adds a new component to the portfolio of the Faculty of Business Administration and Economics

# Here's the different student support teams at the TUM School of Management:
  Leiterin TUM School of Management:
  - Katinka Kleinheinz
    - Name: Katinka Kleinheinz
    - Email: katinka.kleinheinz@tum.de
    - Location: Munich, Heilbronn
  
  Programm-Management/Studienfachberatung B.Sc. Management and Technology (München):
  - Michaela Krieger
    - Name: Michaela Krieger
    - Email: michaela.krieger@tum.de
    - Location: Munich
  - Ildiko Merza
    - Name: Ildiko Merza
    - Email: ildiko.merza@tum.de
    - Location: Munich
  - Yulia Movsesova
    - Name: Yulia Movsesova
    - Email: yulia.movsesova@tum.de
    - Location: Munich
  
  Programm-Management/Studienfachberatung B.Sc. Management and Technology (Heilbronn):
  - Anke Dautel
    - Name: Anke Dautel
    - Email: anke.dautel@tum.de
    - Location: Heilbronn
  - Martin Semjank
    - Name: Martin Semjank
    - Email: martin.semjank@tum.de
    - Location: Heilbronn
  
  Programm-Management/Studienfachberatung M. Sc. Management and Technology:
  - Andreas Bauerfeld
    - Name: Andreas Bauerfeld
    - Email: andreas.bauerfeld@tum.de
    - Location: Munich
  - Katja Lesske
    - Name: Katja Lesske
    - Email: katja.lesske@tum.de
    - Location: Munich
  
  Programm-Management/Studienfachberatung M.Sc. Management (München):
  - Amelie Haag
    - Name: Amelie Haag
    - Email: amelie.haag@tum.de
    - Location: Munich
  - Katja Leßke
    - Name: Katja Leßke
    - Email: katja.lesske@tum.de
    - Location: Munich
  
  Programm-Management/Studienfachberatung M.Sc. Management (Heilbronn):
  - Anke Dautel
    - Name: Anke Dautel
    - Email: anke.dautel@tum.de
    - Location: Heilbronn
  - Christine Vogt-Bolch
    - Name: Christine Vogt-Bolch
    - Email: christine.vogt-bolch@tum.de
    - Location: Heilbronn
  
  Programm-Management/Studienfachberatung M.Sc. Consumer Science:
  - Katja Leßke
    - Name: Katja Leßke
    - Email: katja.lesske@tum.de
    - Location: Munich
  - Alina Paulig
    - Name: Alina Paulig
    - Email: alina.paulig@tum.de
    - Location: Munich
  
  Programm-Management/Studienfachberatung M.Sc. Finance & Information Management:
  - Charlotte Bayer
    - Name: Charlotte Bayer
    - Email: charlotte.bayer@tum.de
    - Location: Munich
  
  Buddy Program:
  - Katja Leßke
    - Name: Katja Leßke
    - Email: katja.lesske@tum.de
    - Location: Heilbronn, Munich
  - Zuzana Zechovska
    - Name: Zuzana Zechovska
    - Email: zuzana.zechovska@tum.de
    - Location: Heilbronn, Munich
  
  Studierendenaustausch/Auslandsstudienberatung/Auslandsanerkennungen:
  - Josephina Buhr
    - Name: Josephina Buhr
    - Email: josephina.buhr@tum.de
    - Location: Heilbronn, Munich
  - Ute Helfers
    - Name: Ute Helfers
    - Email: ute.helfers@tum.de
    - Location: Heilbronn, Munich
  - Anna-Lena Köttig
    - Name: Anna-Lena Köttig
    - Email: anna-lena.koettig@tum.de
    - Location: Heilbronn, Munich
  - Gabriella Loparco
    - Name: Gabriella Loparco
    - Email: gabriella.loparco@tum.de
    - Location: Heilbronn, Munich
  - Miriam Mahler
    - Name: Miriam Mahler
    - Email: miriam
  Studierendenaustausch/Beratung für Austauschstudierende:
  - Ute Helfers
    - Name: Ute Helfers
    - Email: ute.helfers@tum.de
    - Location: Heilbronn, Munich
  - Zuzana Zechovska
    - Name: Zuzana Zechovska
    - Email: zuzana.zechovska@tum.de
    - Location: Heilbronn, Munich
  Noten- und Prüfungsverwaltung der Studierenden (alle Studiengänge, München)Bitte wenden Sie sich mit Ihrem Anliegen an folgende E-Mail-Adresse: grademanagement@mgt.tum.de:
  - Michaela Gerhardt
    - Name: Michaela Gerhardt
    - Email: michaela.gerhardt@tum.de
    - Location: Munich
  - Shan Huang
    - Name: Shan Huang
    - Email: shanhuang@tum.de
    - Location: Munich
  - Inna Kravchenko
    - Name: Inna Kravchenko
    - Email: inna.kravchenko@tum.de
    - Location: Munich
  - Janine Rothenburger
    - Name: Janine Rothenburger
    - Email: janine.rothenburger@tum.de
    - Location: Munich
    
  PrüfungsausschussangelegenheitenBitte wenden Sie sich mit Ihrem Anliegen an folgende E-Mail-Adresse: examinationboard@mgt.tum.de:
  - Janine Rothenburger
    - Name: Janine Rothenburger
    - Email: janine.rothenburger@tum.de
    - Location: Heilbronn, Munich
  
  Programm-Management/Studienfachberatung Master in Management and Digital Technology (Heilbronn):
  - Sabrina Huber
    - Name: Sabrina Huber
    - Email: sabrina.huber@tum.de
    - Location: Heilbronn

  General Emails:
    admission@wi.tum.de
    examregistration@mgt.tum.de
    examinationboard@mgt.tum.de
    it-support@tum.de
    study@tum.de
    studium@tum.de
    studentcounseling_heilbronn@mgt.tum.de
    servicepoint@chn.tum.de
    studentcounseling_heilbronn@wi.tum.de
    examinationboard@mgt.tum.de
    admission_heilbronn@mgt.tum.de
    buddy_hn@mgt.tum.de
    outgoing@mgt.tum.de

## List of Question <-> Proper Answer pairs:
{context}

## Contexted Question:
{question}
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);
const formatChatHistory = (chatHistory: Message[]) => {
  const formattedDialogueTurns = chatHistory.map(
    (message) => `${message.role}: ${message.content}`,
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
    },
  );

  const retriever = vectorStore.asRetriever(5);


  type ConversationalRetrievalQAChainInput = {
    question: string;
    chat_history: Message[];
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

  const qdrantExtractor =  (documents: Document[], separator = "\n\n") =>
    documents
      .map(
        (doc) =>
          `Question:${doc.metadata.answer}\nSample Answer:${doc.metadata.answer}`,
      )
      .join(separator);



  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(
        // @ts-ignore
        qdrantExtractor,
      ),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    gptModel,
  ]);

  const outputParser = new BytesOutputParser();
  const conversationalRetrievalQAChain = standaloneQuestionChain
    .pipe(answerChain)
    .pipe(outputParser);

  const body = await request.json();
  console.log("##############BODY#################");
  console.log(body);
  console.log("###################################");

  const messages = body.messages ?? [];
  console.log("##############MESSAGES#################");
  console.log(messages);
  console.log("###################################");

  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  console.log("##############FORMATTED PREVIOUS MESSAGES#################");
  console.log(formattedPreviousMessages);
  console.log("###################################");

  const currentMessageContent = messages[messages.length - 1].content;
  console.log("##############CURRENT MESSAGE CONTENT#################");
  console.log(currentMessageContent);
  console.log("###################################");

  const stream = await conversationalRetrievalQAChain.stream({
    chat_history: formattedPreviousMessages,
    question: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}
