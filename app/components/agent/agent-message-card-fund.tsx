"use client";

import { Agent } from "@/mongodb/models/agent";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { FundCard } from "@coinbase/onchainkit/fund";
import { extractChain } from "viem";
import * as chains from "viem/chains";

export function AgentMessageCardFund(props: { agent: Agent }) {
  const chain = extractChain({
    chains: Object.values(chains),
    id: props.agent.chainId as (typeof chains)[keyof typeof chains]["id"],
  });

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={chain}
    >
      <FundCard assetSymbol="USDT" country="US" currency="USD" />
    </OnchainKitProvider>
  );
}
