import { z } from "zod";
import type { LoginRequest, RegisterRequest } from "@juscash/shared";

const loginEmailMessage = "Digite um e-mail válido.";
const loginPasswordRequiredMessage = "Digite sua senha.";
const registerNameMessage = "Digite seu nome completo.";
const registerEmailMessage = "Digite um e-mail válido.";
const registerPasswordMinMessage = "A senha deve ter pelo menos 8 caracteres.";
const registerPasswordMismatchMessage = "As senhas precisam ser iguais.";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(loginEmailMessage),
  password: z.string().refine((value) => value.trim().length > 0, {
    message: loginPasswordRequiredMessage,
  }),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, registerNameMessage),
    email: z.string().trim().toLowerCase().email(registerEmailMessage),
    password: z.string().min(8, registerPasswordMinMessage),
    passwordConfirmation: z.string().min(8, registerPasswordMinMessage),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: registerPasswordMismatchMessage,
        path: ["passwordConfirmation"],
      });
    }
  });

type FieldErrorMap<TField extends string> = Partial<Record<TField, string>>;

export type LoginInput = LoginRequest;
export type RegisterInput = RegisterRequest;
export type AuthActionResult<TField extends string> = {
  error?: string;
  fieldErrors?: FieldErrorMap<TField>;
  success: boolean;
};

export function mapFieldErrors<TField extends string>(
  error: z.ZodError,
): FieldErrorMap<TField> {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors: FieldErrorMap<TField> = {};

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages && messages[0]) {
      fieldErrors[field as TField] = messages[0];
    }
  }

  return fieldErrors;
}
