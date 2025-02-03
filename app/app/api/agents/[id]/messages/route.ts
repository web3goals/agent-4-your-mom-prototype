"use server";

import { errorToString } from "@/lib/converters";
import { findAgent, updateAgent } from "@/mongodb/services/agent-service";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import {
  AgentKit,
  ViemWalletProvider,
  walletActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import {
  HumanMessage,
  mapStoredMessagesToChatMessages,
} from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { PrivyClient } from "@privy-io/server-auth";
import { createViemAccount } from "@privy-io/server-auth/viem";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { z } from "zod";

const requestBodySchema = z.object({
  message: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get and parse request data
    const { id } = await params;
    const authorization = (await headers()).get("Authorization");
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!authorization || !bodyParseResult.success) {
      return createFailedApiResponse({ message: "Request invalid" }, 400);
    }

    // Load agent data using MongoDB
    const agent = await findAgent(new ObjectId(id));
    if (!agent) {
      return createFailedApiResponse({ message: "Not found" }, 404);
    }

    // Get a agent viem account from a Privy server wallet
    const privy = new PrivyClient(
      process.env.PRIVY_APP_ID as string,
      process.env.PRIVY_APP_SECRET as string
    );
    const account = await createViemAccount({
      walletId: agent.privyServerWallet.id,
      address: agent.privyServerWallet.address as `0x${string}`,
      privy,
    });

    // Check that the user has access to the agent
    // TODO:

    // Load agent sensitive data from Nillion SecretVault
    // TODO:

    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Initialize AgentKit with tools
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    });
    const walletProvider = new ViemWalletProvider(client);
    const agentKit = await AgentKit.from({
      walletProvider: walletProvider,
      actionProviders: [walletActionProvider()],
      cdpApiKeyName: process.env.CDP_API_KEY_NAME,
      cdpApiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    });
    const agentKitTools = await getLangChainTools(agentKit);

    // Create an agent
    const reactAgent = createReactAgent({
      llm: llm,
      tools: agentKitTools,
    });

    // Use the agent
    const result = await reactAgent.invoke(
      {
        messages: [
          ...mapStoredMessagesToChatMessages(agent.messages),
          new HumanMessage({ content: bodyParseResult.data?.message }),
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
