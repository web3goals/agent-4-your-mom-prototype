"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Agent } from "@/mongodb/models/agent";
import { ArrowRightIcon, BotIcon } from "lucide-react";
import Link from "next/link";

export function NewAgentCreatedSection(props: { newAgent: Agent }) {
  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BotIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Agent created
      </h1>
      {/* TODO: Define step description */}
      <p className="text-muted-foreground mt-1">...</p>
      <Separator className="my-8" />
      <Link href={`/agents/${props.newAgent._id}`}>
        <Button variant="default">
          <ArrowRightIcon /> Open agent
        </Button>
      </Link>
    </main>
  );
}
