"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Agent } from "@/mongodb/models/agent";
import { PartyPopperIcon, ShareIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { extractChain } from "viem";
import * as chains from "viem/chains";

export function NewAgentCreatedSection(props: { newAgent: Agent }) {
  const chain = extractChain({
    chains: Object.values(chains),
    id: props.newAgent.chainId as (typeof chains)[keyof typeof chains]["id"],
  });

  return (
    <main className="container py-16 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <PartyPopperIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Agent created
      </h1>
      <p className="text-muted-foreground mt-1">
        Fund the agent&apos;s wallet with ETH and USD tokens and share the link
        with the target user
      </p>
      <Separator className="my-8" />
      <div className="flex flex-col items-start gap-2">
        <Link
          href={
            `${chain.blockExplorers?.default.url}/address/${props.newAgent.privyServerWallet.address}` ||
            "/"
          }
          target="_blank"
        >
          <Button variant="outline">
            <WalletIcon /> Open wallet
          </Button>
        </Link>
        <Button
          variant="default"
          onClick={() => {
            navigator.clipboard
              .writeText(`${window.location.host}/agents/${props.newAgent._id}`)
              .then(() => toast({ title: "Link copied 👌" }))
              .catch((error) => console.error("Failed to copy text: ", error));
          }}
        >
          <ShareIcon /> Share link
        </Button>
      </div>
      <Confetti
        width={document.body.clientWidth}
        height={document.body.scrollHeight}
        recycle={false}
      />
    </main>
  );
}
