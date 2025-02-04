"use server";

import { nillionConfig } from "@/config/nillion";
import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Define request data
    const requestData = {
      _id: nillionConfig.schemaAddressBookId,
      name: "Address Book",
      keys: ["_id"],
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              format: "uuid",
              coerce: true,
            },
            agent: {
              type: "string",
            },
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
          },
          required: ["_id", "agent", "name", "address"],
          additionalProperties: false,
        },
      },
    };

    // Detailed environment variable validation
    for (const node of nillionConfig.nodes) {
      if (!node.url) {
        return createFailedApiResponse(
          { message: `Missing or invalid URL configuration for ${node.name}` },
          500
        );
      }
      if (!node.jwt) {
        return createFailedApiResponse(
          { message: `Missing JWT configuration for ${node.name}` },
          500
        );
      }
    }

    const results = await Promise.all(
      nillionConfig.nodes.map(async (node) => {
        const { data } = await axios.post(
          `${node.url}/api/v1/schemas`,
          requestData,
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

    return createSuccessApiResponse(results);
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
