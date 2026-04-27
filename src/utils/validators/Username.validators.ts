export function validateUsername(username: string): string | null {
  if (!username) return "Username is required";

  // only letters, numbers, underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  // cannot start or end with underscore
  if (username.startsWith("_") || username.endsWith("_")) {
    return "Username cannot start or end with underscore";
  }

  // no consecutive underscores
  if (username.includes("__")) {
    return "Username cannot contain consecutive underscores";
  }

  return null;
}