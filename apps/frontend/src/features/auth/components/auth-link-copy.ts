export function splitAuthLinkCopy(copy: string) {
  const questionMarkIndex = copy.indexOf("? ");

  if (questionMarkIndex >= 0) {
    return {
      cta: copy.slice(questionMarkIndex + 2),
      prefix: copy.slice(0, questionMarkIndex + 1),
    };
  }

  return {
    cta: copy,
    prefix: "",
  };
}
