"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
        router.push("/communications");
        router.refresh();
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
      className="login-form register-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="login-fields register-fields">
        <AuthTextField
          autoComplete="name"
          autoFocus
          error={nameError}
          fieldClassName="login-field"
          helperClassName="login-field-helper"
          helperErrorClassName="is-error"
          helperVisibleClassName="is-visible"
          inputClassName="login-input"
          label={messages.auth.nameLabel}
          labelClassName="login-field-label"
          placeholder="Seu nome"
          reserveHelperSpace
          shellClassName="login-input-shell"
          shellInvalidClassName="is-invalid"
          type="text"
          {...register("name")}
        />

        <AuthTextField
          autoComplete="email"
          error={emailError}
          fieldClassName="login-field"
          helperClassName="login-field-helper"
          helperErrorClassName="is-error"
          helperVisibleClassName="is-visible"
          inputClassName="login-input"
          label={messages.auth.emailLabel}
          labelClassName="login-field-label"
          placeholder="seu@email.com"
          reserveHelperSpace
          shellClassName="login-input-shell"
          shellInvalidClassName="is-invalid"
          type="email"
          {...register("email")}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={passwordError}
          fieldClassName="login-field"
          helper={messages.auth.passwordHint}
          helperClassName="login-field-helper"
          helperErrorClassName="is-error"
          helperVisibleClassName="is-visible"
          inputClassName="login-input"
          label={messages.auth.passwordLabel}
          labelClassName="login-field-label"
          placeholder="*******"
          shellClassName="login-input-shell"
          shellInvalidClassName="is-invalid"
          toggleButtonClassName="login-password-toggle"
          toggleIconClassName="login-password-icon"
          {...register("password")}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={passwordConfirmationError}
          fieldClassName="login-field"
          helper={messages.auth.passwordHint}
          helperClassName="login-field-helper"
          helperErrorClassName="is-error"
          helperVisibleClassName="is-visible"
          inputClassName="login-input"
          label={messages.auth.passwordConfirmationLabel}
          labelClassName="login-field-label"
          placeholder="*******"
          shellClassName="login-input-shell"
          shellInvalidClassName="is-invalid"
          toggleButtonClassName="login-password-toggle"
          toggleIconClassName="login-password-icon"
          {...register("passwordConfirmation")}
        />
      </div>

      {rootError ? (
        <div className="login-inline-error" role="alert">
          <span className="login-inline-error-icon" aria-hidden="true" />
          <span>{rootError}</span>
        </div>
      ) : null}

      <AuthSubmitButton
        className="login-submit"
        disabled={registerMutation.isPending}
        loading={registerMutation.isPending}
        loadingContent={
          <span className="login-submit-spinner" aria-label="Criando conta" />
        }
      >
        {messages.auth.registerButton}
      </AuthSubmitButton>

      <p className="login-footer-link">
        {loginLinkCopy.prefix ? (
          <span className="login-footer-prefix">{loginLinkCopy.prefix} </span>
        ) : null}
        <Link href="/login">{loginLinkCopy.cta}</Link>
      </p>
    </form>
  );
}
