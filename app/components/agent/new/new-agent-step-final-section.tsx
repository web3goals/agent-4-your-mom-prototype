"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ArrowRightIcon, BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

export function NewAgentFinalStepSection(props: {
  newAgentRequestData: NewAgentRequestData;
  onAgentDefine: (agent: Agent) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const { user } = usePrivy();

  async function handleSubmit() {
    try {
      setIsProsessing(true);

      if (!user) {
        throw new Error("User not defined");
      }

      // Send request to create an agent
      const { data } = await axios.post("/api/agents/new", {
        ...props.newAgentRequestData,
        creator: {
          id: user.id,
        },
      } as NewAgentRequestData);
      const agent: Agent = data.data;
      props.onAgentDefine(agent);
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BotIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Final step
      </h1>
      {/* TODO: Define step description */}
      <p className="text-muted-foreground mt-1">...</p>
      <Separator className="my-8" />
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
