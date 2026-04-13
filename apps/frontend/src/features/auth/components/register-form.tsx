"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerAction } from "../actions/register";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthInlineError } from "./auth-inline-error";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthTextField } from "./auth-text-field";
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
        <AuthInlineError className="auth-inline-error">
          {error === "Este e-mail já está em uso."
            ? messages.auth.duplicateEmail
            : error}
        </AuthInlineError>
      ) : null}

      <AuthTextField
        autoComplete="name"
        error={fieldErrors.name}
        errorClassName="auth-field-error"
        fieldClassName="auth-field"
        label={messages.auth.nameLabel}
        name="name"
        onChange={(event) =>
          setValues((current) => ({ ...current, name: event.target.value }))
        }
        type="text"
        value={values.name}
      />

      <AuthTextField
        autoComplete="email"
        error={fieldErrors.email}
        errorClassName="auth-field-error"
        fieldClassName="auth-field"
        label={messages.auth.emailLabel}
        name="email"
        onChange={(event) =>
          setValues((current) => ({ ...current, email: event.target.value }))
        }
        type="email"
        value={values.email}
      />

      <AuthTextField
        autoComplete="new-password"
        error={fieldErrors.password}
        errorClassName="auth-field-error"
        fieldClassName="auth-field"
        helper={messages.auth.passwordHint}
        helperClassName="auth-field-hint"
        showHelperWithError
        label={messages.auth.passwordLabel}
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

      <AuthTextField
        autoComplete="new-password"
        error={fieldErrors.passwordConfirmation}
        errorClassName="auth-field-error"
        fieldClassName="auth-field"
        label={messages.auth.passwordConfirmationLabel}
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

      <AuthSubmitButton className="auth-submit" disabled={isPending}>
        {isPending ? "Criando..." : messages.auth.registerButton}
      </AuthSubmitButton>

      <AuthFooterLink
        className="auth-footer-link"
        href="/login"
        linkLabel={messages.auth.loginLink}
      />
    </form>
  );
}
