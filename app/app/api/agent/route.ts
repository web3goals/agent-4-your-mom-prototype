import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { BaseMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();
    const bodyMessages: BaseMessage[] = body.messages;
    if (!bodyMessages) {
      return createFailedApiResponse({ message: "Request body invalid" }, 400);
    }

    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Initialize CDP AgentKit
    const agentkit = await CdpAgentkit.configureWithWallet({
      networkId: "base-sepolia",
    });

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    // Initialize memory to persist state between graph runs
    const checkpointer = new MemorySaver();

    // Create an agent
    const agent = createReactAgent({
      llm: llm,
      tools,
      checkpointSaver: checkpointer,
    });

    // Use the agent
    const result = await agent.invoke(
      { messages: bodyMessages },
      { configurable: { thread_id: 42 } }
    );

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
