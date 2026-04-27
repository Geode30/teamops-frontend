import type { SignupFormData } from "../../forms/SignUp";
import { validateUsername } from "./Username.validators";

export function validateSignup(form: SignupFormData): string | null {
  // required fields
  if (!form.first_name || !form.last_name || !form.username) {
    return "All fields are required";
  }

  // FIRST + LAST NAME VALIDATION
  const nameRegex = /^[A-Za-zÀ-ÿ]+(?:'[A-Za-zÀ-ÿ]+)?$/;

  if (!nameRegex.test(form.first_name)) {
    return "First name and Last name can only contain letters and apostrophes";
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