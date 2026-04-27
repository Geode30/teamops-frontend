import type { LoginFormData } from "../../forms/Login";
import { validateUsername } from "./Username.validators";

export function validateLogin(form: LoginFormData): string | null {
  // required fields
  if (!form.username || !form.password) {
    return "All fields are required";
  }

  // USERNAME VALIDATION RULES
  const username = form.username;
  const usernameError = validateUsername(username);
  if (usernameError) return usernameError;

  return null;
}