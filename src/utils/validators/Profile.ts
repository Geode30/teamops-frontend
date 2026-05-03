import type { ProfileFormData } from "../../forms/Profile";

export function validateProfile(form: ProfileFormData): string | null {
  // required fields
  if (!form.firstName || !form.lastName) {
    return "All fields are required";
  }
  
  const nameRegex = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;

  if (!nameRegex.test(form.firstName) || !nameRegex.test(form.lastName)) {
    return "First name and Last name can only contain letters and apostrophes";
  }

  return null;
}