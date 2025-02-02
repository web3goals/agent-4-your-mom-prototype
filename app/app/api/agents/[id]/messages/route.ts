"use server";

import { errorToString } from "@/lib/converters";
import { findAgent, updateAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import {
  HumanMessage,
  mapStoredMessagesToChatMessages,
} from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get request data
    const { id } = await params;
    const authorization = (await headers()).get("Authorization");
    const body = await request.json();
    const bodyMessage: string = body.message;
    if (!authorization || !bodyMessage) {
      return createFailedApiResponse({ message: "Request invalid" }, 400);
    }

    // Load agent data using MongoDB
    const agent = await findAgent(new ObjectId(id));
    if (!agent) {
      return createFailedApiResponse({ message: "Not found" }, 404);
    }

    // Check that the user has access to the agent
    // TODO:

    // Load agent sensitive data from Nillion SecretVault
    // TODO:

    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Initialize CDP AgentKit
    const agentKit = await CdpAgentkit.configureWithWallet({
      networkId: "base-sepolia",
    });

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentKit);
    const tools = cdpToolkit.getTools();

    // Create an agent
    const reactAgent = createReactAgent({
      llm: llm,
      tools,
    });

    // Use the agent
    const result = await reactAgent.invoke(
      {
        messages: [
          ...mapStoredMessagesToChatMessages(agent.messages),
          new HumanMessage({ content: bodyMessage }),
        ],
      },
      { configurable: { thread_id: 42 } }
    );

    // Update agent data in MongoDB
    await updateAgent({
      id: agent._id as ObjectId,
      newMessages: result.messages.map((message) => message.toDict()),
    });

    // Return the agent answer
    return createSuccessApiResponse(result.messages.at(-1)?.content);
  } catch (error) {
    console.error(
      `Failed to process ${request.method} request for "${
        new URL(request.url).pathname
      }":`,
      errorToString(error)
    );
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
