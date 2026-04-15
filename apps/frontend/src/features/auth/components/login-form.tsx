"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginAction } from "../actions/login";
import { splitAuthLinkCopy } from "./auth-link-copy";
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
  const registerLinkCopy = splitAuthLinkCopy(messages.auth.registerLink);
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
          message: result.error,
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
    <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <AuthTextField
          autoComplete="email"
          autoFocus
          error={emailError}
          label={messages.auth.emailLabel}
          placeholder="seu@email.com"
          reserveHelperSpace
          type="email"
          {...register("email")}
        />

        <AuthPasswordField
          autoComplete="current-password"
          error={passwordError}
          label={messages.auth.passwordLabel}
          placeholder="*******"
          reserveHelperSpace
          {...register("password")}
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
        disabled={loginMutation.isPending}
        loading={loginMutation.isPending}
        loadingContent={
          <span
            className="inline-block w-4 h-4 border-2 border-neutral-50/35 border-t-neutral-50 rounded-full animate-[login-spin_0.9s_linear_infinite]"
            aria-label="Entrando"
          />
        }
      >
        {messages.auth.loginButton}
      </AuthSubmitButton>

      <p className="m-0 text-center text-[13px] leading-[1.2] text-neutral-800">
        {registerLinkCopy.prefix ? (
          <span>{registerLinkCopy.prefix} </span>
        ) : null}
        <Link className="font-normal text-blue-600 no-underline hover:underline" href="/register">
          {registerLinkCopy.cta}
        </Link>
      </p>
    </form>
  );
}
