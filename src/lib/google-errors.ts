// Better Auth sends Google failures back as ?error=<code>&error_description=<text>.
// These turn them into messages a person can act on.
const messages: Record<string, string> = {
  access_denied: "Google sign in was cancelled. Please try again.",
  account_not_linked: "This email already has a WedPlan account. Sign in with your email and password.",
  email_not_found: "Google did not share an email address. Please try another Google account.",
  invalid_code: "Google sign in expired before it finished. Please try again.",
  state_mismatch: "Google sign in expired before it finished. Please try again.",
  state_not_found: "Google sign in expired before it finished. Please try again.",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

export const getGoogleErrorMessage = (params: Record<string, string | string[] | undefined>) => {
  const code = getText(params.error);
  if (!code) {
    return "";
  }
  if (messages[code]) {
    return messages[code];
  }
  // Errors from our own checks, such as a blocked account, carry their message in the description
  const description = getText(params.error_description);
  return description || `Google sign in did not finish (${code.replace(/_/g, " ")}). Please try again.`;
};
