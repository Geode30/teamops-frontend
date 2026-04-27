export function getErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "message" in err
  ) {
    const message = (err as { message: unknown }).message;

    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(", ");
    }
  }

  return "Something went wrong";
}