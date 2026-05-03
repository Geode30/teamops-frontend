import type { CredentialsFormData } from "../../forms/Credentials";
import { validateUsername } from "./Username.validators";

export function validateCredentials(form: CredentialsFormData): string | null {
  // required fields
  if (!form.username || !form.password || !form.confirmPassword) {
    return "All fields are required";
  }
  // USERNAME VALIDATION RULES
  const username = form.username;
  const usernameError = validateUsername(username);
  if (usernameError) return usernameError;

  // password checks
  if (form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}