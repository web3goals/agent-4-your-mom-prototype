"use server";

import { nillionConfig } from "@/config/nillion";
import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { SystemMessage } from "@langchain/core/messages";
import { PrivyClient } from "@privy-io/server-auth";
import axios from "axios";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const requestBodyAddressBookElementSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
});

const requestBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  emoji: z.string().min(1),
  usdtAddress: z.string().min(1),
  addressBook: z.array(requestBodyAddressBookElementSchema),
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

    // Create a Privy Server Wallet
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
    console.log("Privy Server Wallet is created");

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
    console.log("Agent is inserted to MongoDB");

    // Upload address book to Nillion SecretVault
    await Promise.all(
      nillionConfig.nodes.map(async (node) => {
        const { data } = await axios.post(
          `${node.url}/api/v1/data/create`,
          {
            schema: nillionConfig.schemaAddressBookId,
            data: bodyParseResult.data.addressBook.map((element) => ({
              _id: uuidv4(),
              agent: agent._id?.toString(),
              name: element.name.toLowerCase(),
              address: element.address.toLowerCase(), // TODO: Encode using nilQL
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${node.jwt}`,
              "Content-Type": "application/json",
            },
          }
        );

        return data;
      })
    );
    console.log("Address book is uploaded to Nillion SecretVault");

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
