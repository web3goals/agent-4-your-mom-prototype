import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import { NextRequest } from "next/server";
import { createJWT, ES256KSigner } from "did-jwt";
import { nillionConfig } from "@/config/nillion";

export async function POST(request: NextRequest) {
  try {
    const ttl = 30 * 24 * 60 * 60; // 30 days

    // Create signer from private key
    const signer = ES256KSigner(Buffer.from(nillionConfig.orgSecretKey, "hex"));
    const tokens = [];

    // Generate JWT for each node
    for (const node of nillionConfig.nodes) {
      const payload = {
        iss: nillionConfig.orgDid,
        aud: node.did,
        exp: Math.floor(Date.now() / 1000) + ttl,
      };

      const token = await createJWT(payload, {
        issuer: nillionConfig.orgDid,
        signer,
      });
      tokens.push(token);
    }

    return createSuccessApiResponse(tokens);
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
