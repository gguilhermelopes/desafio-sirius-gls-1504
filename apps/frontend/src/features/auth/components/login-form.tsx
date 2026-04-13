"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginAction } from "../actions/login";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthInlineError } from "./auth-inline-error";
import { AuthPasswordField } from "./auth-password-field";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthTextField } from "./auth-text-field";
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
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: (result) => {
      if (result.success) {
        router.push("/communications");
        router.refresh();
        return;
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

      if (
        result.error === messages.auth.invalidCredentials &&
        !result.fieldErrors?.email &&
        !result.fieldErrors?.password
      ) {
        setError("email", { type: "server", message: " " });
        setError("password", { type: "server", message: " " });
      }

      if (result.error) {
        setError("root.server", {
          type: "server",
          message:
            result.error === messages.auth.invalidCredentials
              ? "E-mail ou senha incorretos. Verifique os dados e tente novamente."
              : result.error,
        });
      }
    },
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const rootError = errors.root?.server?.message;

  function onSubmit(values: LoginInput) {
    clearErrors();
    loginMutation.mutate(values);
  }

  return (
    <form className="login-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="login-fields">
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
          autoComplete="current-password"
          error={passwordError}
          fieldClassName="login-field"
          helperClassName="login-field-helper"
          helperErrorClassName="is-error"
          helperVisibleClassName="is-visible"
          inputClassName="login-input"
          label={messages.auth.passwordLabel}
          labelClassName="login-field-label"
          placeholder="*******"
          reserveHelperSpace
          shellClassName="login-input-shell"
          shellInvalidClassName="is-invalid"
          toggleButtonClassName="login-password-toggle"
          toggleIconClassName="login-password-icon"
          {...register("password")}
        />
      </div>

      {rootError ? (
        <AuthInlineError
          className="login-inline-error"
          iconClassName="login-inline-error-icon"
        >
          {rootError}
        </AuthInlineError>
      ) : null}

      <AuthSubmitButton
        className="login-submit"
        disabled={loginMutation.isPending}
        loading={loginMutation.isPending}
        loadingContent={
          <span className="login-submit-spinner" aria-label="Entrando" />
        }
      >
        {messages.auth.loginButton}
      </AuthSubmitButton>

      <AuthFooterLink
        className="login-footer-link"
        href="/register"
        linkLabel="Cadastre-se"
        prefix="Não tem conta?"
        prefixClassName="login-footer-prefix"
      />
    </form>
  );
}
