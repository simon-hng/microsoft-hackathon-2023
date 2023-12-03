import { PromptTemplate } from "langchain/prompts";
import { gptModel } from "../models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";

const TEMPLATE = `
## The following lines list all the lectures and courses offered by the TUM School of Management in the format <course code>: <Title>
WIHN0001: Mathematics in Natural and Economic Science 1 | Mathematics in Natural and Economic Science 1 [MBNW 1]Mathematik I
WIHN0002: Statistics for Business Administration | Statistics for Business Administration
WIHN0021_E: Economics I - Microeconomics | Economics I - Microeconomics [ECON 1]Microeconomics
WIHN0275_E: Management Science | Management Science [MS]
WIHN0219_E: Investment and Financial Management | Investment and Financial Management
WIHN0261: Empirical Research Methods | Empirical Research Methods[ERM]
WIHN0820: Marketing and Innovation Management | Marketing and Innovation Management
WIHN1057_E: Cost Accounting | Cost Accounting
WIHN1058: Foundations of Entrepreneurial & Ethical Business | Foundations of Entrepreneurial & Ethical Business
WIHN1059_E: Financial Accounting | Financial Accounting
WIHN1060: Production and Logistics | Production and Logistics 
WIHN1121: Strategic and International Management & Organizational Behavior | Strategic and International Management & Organizational Behavior
WIHN0023_E: Economics II - Macroeconomics | Economics II - Macroeconomics [VWL 2]Macroeconomics
WIHN1119: Business Law I | Business Law I [BusLaw]
WIHN1120: Business Law II | Business Law II [BusLaw2]
EI10007: Principles of Information Engineering | Principles of Information Engineering
EI10008: Machine Learning and Data Science | Machine Learning and Data Science [MLDS]
IN8005: Introduction into Computer Science (for non informatics studies) | Einführung in die Informatik für andere Fachrichtungen
IN8027: Introduction to Informatics for Students of Management & Technology – Programming Lab Course | Introduction to Informatics for Students of Management & Technology – Programming Lab Course
MW2383: Design and Analysis of Digital Control Systems | Design und Analyse digitaler Steuerungssysteme
MW2468: Logistics Engineering in Production Systems and Supply Chain Management | Logistics Engineering in Production Systems and Supply Chain Management
EI10009: Project Work in Electrical Engineering and Information Technology (EI) | Project Work in Electrical Engineering and Information Technology (EI)
IN8028: Project Work in Informatics | Project Work in Informatics
MW2408: Project Work in Mechanical Engineering | Projektarbeit im Maschinenbau
WIHN0684: Project Studies | Projektstudium
INHN0011: Fundamentals of Databases | Grundlagen: Datenbanken
MGTHN0059: Negotiation Seminar | Negotiation Seminar
MGTHN0081: Economic Analysis of Contracts, Competition and Companies | Economic Analysis of Contracts, Competition and Companies
MGTHN0065: Conducting Empirical Research in Finance | Conducting Empirical Research in Finance
MGTHN0066: Business Ethics in the Digital Age | Business Ethics in the Digital Age
MGTHN0067: Business Taxation in the Digital Age | Business Taxation in the Digital Age
MGTHN0087: Sustainable Finance | Sustainable Finance
MGTHN0100: Experimental Research Project in Finance | Experimental Research Project in Finance
MGTHN0101: Mastering Skills for Academic Writing | Mastering Skills for Academic Writing
MGTHN0056: Seminar Innovation and Entrepreneurship: Innovation Management in Family Enterprises | Seminar Innovation and Entrepreneurship: Innovation Management in Family Enterprises
MGTHN0091: Web Scraping with Python | Web Scraping with Python[WSP]
MGTHN0060: Leadership in Family Enterprise | Leadership in Family Enterprise
MGTHN0069: Seminar Marketing, Strategy & Leadership: Digital Marketing - Social Media Research | Seminar Marketing, Strategy & Leadership: Digital Marketing - Social Media Research
MGTHN0076: International Study Trip: Family & non-family firms around the world | International Study Trip: Family & non-family firms around the world
MGTHN0078: Seminar Management & Marketing: Digital Marketing | Seminar Management & Marketing: Digital Marketing
MGTHN0082: International Excursion: Global Strategy | International Excursion: Global Strategy
MGTHN0083: Introduction to Python for Data Science | Introduction to Python for Data Science
MGTHN0085: Strategic Management: Theory and Practice | Strategic Management: Theory and Practice
MGTHN0088: Seminar Management & Marketing: Foundations in Strategie Management | Seminar Management & Marketing: Foundations in Strategie Management
MGTHN0089: Bachelor Thesis Seminar: Strategic Management | Bachelor Thesis Seminar: Strategic Management
MGTHN0092: Applied Corporate Social Responsibility | Applied Corporate Social Responsibility
MGTHN0093: CEO Leadership Lessons | CEO Leadership Lessons
MGTHN0098: Global Strategy | Global Strategy
MGTHN0120: Seminar Marketing Research | Seminar Marketing Research 
MGTHN0129: CEO Strategy Lessons | CEO Strategy Lessons
MGTHN0051: Predictive Analytics and Forecasting | Predictive Analytics and Forecasting
MGTHN0054: Seminar Operations & Supply Chain Management: Supply Chain Finance | Seminar Operations & Supply Chain Management: Supply Chain Finance [SCF & SCRM]
MGTHN0057: Seminar Operations & Supply Chain Management: Business Analytics and its Application | Seminar Operations & Supply Chain Management: Business Analytics and its Application
MGTHN0058: Introduction to Reinforcement Learning | Introduction to Reinforcement Learning
MGTHN0063: Inventories in Supply Chains | Inventories in Supply Chains
MGTHN0064: Maintenance Planning of Technical Systems | Maintenance Planning of Technical Systems
MGTHN0068: Seminar on Healthcare Data Analytics | Seminar on Healthcare Data Analytics
WIHN0038: Business Analytics | Business Analytics
WIHN0042: Seminar Operations & Supply Chain Management Reinforcement Learning | Seminar Operations & Supply Chain Management Reinforcement Learning
MGTHN0061: Corporate Campus Challenge | Corporate Campus Challenge
MGTHN0127: Mastering the Skills for Academic Writing | Mastering the Skills for Academic Writing
WIHN1197: International Experience | International Experience
WIHN1198: Communication Skills | Communication Skills
WIHN0693: Bachelor's Thesis | Bachelor's Thesis
MGT001374: Operations Research and Decision Analysis | Operations Research and Decision Analysis
WI000021_E: Economics I - Microeconomics | Economics I - Microeconomics [ECON 1]Microeconomics
MA9711: Mathematics in Natural and Economic Science 1 | Mathematische Behandlung der Natur- und Wirtschaftswissenschaften 1
CIT5130002: Introduction to Data Science and Statistical Thinking | Introduction to Data Science and Statistical Thinking [IDSST]
SOT87316: Introduction to Business Ethics | Introduction to Business Ethics
MGT001372: Foundations of Entrepreneurial Business | Foundations of Entrepreneurial Business
WI001060: Production and Logistics | Production and Logistics
MGT001373: Applied Econometrics | Applied Econometrics
WI000820: Marketing and Innovation Management | Marketing and Innovation Management
WI001059_E: Financial Accounting | Financial Accounting
WI001057_E: Cost Accounting | Cost Accounting
WI000219_E: Investment and Financial Management | Investment and Financial Management
WI000023_E: Economics II - Macroeconomics | Economics II - Macroeconomics [VWL 2]Macroeconomics
WI000027: German Business Law I | Wirtschaftsprivatrecht I (inkl. jurist. Fallbearb.)
WI000030: German Business Law II | Wirtschaftsprivatrecht II (inkl. jurist. Fallbearb.)
WI001119: Business Law I | Business Law I
WI001120: Business Law II | Business Law II [BusLaw 2]
MGT001375: Machine Learning for Business Analytics | Machine Learning for Business Analytics
CH1104: General and Inorganic Chemistry | Allgemeine und Anorganische Chemie
IN8005: Introduction into Computer Science (for non informatics studies) | Einführung in die Informatik für andere Fachrichtungen
CH1090: Introduction to Organic Chemistry | Einführung in die Organische Chemie
CH0106: Biology for Chemists | Biologie für Chemiker
CH1000: Chemical Laboratory Course for TUM-BWL | Chemisches Praktikum für TUM-BWL
CH0107: Analytical Chemistry | Analytische Chemie
CH0780: Chemistry in Everyday Life and Technology | Chemie in Alltag und Technik
CH4103: Molecular Inorganic Chemistry | Anorganische Molekülchemie
IN8024: Information Management for Digital Business Models | Informationsmanagement für Digitale Geschäftsmodelle
IN0006: Introduction to Software Engineering | Einführung in die Softwaretechnik
IN0009: Basic Principles: Operating Systems and System Software | Grundlagen: Betriebssysteme und Systemsoftware
IN0008: Fundamentals of Databases | Grundlagen: Datenbanken
CIT5230000: Introduction to Programming | Introduction to Programming
MA9714: Mathematics in Natural and Economic Science 2 | Mathematische Behandlung der Natur- und Wirtschaftswissenschaften 2
EI29821: Principles of Information Engineering | Grundlagen der Informationstechnik
EI10002: Principles of Electrotechnology | Principles of Electrotechnology [PiET]
EI1289: Electrical Engineering | Elektrotechnik
EI10003: Analog Electronics | Analog Electronics [AE]
EI2986: Telecommunication I - Signal Representation | Nachrichtentechnik I - Signaldarstellung
EI00120: Digital Design | Digitaltechnik
EI04002: Introduction to IT-Security | Grundlagen der IT-Sicherheit[ITSEC]
MW2385: CAD and Machines Drawing (Specialization/Application Area) | CAD und Maschinenzeichnen (Spezialisierung/Anwendungsfach)[CADandTD]
MW2447: Introduction to Manufacturing Technology | Einführung in die Produktionstechnik [PT]Introduction to Manufacturing Technology
MW1108: Engineering Mechanics for Technology Management | Technische Mechanik für TUM-BWL
MW1694: Machine Elements - Basics, Manufacturing, Application | Maschinenelemente - Grundlagen, Fertigung, Anwendung [ME-BMA]
BV350007: Materials in Mechanical Engineering | Werkstoffe im Maschinenwesen [Materials in mechanical engineering ]
MW1903: Bioprocess Engineering | Bioverfahrenstechnik
MW2015: Basics of Thermodynamics | Grundlagen der Thermodynamik[TTD 1]
MW0040: Production Engineering | Fertigungstechnologien
MW2156: Metal-cutting Manufacturing Processes | Spanende Fertigungsverfahren
MEDWI001: Chemistry - Basic knowledge with clinical links | Chemie - Basiswissen mit klinischen Verknüpfungen
WZ8057: Biology Part 1 | Biologie für Nebenfächer, 1. Teil
SG120020: Composition and Function of the Human Body | Körperstrukturen und -funktionen
SG120025: Human Biology | Anatomie und Physiologie der inneren Organe
MEDWI002: Medical terminology | Medizinische Terminologie
MEDWI003: Medical Focus | Medizinische Vertiefung
MEDWI004: Medical Science and Practice | Medizin und Praxis
MGT001334: Seminar Innovation & Entrepreneurship: Family and Social Enterprises | Seminar Innovation & Entrepreneurship: Family and Social Enterprises
WI000026: Advanced Technology and Innovation Management | Advanced Technology and Innovation Management
MGT001322: Trademarks & Brands | Markenschutz
WI001028: Basic Principles and international Aspects of Corporate Management | Grundlagen und internationale Aspekte der Unternehmensführung
WI001072: Corporate Sustainability | Corporate Sustainability [Corp Sust BC]
CS0081: Modelling and Optimization | Modellierung und Optimierung
WI000974: Modeling, Optimization and Simulation in Operations Management | Modeling, Optimization and Simulation in Operations Management [MOS]
WIB04741: Seminar Finance & Management Accounting | Seminar Finance & Management Accounting
WIB06001: Seminar Finance & Accounting: Data Science in Finance | Seminar Finance & Accounting: Data Science in Finance
WI000091: Corporate Finance | Corporate Finance
WI001083: Controlling | Controlling
CS0061: Seminar in Behavioral Economics | Seminar in Behavioral Economics
MGT001359: Microeconometrics | Microeconometrics
IN0001: Introduction to Informatics | Einführung in die Informatik
ED160007: Lithium-Ion Battery Production | Lithium-Ionen-Batterieproduktion [VLBP]Lithium-ion battery production
MW1920: Machine Dynamics | Maschinendynamik
MW2022: Automatic Control | Regelungstechnik
CIT3230000: Advanced Concepts of Programming Languages | Advanced Concepts of Programming Languages
EI19000: Learning from Data and Linear Algebra | Lernen von Daten und Lineare Algebra
WI001198: Communication Skills | Communication Skills
WI000693: Bachelor's Thesis | Bachelor's Thesis
WI201040: Business Processes and Technology | Business Processes and Technology
WI201041: Strategy and Organization | Strategy and Organization
WI201042: Ownership of Enterprise & Corporate Governance | Ownership of Enterprise & Corporate Governance
WI201043: Finance and Accounting | Finance and Accounting
WI201044: Demand and Supply Management | Demand and Supply Management
WI201045: Market, Law and Ethics | Market, Law and Ethics
WI201046: Change Management and Human Capital | Change Management and Human Capital
WI201047: International Management & Intercultural Cooperation | International Management & Intercultural Cooperation
WI201048: IT-Security & Privacy Management | IT-Security & Privacy Management
WI201049: Leadership and Cooperation | Leadership and Cooperation
WI201050: Digital Transformation & Entrepreneurship | Digital Transformation & Entrepreneurship
WI201051: Leadership & Personal Development | Leadership & Personal Development
WI900259: Master's Thesis | Master's Thesis
WI000739: Consumer Behavior | Consumer Behavior
WI001174: Qualitative and Quantitative Methods in Consumer Research | Qualitative and Quantitative Methods in Consumer Research
WI001175: Consumer Behavior Research Methods | Consumer Behavior Research Methods
WI001178: Consumer Analytics & Big Data | Consumer Analytics & Big Data [CABIDA]
MGT001327: Advanced Seminar Innovation & Entrepreneurship: Entrepreneurial Ecosystems | Advanced Seminar Innovation & Entrepreneurship: Entrepreneurial Ecosystems
MGT001394: Advanced Seminar Innovation & Entrepreneurship: Entrepreneurship for a Cause | Advanced Seminar Innovation & Entrepreneurship: Entrepreneurship for a CauseEntrepreneurship for a Cause
MGT001315: European Business Law | European Business Law
MGT001347: Innovation Facilitator | Innovation Facilitator
MGT001364: Family Businesses | Family Businesses
MGT001362: Advanced Seminar Marketing, Strategy, Leadership & Management: Contemporary and emerging issues for organizations | Advanced Seminar Marketing, Strategy, Leadership & Management: Contemporary and emerging issues for organizations
MGT001377: Advanced Seminar Management & Marketing: New Tech Venture Marketing | Advanced Seminar Management & Marketing: New Tech Venture Marketing
MGT001297: Advanced Seminar Economics, Policy & Econometrics: Insurance Economics | Advanced Seminar Economics, Policy & Econometrics: Insurance Economics
WI001282: Advanced Seminar Economics, Policy & Econometrics: Economics of Science | Advanced Seminar Economics, Policy & Econometrics: Economics of Science
MGT001317: World Trade Law | World Trade Law
WI001220: Network Economics I | Network Economics I [NE I]Introduction to Network Economics
WI001281: The Economics of Firm Competition | The Economics of Firm Competition [EconFirms]
POL62200: Energy Transformation | Energy Transformation
WZ1564: Econometric Impact Analysis | Econometric Impact Analysis[EIA]
WI001291: Competition Law and Entrepreneurial Strategies | Competition Law and Entrepreneurial Strategies
WI000948: Food Economics | Food Economics
WZ1590: Climate Change Economics | Climate Change Economics
WI001090: Behavioral Pricing: Insights, Methods, and Strategy | Behavioral Pricing: Insights, Methods, and Strategy
WI001217: Trade Secrets | Geheimnisschutz
ED0027: History of Consumption Goods | Consumer History
POL70044: Business Ethics | Unternehmensethik
WI900766: Master's Thesis | Master's Thesis
WI001271: Entrepreneurship | Entrepreneurship
WI001287: Basics of FIM | Basics of FIM
WI000234: Value-based Management | Value-based Management
IN2028: Business Analytics and Machine Learning | Business Analyticsand Machine Learning
MA9972: Discrete Time Finance (FIM) | Discrete Time Finance (FIM)
MA9973: Continuous Time Finance (FIM) | Continuous Time Finance(FIM)
WIBT0001: Business Process Management & Digital Innovation |Business Process Management & Digital Innovation 
WIBT0002: Digital Energy Management | Digital Energy Management
WIBT0003: Digital Disruption, Innovation and Transformation | DigitalDisruption, Innovation and Transformation
WI001267: Advanced Corporate Finance | Advanced Corporate Finance
WI001268: Venture Capital | Venture Capital
WI001269: International Accounting | International AccountingFor students in the FIM Master
WI001270: Behavioral Finance | Behavioral Finance
WI001272: Machine Learning | Machine Learning
WI100180: Business Plan - Advanced Course (Business Models, Salesand Finance) | Business Plan - Advanced Course (Business Models,Sales and Finance)Business model, sales and finance
MA3405: Insurance Mathematics 1 | Insurance Mathematics 1
MA9976: Financial Econometrics (FIM) | Financial Econometrics (FIM)
WIB06771: Advanced Seminar Finance & Accounting: Cases in Finance| Advanced Seminar Finance & Accounting: Cases in FinanceCases in Finance (WS); Theory in Finance (SS)
WI000231: Asset Management | Asset Management
WI001187: Private Equity | Private Equity
WI001275: Applied Econometrics | Applied EconometricsAn introduction
WIBT0004: Business & Information Systems Engineering (Seminar) |Business & Information Systems Engineering (Seminar)
WIBT0005: Digital Energy & Sustainability | Digital Energy &Sustainability
WIBT0006: Emerging Digital Technologies @ BISE (Blockchain, AI, IoT,Process Mining) | Emerging Digital Technologies @ BISE (Blockchain,AI, IoT, Process Mining)
WI000813: Technology Entrepreneurship Lab | TechnologyEntrepreneurship Lab
WI001180: Tech Challenge | Tech Challenge
WI700006: Modules from HEC Paris | Modules from HEC Paris
WI201079: Innovation Prototyping | Innovation Prototyping
WI201080: Technological Trends | Technological Trends
WI201081: Growth Strategies & Business Models | Growth Strategies &Business Models
WI201082: Project Work | Project Work
WI201083: Personal & Leadership Development | Personal & LeadershipDevelopment
WI900262: Master's Thesis | Master's Thesis
WIB18812_1: Advanced Seminar Innovation & Entrepreneurship: Ideation & Venture Creation | Advanced Seminar Innovation & Entrepreneurship: Ideation & Venture Creation
WIB271011: Advanced Seminar Innovation & Entrepreneurship: Venture Growth and Internationalization | Advanced Seminar Innovation & Entrepreneurship: Venture Growth and Internationalization
MGT001315: European Business Law | European Business Law [EBL]
MGT001395: Entrepreneurship and Innovation in China | Entrepreneurship and Innovation in China
WI001166: Entrepreneurial Prototyping | Entrepreneurial Prototyping
MGT001310: Advanced Seminar in Marketing, Strategy, Leadership & Management: International Marketing Strategy | Advanced Seminar in Marketing, Strategy, Leadership & Management: International Marketing Strategy
WIB08001: Advanced Seminar Marketing, Strategy, Leadership & Management: Advances in Consumer Research | Advanced Seminar Marketing, Strategy, Leadership & Management: Advances in Consumer Research
WI001278: Advanced Seminar Marketing, Strategy & Leadership: Success and failure of co-founding teams | Advanced Seminar Marketing, Strategy & Leadership: Success and failure of co-founding teamsInsights from science and practice
MGT001387: Risk Management | Risk Management [RMM]
WI001218: Patent protection | Patentschutz
WIB09828_2: Advanced Seminar Operations & Supply Chain Management: Operations Management | Advanced Seminar Operations & Supply Chain Management: Operations Management
WIB34001: Advanced Seminar Operations & Supply Chain Management: Operations Research | Advanced Seminar Operations & Supply Chain Management: Operations Research [Advanced Seminar Operations & Supply Chain Management]
WI000976: Logistics and Operations Strategy | Logistics and Operations Strategy
WI001034: Service and Health Care Operations Management | Service and Health Care Operations Management
MGT001301: Advanced Seminar Finance & Accounting: EU FinTech Regulation | Advanced Seminar Finance & Accounting: EU FinTech Regulation
WIB06771: Advanced Seminar Finance & Accounting: Cases in Finance | Advanced Seminar Finance & Accounting: Cases in FinanceCases in Finance (WS); Theory in Finance (SS)
WIB23006: Advanced Seminar Finance & Accounting: Strategy Planning and Steering | Advanced Seminar Finance & Accounting: Strategy Planning and SteeringStrategy Planning & Steering
WIB33002: Venture Capital Lab | Venture Capital Lab
WI001284: Behavioral Economics meet real world challenges | Behavioral Economics meet real world challenges [Behavioral Economics_Projectrally]
WI001250: Advanced Seminar Economics, Policy & Econometrics: Current Topics in Value Chain Economics | Advanced Seminar Economics, Policy & Econometrics: Current Topics in Value Chain Economics [Seminar VCE]
WI001282: Advanced Seminar Economics, Policy & Econometrics: Economics of Science | Advanced Seminar Economics, Policy & Econometrics: Economics of Science
WI001221: International Trade I | International Trade I [IT I]Foundations of the International Economics
WI001226: International Trade II | International Trade II [IT II]International Economics: Trade Policy and Multinational Firms
WI001281: The Economics of Firm Competition | The Economics of Firm Competition [EconFirms]
WI000946: Energy Markets I | Energy Markets I
WI000992: Energy Trading | Energy Trading
WI001145: Energy Economics | Energy Economics
MGT001344: Advanced Seminar Life Sciences, Management & Policy: Food Governance, Fairness and Sustainability Literature Review and Presentation Skills | Advanced Seminar Life Sciences, Management & Policy: Food Governance, Fairness and Sustainability Literature Review and Presentation Skills
WIB14002: Advanced Seminar Life Sciences, Management & Policy: Sustainable Entrepreneurship - Theoretical Foundations | Advanced Seminar Life Sciences, Management & Policy: Sustainable Entrepreneurship - Theoretical Foundations
WZ0041: Economics of Technology and Innovation | Economics of Technology and Innovation
WZ0043: Risk Theory and Modeling | Risk Theory and Modeling
WZ1590: Climate Change Economics | Climate Change Economics
MW1907: Introduction to Flight Mechanics and Control | Introduction to Flight Mechanics and Control
MW1920: Machine Dynamics | Maschinendynamik
MW0628: Energy and Economy | Energie und Wirtschaft
MW1902: Industrial Automation | Automatisierungstechnik
IN0001: Introduction to Informatics | Einführung in die Informatik
IN0004: Introduction to Computer Organization and Technology - Computer Architecture | Einführung in die Rechnerarchitektur
IN2101: Network Security | Network Security
IN2406: Fundamentals of Artificial Intelligence | Fundamentals of Artificial Intelligence
CH1090: Introduction to Organic Chemistry | Einführung in die Organische Chemie
CH1091: Basic Principles of Physical Chemistry 1 | Grundlagen der Physikalischen Chemie 1
CH6202: General and Inorganic Chemistry | Allgemeine und Anorganische Chemie
CH0106: Biology for Chemists | Biologie für Chemiker
CH0107: Analytical Chemistry | Analytische Chemie
CH3153: Construction Chemistry 1 | Bauchemie 1
CH3154: Nano Materials | Nanomaterialien
EI10002: Principles of Electrotechnology | Principles of Electrotechnology [PiET]
EI1289: Electrical Engineering | Elektrotechnik
EI00120: Digital Design | Digitaltechnik
EI10003: Analog Electronics | Analog Electronics [AE]
EI0631: Media Technology | Medientechnik
EI73871: Technical Acoustics and Noise Abatement | Technische Akustik und Lärmbekämpfung
EI0610: Electrical Drives - Fundamentals and Applications | Elektrische Antriebe - Grundlagen und Anwendungen
EI7328: Electromagnetic Compatibility in the Field of Power Engineering | Elektromagnetische Verträglichkeit in der Energietechnik
IN0003: Functional Programming and Verification | Funktionale Programmierung und Verifikation
IN2339: Data Analysis and Visualization in R | Data Analysis and Visualization in R
ED180013: Energy Informatics | Energie Informatik
IN2076: Advanced Computer Architecture | Advanced Computer Architecture
MGT001370: Designing Manufacturing Systems | Designing Manufacturing Systems
MGT001371: Scheduling Manufacturing Systems | Scheduling Manufacturing Systems
EI70860: Integration of Renewable Energies | Integration of Renewable Energies [IRE]
EI74831: Project Lab Renewable and Sustainable Energy Systems | Project Lab Renewable and Sustainable Energy Systems [PropENS]
EI80004: Sustainable Mobility | Sustainable Mobility [SuMo]Sustainable Mobility: Current and Future Developments
MW2149: Introduction to Wind Energy | Introduction to Wind Energy
WI001223: Challenges in Energy Markets | Challenges in Energy MarketsGlobal power plant projects in a changing energy market
WI001263: Alternative Investments | Alternative Investments
WI000948: Food Economics | Food Economics
WI001140: Luxury Marketing | Luxury Marketing
WI000819: Applied Discrete Optimization | Applied Discrete Optimization[DO]
MW1921: Material Flow and Logistics | Materialfluss und Logistik
IN2346: Introduction to Deep Learning | Introduction to Deep Learning
CH4117: Biochemistry | Biochemie
EI0625: Communication Networks | Kommunikationsnetze
EI0622: Semiconductor Sensors | Halbleitersensoren
IN8024: Information Management for Digital Business Models | Informationsmanagement für Digitale Geschäftsmodelle
IN2073: Cloud Computing | Cloud Computing
ED110106: Systems Engineering - Fundamentals | Systems Engineering - Grundlagen [SE-F]
MW1476: Renewable Energy Technology 2 | Regenerative Energiesysteme 2 [RET II]
WI001181: Advanced International Experience | Advanced International Experience
WI900685: Project Studies (Master in Management and Technology) | Project Studies (Master in Management and Technology)
WI700006: Modules from HEC Paris | Modules from HEC Paris
WI900249: Master's Thesis (Master in Management and Technology) | Master's Thesis (Master in Management and Technology)
WIHN0258: Empirical Research in Economics and Management |Empirical Research in Economics and Management
WIHN1129: Marketing and Innovation Management (MiM) | Marketing andInnovation Management (MiM)
WIHN1130: Cost Accounting | Cost Accounting
WIHN1131: Production and Logistics | Production and Logistics
WIHN1137: Management Science (MiM) | Management Science (MiM)
WIHN1138: Investment and Financial Management (MiM) | Investmentand Financial Management (MiM) [IaF]
WIHN1139: Financial Accounting (MiM) | Financial Accounting (MiM)
WIHN1056_1: Principles of Economics | Principles of Economics
WIHN1122: Introduction to Business Law (MiM) | Introduction toBusiness Law (MiM)
WIHN1185: Entrepreneurial, Strategic, and International Management |Entrepreneurial, Strategic, and International Management
WIHN9684: Project Studies | Projektstudium
IN4426: Master-Seminar - Digital Transformation & Sustainability |Master-Seminar - Digital Transformation & Sustainability
IN4831: Master-Seminar - Digital Transformation | Master-Seminar -Digital Transformation
WIHN0014: Corporate Campus Challenge | Corporate CampusChallenge
WIHN1181: Advanced International Experience | Advanced InternationalExperience
WI700002: Credits from TUM | Anerkannte Leistungen der TUM
WI700003: Credits from a Foreign University | Anerkannte externeLeistungen
WIHN0037: Business-to-Business Contract Negotiations | Business-to-Business Contract Negotiations
WIHN0049: Economic Analysis of Contracts, Competition andCompanies | Economic Analysis of Contracts, Competition andCompanies
WIHN0009: Advanced Seminar Finance & Accounting: Case Studiesin Digital Business | Advanced Seminar Finance & Accounting: CaseStudies in Digital Business
WIHN0010: Advanced Seminar Finance & Accounting: CorporateValuation | Advanced Seminar Finance & Accounting: CorporateValuation
WIHN0012: Digital Finance | Digital Finance [DF]
WIHN0013: Advanced Seminar Finance & Accounting: Current researchTopics in Digital Finance | Advanced Seminar Finance & Accounting:Current research Topics in Digital FinanceCurrent Research Topics in Digital Finance
WIHN0020: Empirical Research Project in Finance | Empirical ResearchProject in FinanceCurrent Research Topics in Sustainable Finance
WIHN0024: Advanced Seminar Finance & Accounting: Current ResearchTopics in Empirical Capital Market Research | Advanced SeminarFinance & Accounting: Current Research Topics in Empirical CapitalMarket Research
WIHN0025: Advanced Seminar Finance & Accounting: Digitalizationin Accounting & Auditing | Advanced Seminar Finance & Accounting:Digitalization in Accounting & Auditing
WIHN0026: Advanced Seminar in Finance & Accounting: STATA forempirical research in Accounting & Finance | Advanced Seminar inFinance & Accounting: STATA for empirical research in Accounting &Finance
WIHN0036: Introduction to Capital Market Databases and StatisticalAnalysis Software | Introduction to Capital Market Databases andStatistical Analysis Software
WIHN0050: Dean’s Lecture: Managing Digital Transformation inGlobal and Family Enterprises | Dean’s Lecture: Managing DigitalTransformation in Global and Family EnterprisesDean's lecture series
MGTHN0055: Advanced Seminar in Innovation and Entrepreneurship:Family Enterprises in the Digital Age | Advanced Seminar in Innovationand Entrepreneurship: Family Enterprises in the Digital Age
WIHN0017: Advanced Seminar Innovation & Entrepreneurship: DigitalInnovation | Advanced Seminar Innovation & Entrepreneurship: DigitalInnovation
WIHN0018: Advanced Topics in Innovation & Entrepreneurship:Economics and Management of Platforms | Advanced Topics inInnovation & Entrepreneurship: Economics and Management ofPlatforms 
WIHN0028: Advanced Seminar in Innovation and Entrepreneurship:Topics in Corporate Entrepreneurship | Advanced Seminar in Innovationand Entrepreneurship: Topics in Corporate Entrepreneurship
WIHN0029: Advanced Seminar in Innovation and Entrepreneurship:Managing the Family Enterprise | Advanced Seminar in Innovation andEntrepreneurship: Managing the Family Enterprise
WIHN0044: Advanced Seminar Inovation & Entrepreneurship: From Ideato Venture | Advanced Seminar Inovation & Entrepreneurship: From Ideato Venture
WIHN0045: Advanced Seminar Innovation & Entrepreneurship:Strategic Decision-Making In Entrepreneurship And Family Enterprises| Advanced Seminar Innovation & Entrepreneurship: Strategic Decision-Making In Entrepreneurship And Family Enterprises
WIHN0046: Advanced Seminar Innovation & Entrepreneurship:Sustainability In Entrepreneurship and Family Enterprises |Advanced Seminar Innovation & Entrepreneurship: Sustainability InEntrepreneurship and Family Enterprises
WIHN0035: Digital HR Management | Digital HR Management 
WIHN0016: Advanced Topics in Marketing: Brand Management & FamilyFirm Branding | Advanced Topics in Marketing: Brand Management &Family Firm Branding
MGTHN0051: Predictive Analytics and Forecasting | Predictive Analyticsand Forecasting
MGTHN0052: Advanced Seminar Operations & Supply ChainManagement : Digital Technologies in Operation Management |Advanced Seminar Operations & Supply Chain Management : DigitalTechnologies in Operation Management
MGTHN0053: Advanced Seminar Operations & Supply ChainManagement : Production Planning | Advanced Seminar Operations &Supply Chain Management : Production Planning [PP]
WIHN0011: Advanced Seminar Operations & Supply Chain Management:Supply Chain Finance & Supply Chain Risk Management | AdvancedSeminar Operations & Supply Chain Management: Supply ChainFinance & Supply Chain Risk Management [SCF & SCRM]
WIHN0019: Inventory Management | Inventory Management
WIHN0022: Advanced Seminar Operations & Supply ChainManagement: Operations Management | Advanced Seminar Operations& Supply Chain Management: Operations Management
WIHN0031: Advanced Seminar Operations & Supply ChainManagement: Digital Operations | Advanced Seminar Operations &Supply Chain Management: Digital Operations
WIHN0032: Business Forecasting | Business Forecasting
WIHN0033: Deep Reinforcement Learning | Deep ReinforcementLearning [IRL]
WIHN0034: Advanced Seminar Operations & Supply ChainManagement: Business Analytics and its Application in Healthcare |Advanced Seminar Operations & Supply Chain Management: BusinessAnalytics and its Application in Healthcare 
WIHN0039: Business Analytics with Python and R | Business Analyticswith Python and R
WIHN0043: Advanced Seminar Operations & Supply ChainManagement: Deep Reinforcement Learning | Advanced SeminarOperations & Supply Chain Management: Deep Reinforcement Learning
WIHN0047: Advanced Seminar Operations & Supply ChainManagement: Virtual Reality Seminar on the Application of GameTheory in Supply Chain Management | Advanced Seminar Operations &Supply Chain Management: Virtual Reality Seminar on the Applicationof Game Theory in Supply Chain Management
WIHN0048: Introduction to Python for Data Analysis | Introduction toPython for Data Analysis
WIHN9268: Master’s Thesis (Master in Management) | Master’s Thesis(Master in Management)
WI000258: Empirical Research in Economics and Management | Empirical Research in Economics and Management
WI001129: Marketing and Innovation Management (MiM) | Marketing and Innovation Management (MiM)
WI001130: Cost Accounting | Cost Accounting
WI001131: Production and Logistics (MiM) | Production and Logistics (MiM)
WI001137: Management Science (MiM) | Management Science (MiM)
WI001138: Investment and Financial Management (MiM) | Investment and Financial Management (MiM) [IaF]
WI001139: Financial Accounting (MiM) | Financial Accounting (MiM)
WI001056_1: Principles of Economics | Principles of Economics
WI001122: Introduction to Business Law (MiM) | Introduction to Business Law (MiM) [BusLawMiM]
WI001185: Entrepreneurial, Strategic, and International Management | Entrepreneurial, Strategic, and International Management
MGT001315: European Business Law | European Business Law [EBL]
MGT001317: World Trade Law | World Trade Law [WTO]
WI001250: Advanced Seminar Economics, Policy & Econometrics: Current Topics in Value Chain Economics | Advanced Seminar Economics, Policy & Econometrics: Current Topics in Value Chain Economics [Seminar VCE]
MGT001365: Advanced Seminar Energy Market: Applied Economic Analysis of Decarbonization Strategies: Firm’s Perspective | Advanced Seminar Energy Market: Applied Economic Analysis of Decarbonization Strategies: Firm’s Perspective
WI000946: Energy Markets I | Energy Markets I
WI001125: Energy Markets II | Energy Markets II
WI001145: Energy Economics | Energy Economics
MGT001398: Banking and Financial Markets Law | Bank- und Kapitalmarktrecht
MGT001402: Advanced Seminar Finance & Accounting: Asset Management | Advanced Seminar Finance & Accounting: Asset Management
WIB06771: Advanced Seminar Finance & Accounting: Cases in Finance | Advanced Seminar Finance & Accounting: Cases in FinanceCases in Finance (WS); Theory in Finance (SS)
WIB23006: Advanced Seminar Finance & Accounting: Strategy Planning and Steering | Advanced Seminar Finance & Accounting: Strategy Planning and SteeringStrategy Planning & Steering
MGT001394: Advanced Seminar Innovation & Entrepreneurship: Entrepreneurship for a Cause | Advanced Seminar Innovation & Entrepreneurship: Entrepreneurship for a CauseEntrepreneurship for a Cause
WI001166: Entrepreneurial Prototyping | Entrepreneurial Prototyping
WI001180: Tech Challenge | Tech Challenge
MGT001345: Advanced Seminar Life Sciences, Management & Policy: Food Governance, Fairness and Sustainability Scientific Writing and Exploratory Research Methods | Advanced Seminar Life Sciences, Management & Policy: Food Governance, Fairness and Sustainability Scientific Writing and Exploratory Research Methods
WIB14002: Advanced Seminar Life Sciences, Management & Policy: Sustainable Entrepreneurship - Theoretical Foundations | Advanced Seminar Life Sciences, Management & Policy: Sustainable Entrepreneurship - Theoretical Foundations
WI000948: Food Economics | Food Economics
WZ0043: Risk Theory and Modeling | Risk Theory and Modeling
MGT001384: Marketing Mobility | Marketing Mobility
WIB08001: Advanced Seminar Marketing, Strategy, Leadership & Management: Advances in Consumer Research | Advanced Seminar Marketing, Strategy, Leadership & Management: Advances in Consumer Research
WI001140: Luxury Marketing | Luxury Marketing
WI001175: Consumer Behavior Research Methods | Consumer Behavior Research Methods
WIB22964: Advanced Seminar Operations & Supply Chain Management: Logistics and Supply Chain Management | Advanced Seminar Operations & Supply Chain Management: Logistics and Supply Chain Management
WIB34001: Advanced Seminar Operations & Supply Chain Management: Operations Research | Advanced Seminar Operations & Supply Chain Management: Operations Research [Advanced Seminar Operations & Supply Chain Management]
WI000976: Logistics and Operations Strategy | Logistics and Operations Strategy
WI000979: Inventory Management | Inventory Management
WI900684: Project Studies (Master in Management) | Project Studies (Master in Management)
BV130021: Real Estate Markets and Investors | Immobilienmärkte und Immobilieninvestoren [ImmoM&Inv]
WI001181: Advanced International Experience | Advanced International Experience
WI900261: Master's Thesis | Master's Thesis

## Task
Decide wether the following support requrest email asks about information related to one of these courses. Output the exact line as given above for the course that it matches. Return just the line nothing else. If you think that the email is about something else reply with "OTHER".

## Email
{email}
`;

const prompt = PromptTemplate.fromTemplate(TEMPLATE);
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
export const moduleCall = prompt.pipe(model).pipe(outputParser);


