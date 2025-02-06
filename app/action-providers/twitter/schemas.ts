import { z } from "zod";

/**
 * Input schema for retrieving account details.
 */
export const TwitterAccountDetailsSchema = z
  .object({})
  .strip()
  .describe("Input schema for retrieving account details");

/**
 * Input schema for posting a tweet.
 */
export const TwitterPostTweetSchema = z
  .object({
    tweet: z.string().max(280, "Tweet must be a maximum of 280 characters."),
  })
  .strip()
  .describe("Input schema for posting a tweet");
