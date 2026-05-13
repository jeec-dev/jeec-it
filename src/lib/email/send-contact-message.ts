import { Resend } from "resend";

type SendContactMessageInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
  messageId: string;
};

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendContactMessageEmail({
  name,
  email,
  topic,
  message,
  messageId,
}: SendContactMessageInput) {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!resend || !to || !from) {
    console.warn("[ContactForm] Email provider is not configured.");
    return { skipped: true };
  }

  return resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nuovo messaggio contatti JeeC · ${topic}`,
    text: [
      `Nuovo messaggio dal sito jeec.it`,
      ``,
      `ID messaggio: ${messageId}`,
      `Nome: ${name}`,
      `Email: ${email}`,
      `Argomento: ${topic}`,
      ``,
      `Messaggio:`,
      message,
    ].join("\n"),
  });
}
