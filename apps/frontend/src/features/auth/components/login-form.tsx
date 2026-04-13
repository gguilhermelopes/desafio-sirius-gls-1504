"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAction } from "../actions/login";
import { LoginInput } from "../schemas/auth";

type LoginFormProps = {
  messages: {
    auth: {
      emailLabel: string;
      invalidCredentials: string;
      loginButton: string;
      passwordLabel: string;
      registerLink: string;
      unexpectedError: string;
    };
  };
};

export function LoginForm({ messages }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await loginAction(values);

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
          {error === "E-mail ou senha inválidos."
            ? messages.auth.invalidCredentials
            : error}
        </div>
      ) : null}

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
          autoComplete="current-password"
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
        {fieldErrors.password ? (
          <small className="auth-field-error">{fieldErrors.password}</small>
        ) : null}
      </label>

      <button className="auth-submit" disabled={isPending} type="submit">
        {isPending ? "Entrando..." : messages.auth.loginButton}
      </button>

      <p className="auth-footer-link">
        <Link href="/register">{messages.auth.registerLink}</Link>
      </p>
    </form>
  );
}
