import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AnswerEmailProps {
  name: string;
  question: string;
  answer: string;
}

export const AnswerEmail = ({
  name = "Jan",
  question = "How do I log in?",
  answer = "Clear your browser cache and cookies, and attempt to log in again.",
}: AnswerEmailProps) => {
  const sources = [
    { href: "#", text: "TUM Help Desk" },
    { href: "#", text: "TUM.de" },
  ];

  return (
    <Html>
      <Head />
      <Preview>re: your support request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://www.cit.tum.de/typo3/ext/tumtheme/Resources/Public/Icons/Org/tum-logo.png"
            width="73"
            height="38"
            alt="TUM Logo"
            style={{ marginBottom: "40px" }}
          />
          <Section>
            <Heading style={h1}>Hi {name}</Heading>

            <Text style={text}>Regarding your request:</Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#dfdfdf",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Text style={text}>{question}</Text>
          </Section>
          <Section>
            <Text style={text}>{answer}</Text>
          </Section>

          <Section>
            <Text style={text}>
              See the following links for more information:
              <br />
              {sources.map((source) => (
                <>
                  <Link style={anchor} href={source.href}>
                    {source.text}
                  </Link>
                  <br />
                </>
              ))}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AnswerEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const h1 = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const anchor = {
  textDecoration: "underline",
};
