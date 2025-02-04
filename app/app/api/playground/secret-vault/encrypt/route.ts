"use server";

import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { NextRequest } from "next/server";
import { nilql } from "@nillion/nilql";
import { nillionConfig } from "@/config/nillion";

export async function POST(request: NextRequest) {
  try {
    // Initialize secret key with cluster config and operations
    const cluster = {
      nodes: Array(nillionConfig.nodes.length).fill({}),
    };
    const secretKey = await nilql.ClusterKey.generate(cluster, {
      store: true,
    });

    // Encrypt and decrypt text
    const originalText = "Hello, Nillion!";
    const encryptedText = await nilql.encrypt(secretKey, originalText);
    const decryptedText = await nilql.decrypt(secretKey, encryptedText);

    return createSuccessApiResponse({
      originalText,
      encryptedText,
      decryptedText,
    });
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
