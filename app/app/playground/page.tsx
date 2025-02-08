"use client";

import { Separator } from "@/components/ui/separator";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { FundCard } from "@coinbase/onchainkit/fund";
import "@coinbase/onchainkit/styles.css";
import { GamepadIcon } from "lucide-react";
import { base } from "viem/chains";

export default function PlaygroundPage() {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={base}
    >
      <main className="container py-16 lg:px-80">
        <div className="flex items-center justify-center size-24 rounded-full bg-primary">
          <GamepadIcon className="size-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
          Playground
        </h1>
        <Separator className="my-8" />
        <FundCard assetSymbol="USDT" country="US" currency="USD" />
      </main>
    </OnchainKitProvider>
  );
}
