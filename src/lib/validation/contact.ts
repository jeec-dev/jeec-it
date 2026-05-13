import { z } from "zod";

export const contactTopics = [
  "booking",
  "press",
  "collaborazioni",
  "altro",
] as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Inserisci almeno 2 caratteri.")
    .max(120, "Il nome è troppo lungo."),
  email: z
    .string()
    .trim()
    .email("Inserisci un indirizzo email valido.")
    .max(180, "L'email è troppo lunga."),
  topic: z.enum(contactTopics, {
    error: "Seleziona un argomento valido.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Scrivi almeno 20 caratteri.")
    .max(4000, "Il messaggio è troppo lungo."),
  consentPrivacy: z.literal("on", {
    error: "Devi accettare l'informativa privacy.",
  }),
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
