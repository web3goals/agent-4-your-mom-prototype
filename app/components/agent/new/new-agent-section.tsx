"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import useError from "@/hooks/use-error";
import { toast } from "@/hooks/use-toast";
import { Agent } from "@/mongodb/models/agent";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ArrowRightIcon, BotIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function NewAgentSection() {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const { user } = usePrivy();

  async function handleSubmit() {
    try {
      setIsProsessing(true);

      if (!user) {
        throw new Error("User not defined");
      }

      // Save agent data in MongoDB
      const { data } = await axios.post("/api/agents/new", {
        creator: {
          id: user.id,
        },
        name: "Simon",
        description: "Liza's cat that helps navigate the crypto world",
        emoji: "🐈",
        user: {
          name: "Liza",
          email: "vampirenish666@gmail.com",
        },
        addressBook: [
          {
            name: "Alice",
            address: "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
          },
          {
            name: "Bob",
            address: "0x3F121f9a16bd6C83D325985417aDA3FE0f517B7D",
          },
        ],
        // twitterAccount: {
        //   apiKey: "UNDEFINED",
        //   apiSecret: "UNDEFINED",
        //   accessToken: "UNDEFINED",
        //   accessTokenSecret: "UNDEFINED",
        // },
        extra: {
          usdtAddress: "0x1b21550f42e993d1b692d18d79bcd783638633f2",
        },
      });
      const agent: Agent = data.data;

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
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BotIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        New agent
      </h1>
      <p className="text-muted-foreground mt-1">
        Create a personalized AI agent with crypto features for your Mom or
        other not-techie users
      </p>
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
