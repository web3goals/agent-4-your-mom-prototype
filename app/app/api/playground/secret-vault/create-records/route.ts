"use server";

import { nillionConfig } from "@/config/nillion";
import { errorToString } from "@/lib/converters";
import { createFailedApiResponse, createSuccessApiResponse } from "@/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Define request data
    const requestData = {
      schema: nillionConfig.schemaAddressBookId,
      data: [
        {
          _id: uuidv4(),
          agent: "67a2341afc47875a1fc02611",
          name: "Alice",
          address: "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
        },
      ],
    };

    // Send request
    const results = await Promise.all(
      nillionConfig.nodes.map(async (node) => {
        const { data } = await axios.post(
          `${node.url}/api/v1/data/create`,
          { schema: requestData.schema, data: requestData.data },
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
