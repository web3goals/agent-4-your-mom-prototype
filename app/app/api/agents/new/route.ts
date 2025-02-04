"use server";

import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { SystemMessage } from "@langchain/core/messages";
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  emoji: z.string().min(1),
  usdtAddress: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: "Request invalid",
        },
        400
      );
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
    const systemMessageContent = [
      "You are a helpful agent that helps with blockchain operations.",
      "Your extra knowledge:",
      `Address of the contract for 'dollars', 'USD tokens', 'USDT' is ${bodyParseResult.data.usdtAddress}.`,
    ].join("\n\n");
    const agent: Agent = {
      name: bodyParseResult.data.name,
      description: bodyParseResult.data.description,
      emoji: bodyParseResult.data.emoji,
      messages: [
        new SystemMessage({
          content: systemMessageContent,
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
