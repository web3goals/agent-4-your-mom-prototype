"use server";

import { errorToString } from "@/lib/converters";
import { findAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { BaseMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

// TODO: Use access token from Privy instead of email in authorization header
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get request data
    const { id } = await params;
    const authorization = (await headers()).get("Authorization");
    if (!authorization) {
      return createFailedApiResponse({ message: "Request invalid" }, 400);
    }

    // Load agent data using MongoDB
    const agent = await findAgent(new ObjectId(id));
    if (!agent) {
      return createFailedApiResponse({ message: "Not found" }, 404);
    }

    // Check that the user has access to the agent
    // TODO:

    // Return agent data
    return createSuccessApiResponse(agent);
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get request data
    const { id } = await params;
    const authorization = (await headers()).get("Authorization");
    const body = await request.json();
    const bodyMessages: BaseMessage[] = body.messages;
    if (!authorization || !bodyMessages) {
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
      { messages: bodyMessages },
      { configurable: { thread_id: 42 } }
    );

    // Update agent messages in MongoDB
    // TODO:

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
