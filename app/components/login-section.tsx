"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LogInIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export function LoginSection() {
  const { login } = usePrivy();

  return (
    <main className="container py-16 lg:px-80">
      <div>
        <div className="flex items-center justify-center size-24 rounded-full bg-primary">
          <LogInIcon className="size-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
          Login
        </h1>
        <p className="text-muted-foreground mt-1">Please login to continue</p>
        <Separator className="my-8" />
        <Button variant="default" onClick={() => login()}>
          <LogInIcon /> Login
        </Button>
      </div>
    </main>
  );
}
