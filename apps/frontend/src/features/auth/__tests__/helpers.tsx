import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";

export const loginMessages = {
  auth: {
    emailLabel: "E-mail",
    invalidCredentials: "E-mail ou senha inválidos.",
    loginButton: "Entrar",
    passwordLabel: "Senha",
    registerLink: "Não tem conta? Cadastre-se",
    unexpectedError: "Ocorreu um erro inesperado. Tente novamente.",
  },
} as const;

export const registerMessages = {
  auth: {
    duplicateEmail: "Este e-mail já está em uso.",
    emailLabel: "E-mail",
    loginLink: "Já tem conta? Entrar",
    nameLabel: "Nome completo",
    passwordConfirmationLabel: "Confirme sua senha",
    passwordHint: "Mínimo de 8 caracteres",
    passwordLabel: "Senha",
    registerButton: "Criar conta",
    unexpectedError: "Ocorreu um erro inesperado. Tente novamente.",
  },
} as const;

export function renderWithQueryClient(element: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>,
  );
}
