"use client";

import { Agent } from "@/mongodb/models/agent";
import { StoredMessage } from "@langchain/core/messages";
import { AgentMessageCardContent } from "./agent-message-card-content";

export function AgentMessageCard(props: {
  agent: Agent;
  message: StoredMessage;
}) {
  if (props.message.type === "ai" && props.message.data.content) {
    return (
      <div className="w-full flex flex-row gap-2">
        <div className="flex items-center justify-center size-8 bg-primary rounded-full">
          <p>{props.agent.personality.emoji}</p>
        </div>
        <div className="flex-1 bg-secondary border rounded-lg px-4 py-3">
          <AgentMessageCardContent content={props.message.data.content} />
        </div>
      </div>
    );
  }

  if (props.message.type === "human" && props.message.data.content) {
    return (
      <div className="flex-1 border rounded-lg px-4 py-3">
        <AgentMessageCardContent content={props.message.data.content} />
      </div>
    );
  }

  return <></>;
}
