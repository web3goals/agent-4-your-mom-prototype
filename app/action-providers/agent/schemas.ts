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
 * Input schema for get address action.
 */
export const GetAddressSchema = z
  .object({
    name: z
      .string()
      .describe(
        "The name of a person or organization in the address book, e.g., 'Alice' or 'Kindness Network'"
      ),
  })
  .strip()
  .describe("Instructions for getting an address of a person or organization");

/**
 * Input schema for transfer action.
 */
export const TransferSchema = z
  .object({
    amount: z.custom<bigint>().describe("The amount of the asset to transfer"),
    contractAddress: z
      .string()
      .describe("The contract address of the token to transfer"),
    recipientName: z
      .string()
      .describe(
        "The name of a person or organization to transfer the funds from the address book"
      ),
  })
  .strip()
  .describe("Instructions for transferring assets");
