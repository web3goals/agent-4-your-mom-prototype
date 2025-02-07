"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { NewAgentStep1Data } from "@/types/new-agent-step-1-data";
import { NewAgentStep2Data } from "@/types/new-agent-step-2-data";
import { NewAgentStep3Data } from "@/types/new-agent-step-3-data";
import { NewAgentStep4Data } from "@/types/new-agent-step-4-data";
import { NewAgentStep5Data } from "@/types/new-agent-step-5-data";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ArrowRightIcon, BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

export function NewAgentFinalStepSection(props: {
  step1Data: NewAgentStep1Data;
  step2Data: NewAgentStep2Data;
  step3Data: NewAgentStep3Data;
  step4Data: NewAgentStep4Data;
  step5Data: NewAgentStep5Data;
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
        creator: {
          id: user.id,
        },
        name: props.step1Data.name,
        description: props.step1Data.description,
        emoji: props.step1Data.emoji,
        user: {
          name: props.step2Data.userName,
          email: props.step2Data.userEmail,
          description: props.step2Data.userDescription,
        },
        chain: {
          id: props.step3Data.chainId,
          usdtAddress: props.step3Data.chainUsdtAddress,
        },
        addressBook: props.step4Data.addressBook,
        ...(props.step5Data.twitterApiKey &&
          props.step5Data.twitterApiSecret &&
          props.step5Data.twitterAccessToken &&
          props.step5Data.twitterAccessTokenSecret && {
            twitterAccount: {
              apiKey: props.step5Data.twitterApiKey,
              apiSecret: props.step5Data.twitterApiSecret,
              accessToken: props.step5Data.twitterAccessToken,
              accessTokenSecret: props.step5Data.twitterAccessTokenSecret,
            },
          }),
      });
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
