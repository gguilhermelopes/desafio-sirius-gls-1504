import { z } from "zod";

const loginEmailMessage = "Digite um e-mail válido.";
const loginPasswordMinMessage = "A senha deve ter pelo menos 8 caracteres.";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(loginEmailMessage),
  password: z.string().min(8, loginPasswordMinMessage),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas precisam ser iguais",
        path: ["passwordConfirmation"],
      });
    }
  });

type FieldErrorMap<TField extends string> = Partial<Record<TField, string>>;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
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
