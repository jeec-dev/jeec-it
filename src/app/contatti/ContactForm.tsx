"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm } from "./actions";
import type { ContactFormState } from "./actions";
import styles from "./ContactForm.module.css";

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submitButton} type="submit" disabled={pending}>
      {pending ? "Invio in corso..." : "Invia messaggio"}
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className={styles.fieldError}>{errors[0]}</p>;
}

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  return (
    <section className={styles.section} aria-labelledby="contact-form-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Secure transmission</p>
        <h2 id="contact-form-title">Scrivi direttamente dal sito</h2>
        <p>
          Per booking, press, collaborazioni o richieste generiche: lascia il
          messaggio qui sotto e verrà recapitato al team JeeC.
        </p>
      </div>

      <form className={styles.form} action={formAction}>
        <div className={styles.hiddenField} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Nome</span>
            <input name="name" type="text" autoComplete="name" required />
            <FieldError errors={state.fieldErrors?.name} />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
            <FieldError errors={state.fieldErrors?.email} />
          </label>
        </div>

        <label className={styles.field}>
          <span>Argomento</span>
          <select name="topic" required defaultValue="">
            <option value="" disabled>
              Seleziona un canale
            </option>
            <option value="booking">Booking / Live</option>
            <option value="press">Press / Media</option>
            <option value="collaborazioni">Collaborazioni</option>
            <option value="altro">Altro</option>
          </select>
          <FieldError errors={state.fieldErrors?.topic} />
        </label>

        <label className={styles.field}>
          <span>Messaggio</span>
          <textarea
            name="message"
            rows={7}
            placeholder="Racconta richiesta, periodo, città, budget indicativo, link utili o contesto..."
            required
          />
          <FieldError errors={state.fieldErrors?.message} />
        </label>

        <label className={styles.checkbox}>
          <input name="consentPrivacy" type="checkbox" required />
          <span>
            Ho letto l’informativa privacy e autorizzo il trattamento dei dati
            per ricevere risposta alla mia richiesta.
          </span>
        </label>
        <FieldError errors={state.fieldErrors?.consentPrivacy} />

        {state.message ? (
          <p className={styles.status} data-status={state.status}>
            {state.message}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </section>
  );
}
