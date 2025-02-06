import { User } from "@privy-io/react-auth";
import { AxiosError } from "axios";

export function errorToString(error: unknown): string {
  let message = JSON.stringify(error);
  if (error instanceof Error) {
    message = error.message;
  }
  if (error instanceof AxiosError) {
    message = JSON.stringify({
      status: error.response?.status,
      data: error.response?.data,
    });
  }
  return message;
}

export function privyUserToEmail(user: User | null): string | undefined {
  return user?.email?.address || user?.google?.email;
}
