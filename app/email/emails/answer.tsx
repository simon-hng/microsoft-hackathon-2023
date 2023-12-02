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

interface DropboxResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const DropboxResetPasswordEmail = ({
  userFirstname = "Jan",
}: DropboxResetPasswordEmailProps) => {
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
            alt="Dropbox"
            style={{ marginBottom: "40px" }}
          />
          <Section>
            <Heading style={h1}>Hi {userFirstname}</Heading>

            <Text style={text}>Regarding your request:</Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#dfdfdf",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Text style={text}>
              Dear TUM Help Desk, I hope this message finds you well. My name is
              [Student Name], enrolled in [Your Program Name], and I'm
              experiencing persistent login issues when trying to access the TUM
              online portal. Despite entering correct credentials, the system
              intermittently fails to recognize my login information. This issue
              is impeding my access to essential study materials and submission
              of assignments. I've tried basic troubleshooting without success.
              Your prompt assistance in resolving this matter is crucial,
              especially with impending assignment deadlines. Please advise on
              the necessary steps to address this login problem. Thank you for
              your attention to this urgent matter.
            </Text>
          </Section>
          <Section>
            <Text style={text}>
              Dear [Student Name], Thank you for reaching out. We apologize for
              the inconvenience you're facing. Our team is actively
              investigating the login issues you've reported. In the meantime,
              please try clearing your browser cache and cookies, and attempt to
              log in again. If the problem persists, please provide more details
              such as the browser and device you're using. This information will
              help us expedite the resolution process. We appreciate your
              patience and understanding. Best regards, TUM Help Desk
            </Text>
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

export default DropboxResetPasswordEmail;

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
