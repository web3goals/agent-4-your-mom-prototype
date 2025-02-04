import { z } from "zod";

/**
 * Input schema for get balance action.
 */
export const GetBalanceSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address of the token to get the balance for"),
  })
  .strip()
  .describe("Instructions for getting wallet balance");

/**
 * Input schema for transfer action.
 */
export const TransferSchema = z
  .object({
    amount: z.custom<bigint>().describe("The amount of the asset to transfer"),
    contractAddress: z
      .string()
      .describe("The contract address of the token to transfer"),
    destination: z.string().describe("The destination to transfer the funds"),
  })
  .strip()
  .describe("Instructions for transferring assets");

/**
 * Input schema for transfer by name action.
 */
export const TransferByNameSchema = z
  .object({
    amount: z.custom<bigint>().describe("The amount of the asset to transfer"),
    contractAddress: z
      .string()
      .describe("The contract address of the token to transfer"),
    destinationName: z
      .string()
      .describe("The name of person or organization to transfer the funds"),
  })
  .strip()
  .describe("Instructions for transferring assets");
