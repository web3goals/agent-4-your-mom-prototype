"use server";

import { nillionConfig } from "@/config/nillion";
import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
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
  creator: z.object({
    id: z.string().min(1),
  }),
  name: z.string().min(1),
  description: z.string().min(1),
  emoji: z.string().min(1),
  user: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
  }),
  addressBook: z.array(requestBodyAddressBookElementSchema),
  twitterAccount: z
    .object({
      apiKey: z.string().min(1),
      apiSecret: z.string().min(1),
      accessToken: z.string().min(1),
      accessTokenSecret: z.string().min(1),
    })
    .optional(),
  extra: z.object({
    usdtAddress: z.string().min(1),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
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
    // TODO: Show warning that recipient is probably a scammer if their address isn't in the address book
    const systemMessageContent = [
      "You are a helpful agent that helps with blockchain operations.",
      "You have an address book containing the names of people and organizations and their addresses to which you can send your funds.",
      "You cannot add new entries to the address book.",
      "Your extra knowledge:",
      `Address of the contract for 'dollars', 'USD tokens', 'USDT' is ${bodyParseResult.data.extra.usdtAddress}.`,
    ].join("\n\n");
    const aiMessageContent = [
      "Hello, my dear!",
      "How about to check your wallet balance?",
    ].join("\n\n");
    const agent: Agent = {
      creator: {
        id: bodyParseResult.data.creator.id,
      },
      createdDate: new Date(),
      name: bodyParseResult.data.name,
      description: bodyParseResult.data.description,
      emoji: bodyParseResult.data.emoji,
      user: {
        name: bodyParseResult.data.user.name,
        email: bodyParseResult.data.user.email,
      },
      messages: [
        new SystemMessage({
          content: systemMessageContent,
        }).toDict(),
        new AIMessage({ content: aiMessageContent }).toDict(),
      ],
      privyServerWallet: {
        id: privyId,
        address: privyAddress,
        chainType: privyChainType,
      },
      ...(bodyParseResult.data.twitterAccount && {
        twitterAccount: {
          apiKey: bodyParseResult.data.twitterAccount.apiKey,
          apiSecret: bodyParseResult.data.twitterAccount.apiSecret,
          accessToken: bodyParseResult.data.twitterAccount.accessToken,
          accessTokenSecret:
            bodyParseResult.data.twitterAccount.accessTokenSecret,
        },
      }),
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
              address: element.address.toLowerCase(), // TODO: Encode value using nilQL
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
