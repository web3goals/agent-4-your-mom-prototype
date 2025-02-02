"use server";

import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { SystemMessage } from "@langchain/core/messages";
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get request data
    const body = await request.json();
    const bodyName: string = body.name;
    if (!bodyName) {
      return createFailedApiResponse({ message: "Request invalid" }, 400);
    }

    // Create a Privy server wallet
    const privy = new PrivyClient(
      process.env.PRIVY_APP_ID as string,
      process.env.PRIVY_APP_SECRET as string
    );
    const {
      id: privyId,
      address: privyAddress,
      chainType: privyChainType,
    } = await privy.walletApi.create({
      chainType: "ethereum",
    });

    // Create an agent
    // TODO: Use this system prompt idea - https://docs.cdp.coinbase.com/agentkit/docs/quickstart#creating-your-first-agent
    const agent: Agent = {
      name: bodyName,
      messages: [
        new SystemMessage({
          content:
            "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.",
        }).toDict(),
      ],
      privyServerWallet: {
        id: privyId,
        address: privyAddress,
        chainType: privyChainType,
      },
      createdDate: new Date(),
    };
    const agentId = await insertAgent(agent);
    agent._id = agentId;

    // Return the agent
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
