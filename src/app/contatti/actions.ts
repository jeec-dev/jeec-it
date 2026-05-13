"use server";

import { db } from "@/lib/db";
import { sendContactMessageEmail } from "@/lib/email/send-contact-message";
import { contactFormSchema } from "@/lib/validation/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    consentPrivacy: formData.get("consentPrivacy"),
    website: formData.get("website"),
  };

  const parsed = contactFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Controlla i campi evidenziati e riprova.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.website) {
    return {
      status: "success",
      message: "Messaggio inviato correttamente.",
    };
  }

  try {
    const contactMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        topic: data.topic,
        message: data.message,
        consentPrivacy: true,
        source: "contact-page",
        status: "new",
      },
    });

    await sendContactMessageEmail({
      name: data.name,
      email: data.email,
      topic: data.topic,
      message: data.message,
      messageId: contactMessage.id,
    });

    return {
      status: "success",
      message:
        "Messaggio inviato. Se serve una risposta, JeeC o il team ti ricontatteranno via email.",
    };
  } catch (error) {
    console.error("[ContactForm] Submit failed:", error);

    return {
      status: "error",
      message:
        "Non è stato possibile inviare il messaggio. Riprova tra poco o scrivi direttamente a info@jeec.it.",
    };
  }
}
