"use client";

import { NewAgentSection } from "@/components/agent/new/new-agent-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function NewAgentPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <NewAgentSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
