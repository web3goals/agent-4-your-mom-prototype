"use client";

import { LoadingSection } from "@/components/loading-section";
import useError from "@/hooks/use-error";
import { privyUserToEmail } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { usePrivy } from "@privy-io/react-auth";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AccessDeniedSection } from "../access-denied-section";
import { AgentSection } from "./agent-section";

export function AgentLoaderSection(props: { id: string }) {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [agent, setAgent] = useState<Agent | undefined>();
  const [agentAccessDenied, setAgentAccessDenied] = useState(false);

  useEffect(() => {
    setAgent(undefined);
    if (user) {
      axios
        .get(`/api/agents/${props.id}`, {
          headers: { Authorization: `Bearer ${privyUserToEmail(user)}` },
        })
        .then(({ data }) => {
          setAgent(data.data);
        })
        .catch((error) => {
          if (error instanceof AxiosError && error.status === 401) {
            setAgentAccessDenied(true);
          } else {
            handleError(error, "Failed to load the agent, try again later");
          }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, user]);

  if (agent) {
    return (
      <AgentSection agent={agent} onAgentUpdate={(agent) => setAgent(agent)} />
    );
  }

  if (agentAccessDenied) {
    return <AccessDeniedSection />;
  }

  return <LoadingSection />;
}
