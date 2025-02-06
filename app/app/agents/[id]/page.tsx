"use client";

import { AgentLoaderSection } from "@/components/agent/agent-loader-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";

export default function AgentPage() {
  const { id } = useParams();
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <AgentLoaderSection id={id as string} />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
