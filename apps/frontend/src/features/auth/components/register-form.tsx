"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerAction } from "../actions/register";
import { RegisterInput } from "../schemas/auth";

type RegisterFormProps = {
  messages: {
    auth: {
      duplicateEmail: string;
      emailLabel: string;
      loginLink: string;
      nameLabel: string;
      passwordConfirmationLabel: string;
      passwordHint: string;
      passwordLabel: string;
      registerButton: string;
      unexpectedError: string;
    };
  };
};

export function RegisterForm({ messages }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<RegisterInput>({
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await registerAction(values);

      if (result.success) {
        router.push("/communications");
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setError(result.error ?? messages.auth.unexpectedError);
    });
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      {error ? (
        <div className="auth-inline-error" role="alert">
          {error === "Este e-mail já está em uso."
            ? messages.auth.duplicateEmail
            : error}
        </div>
      ) : null}

      <label className="auth-field">
        <span>{messages.auth.nameLabel}</span>
        <input
          aria-invalid={Boolean(fieldErrors.name)}
          autoComplete="name"
          name="name"
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          type="text"
          value={values.name}
        />
        {fieldErrors.name ? (
          <small className="auth-field-error">{fieldErrors.name}</small>
        ) : null}
      </label>

      <label className="auth-field">
        <span>{messages.auth.emailLabel}</span>
        <input
          aria-invalid={Boolean(fieldErrors.email)}
          autoComplete="email"
          name="email"
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          type="email"
          value={values.email}
        />
        {fieldErrors.email ? (
          <small className="auth-field-error">{fieldErrors.email}</small>
        ) : null}
      </label>

      <label className="auth-field">
        <span>{messages.auth.passwordLabel}</span>
        <input
          aria-invalid={Boolean(fieldErrors.password)}
          autoComplete="new-password"
          name="password"
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
          type="password"
          value={values.password}
        />
        <small className="auth-field-hint">{messages.auth.passwordHint}</small>
        {fieldErrors.password ? (
          <small className="auth-field-error">{fieldErrors.password}</small>
        ) : null}
      </label>

      <label className="auth-field">
        <span>{messages.auth.passwordConfirmationLabel}</span>
        <input
          aria-invalid={Boolean(fieldErrors.passwordConfirmation)}
          autoComplete="new-password"
          name="passwordConfirmation"
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              passwordConfirmation: event.target.value,
            }))
          }
          type="password"
          value={values.passwordConfirmation}
        />
        {fieldErrors.passwordConfirmation ? (
          <small className="auth-field-error">
            {fieldErrors.passwordConfirmation}
          </small>
        ) : null}
      </label>

      <button className="auth-submit" disabled={isPending} type="submit">
        {isPending ? "Criando..." : messages.auth.registerButton}
      </button>

      <p className="auth-footer-link">
        <Link href="/login">{messages.auth.loginLink}</Link>
      </p>
    </form>
  );
}
