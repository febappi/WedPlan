// Shared form rules for sign in and sign up, so the live checks and the submit checks always agree

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const getEmailError = (email: string) => {
  const value = email.trim();
  if (!value) {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(value)) {
    return "Enter a valid email, like you@example.com";
  }
  return "";
};

export const passwordRules = [
  { id: "length", label: "At least 6 characters", test: (password: string) => password.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
  { id: "lower", label: "One lowercase letter", test: (password: string) => /[a-z]/.test(password) },
];

export const getPasswordError = (password: string) => {
  if (!password) {
    return "Password is required";
  }
  const failed = passwordRules.find((rule) => !rule.test(password));
  return failed ? `Password needs ${failed.label.toLowerCase()}` : "";
};
