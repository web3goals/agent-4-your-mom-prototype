"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import useError from "@/hooks/use-error";
import { toast } from "@/hooks/use-toast";
import { Agent } from "@/mongodb/models/agent";
import axios from "axios";
import { ArrowRightIcon, BotIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// TODO: Implement
export default function NewAgentPage() {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  async function handleSubmit() {
    try {
      setIsProsessing(true);

      // Save agent data in MongoDB
      const { data } = await axios.post("/api/agents/new", {
        name: "Super Agent",
      });
      const agent: Agent = data.data;

      // Save agent sensitive data in Nillion SecretVault (do it in API)
      // TODO:

      // Show a succesfull create page with link to the agent with copy button and form to top up his balance
      // TODO:
      toast({
        title: "Agent created ✨",
        description: agent._id?.toString(),
        action: (
          <ToastAction altText="Try again">
            <Link href={`/agents/${agent._id}`}>Open</Link>
          </ToastAction>
        ),
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-16 rounded-full bg-primary">
        <BotIcon className="text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tighter mt-2">
        New agent
      </h1>
      <Separator className="my-4" />
      <Button
        variant="default"
        disabled={isProsessing}
        onClick={() => handleSubmit()}
      >
        {isProsessing ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <ArrowRightIcon />
        )}
        Create
      </Button>
    </main>
  );
}
