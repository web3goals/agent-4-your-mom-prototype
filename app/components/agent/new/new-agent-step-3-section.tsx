"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { ArrowRightIcon, BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { baseSepolia } from "viem/chains";

export function NewAgentStep3Section(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  async function handleSubmit() {
    try {
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        chain: {
          id: baseSepolia.id,
          usdtAddress: "0x1b21550f42e993d1b692d18d79bcd783638633f2",
        },
      });
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
        Step #3
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
        Next step
      </Button>
    </main>
  );
}
