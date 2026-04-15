"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { registerAction } from "../actions/register";
import { splitAuthLinkCopy } from "./auth-link-copy";
import { AuthPasswordField } from "./auth-password-field";
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
  const loginLinkCopy = splitAuthLinkCopy(messages.auth.loginLink);
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterInput>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerAction,
    onSuccess: (result) => {
      if (result.success) {
        window.location.href = "/communications";
        return;
      }

      if (result.fieldErrors?.name) {
        setError("name", {
          type: "server",
          message: result.fieldErrors.name,
        });
      }

      if (result.fieldErrors?.email) {
        setError("email", {
          type: "server",
          message: result.fieldErrors.email,
        });
      }

      if (result.fieldErrors?.password) {
        setError("password", {
          type: "server",
          message: result.fieldErrors.password,
        });
      }

      if (result.fieldErrors?.passwordConfirmation) {
        setError("passwordConfirmation", {
          type: "server",
          message: result.fieldErrors.passwordConfirmation,
        });
      }

      if (result.error === messages.auth.duplicateEmail) {
        setError("email", {
          type: "server",
          message: result.error,
        });
        return;
      }

      if (result.error && !result.fieldErrors) {
        setError("root.server", {
          type: "server",
          message: result.error,
        });
      }
    },
  });

  const nameError = errors.name?.message;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const passwordConfirmationError = errors.passwordConfirmation?.message;
  const rootError = errors.root?.server?.message;

  function onSubmit(values: RegisterInput) {
    clearErrors();
    registerMutation.mutate(values);
  }

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <AuthTextField
          autoComplete="name"
          autoFocus
          error={nameError}
          label={messages.auth.nameLabel}
          placeholder="Seu nome"
          reserveHelperSpace
          type="text"
          {...register("name")}
        />

        <AuthTextField
          autoComplete="email"
          error={emailError}
          label={messages.auth.emailLabel}
          placeholder="seu@email.com"
          reserveHelperSpace
          type="email"
          {...register("email")}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={passwordError}
          helper={messages.auth.passwordHint}
          label={messages.auth.passwordLabel}
          placeholder="*******"
          {...register("password")}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={passwordConfirmationError}
          helper={messages.auth.passwordHint}
          label={messages.auth.passwordConfirmationLabel}
          placeholder="*******"
          {...register("passwordConfirmation")}
        />
      </div>

      {rootError ? (
        <div className="flex items-start gap-2 m-0 text-red-600 text-[13px] leading-[1.2]" role="alert">
          <span
            className="relative flex-none w-4 h-4 mt-px border-[1.6px] border-current rounded-full before:content-['!'] before:absolute before:inset-0 before:grid before:place-items-center before:text-[11px] before:font-bold before:leading-none"
            aria-hidden="true"
          />
          <span>{rootError}</span>
        </div>
      ) : null}

      <AuthSubmitButton
        disabled={registerMutation.isPending}
        loading={registerMutation.isPending}
        loadingContent={
          <span
            className="inline-block w-4 h-4 border-2 border-neutral-50/35 border-t-neutral-50 rounded-full animate-[login-spin_0.9s_linear_infinite]"
            aria-label="Criando conta"
          />
        }
      >
        {messages.auth.registerButton}
      </AuthSubmitButton>

      <p className="m-0 text-center text-[13px] leading-[1.2] text-neutral-800">
        {loginLinkCopy.prefix ? (
          <span>{loginLinkCopy.prefix} </span>
        ) : null}
        <Link className="text-[#105abc] no-underline hover:underline" href="/login">
          {loginLinkCopy.cta}
        </Link>
      </p>
    </form>
  );
}
