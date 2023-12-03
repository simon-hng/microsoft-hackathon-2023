import { PromptTemplate } from "langchain/prompts";
import { gptModel } from "../models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const CREATE_ANSWER = `Given the following input information, create an answer email for a student inquiry.

# Here's commonly used abbreviations at the TUM School of Management:
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


## Original Question from Student:
"""{email}"""

---

## Top 3 Match Answers from Vector Database:

Question: """{vdb_question_1}"""
Answer: """{vdb_answer_1}"""
 ---


Question: """{vdb_question_2}"""
Answer: """{vdb_answer_2}"""
 ---


Question: """{vdb_question_3}"""
Answer: """{vdb_answer_3}"""
 ---


## Tasks:
Review the student's original question, the provided matches from the vector database, and the other context provided to understand the context and specific needs.
Evaluate the top 3 match answers from the vector database to see if they are suitable for the student's question.
Select the most appropriate answer based on all context. Consider aspects like relevance, completeness, and accuracy in relation to the student's question.
Refactor the chosen answer to enhance its informativeness. Ensure that the refactored answer:
    Directly addresses the student's question.
    Is clear, concise, and specific.
    Incorporates any relevant information from the email attachments, if applicable.
    Is structured in a friendly and professional tone suitable for email communication with a student.

Output:
Compose the body of the answer email using the refactored and selected answer, ensuring it is tailored to the student's specific inquiry and presented in a manner that is easy to understand. End the email body with: "Best regards, TUM SoM Student Support Bot".`;

const FORWARD_OR_NOT = `# Here's commonly used abbreviations at the TUM School of Management:
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


# Here's the task you need to perform:
Given the following input information, evaluate answers to student email inquiries, deciding whether the answer can be directly sent to the student or if it needs to be forwarded to specific student support personnel for further action.
    AnswerToEvaluate: {answer}

Approach this task step-by-step, take your time and do not skip steps:

Task to be done:
    Analyze the content and context you receive.
    Determine the nature and complexity of the inquiry and answer.
    Decide if the answer to the inquiry is suitable and can be sent back directly, or if it needs more information or if it requires forwarding to student support.
    It's very important that you only answer generic questions directly and that the outcome for complex questions is that they will be forwarded to student support!  Especially forward questions that are related to grades, exams, and credits if they are missing information on Credits/ECTS, semester, or study program.
    If you figure out that the student definitely needs to reach out to further student support teams, please output true for the forward decision!
    Output format: After your reasoning, give me your final output in the following format as your very last output: forwardDecision: true|false,Optional(emailToForwardTo: string)`;
    //Output format: Always give me just a boolean value (true / false) for whether the email should be forwarded to student support (true), if you need more information (true) or can be sent directly back to the student (false). Also give me the contact information (email and name) for the student support team that should be contacted (if applicable). Only select a specific support team if a study program is given by the student, otherwise use the general contact. Take the contact info from the context I gave to you.`;
    //Output format: Decide if it should be forwarded to student support (true) or sent directly to the student (false). In cases where forwarding is necessary, provide the specific contact information (email and name) of the relevant student support team. Use the study program mentioned in the student's email to identify the specific support team; if no program is specified, resort to the general contact information.

const createAnswer = PromptTemplate.fromTemplate(CREATE_ANSWER);
const createForwardDecision = PromptTemplate.fromTemplate(FORWARD_OR_NOT);
/*
 * See a full list of supported models at:
 * https://js.langchain.com/docs/modules/model_io/models/
 */
const model = gptModel;
/*
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
export const forwardChain = createForwardDecision
  .pipe(model)
  .pipe(outputParser);
