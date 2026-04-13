import { SupportedLocale } from "./config";
import { enMessages } from "./dictionaries/en";
import { ptBRMessages } from "./dictionaries/pt-BR";

export type AppMessages = typeof ptBRMessages;

export function getMessages(locale: SupportedLocale) {
  return locale === "en" ? enMessages : ptBRMessages;
}
