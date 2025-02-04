"use server";

import { nillionConfig } from "@/config/nillion";
import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const credentialsData = {
  schema: nillionConfig.schemaCredentialsId,
  data: [
    {
      _id: uuidv4(),
      service: "Netflix",
      username: "JohnDoe13",
      password: "oTsOsg+XMaA=", // Encrypted value // TODO: Encode using nilQL
      registered_at: "2022-01-01T00:00:00Z",
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const results = await Promise.all(
      nillionConfig.nodes.map(async (node) => {
        const { data } = await axios.post(
          `${node.url}/api/v1/data/create`,
          { schema: credentialsData.schema, data: credentialsData.data },
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
