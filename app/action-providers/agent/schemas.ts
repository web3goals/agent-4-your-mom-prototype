import { z } from "zod";

/**
 * Input schema for get address from the address book action.
 */
export const GetAddressBookAddressSchema = z
  .object({
    name: z
      .string()
      .describe(
        "The name of a person or organization in the address book, e.g., 'Alice' or 'Kindness Network'"
      ),
  })
  .strip()
  .describe(
    "Instructions for getting an address of a person or organization from the address book"
  );

/**
 * Input schema for get ERC20 balance action.
 */
export const GetErc20BalanceSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address of the token to get the balance for"),
  })
  .strip()
  .describe("Instructions for getting wallet balance");

/**
 * Input schema for transfer ERC20 action.
 */
export const TransferErc20Schema = z
  .object({
    amount: z
      .custom<bigint>() // TODO: Use number
      .describe("The amount of the ERC20 asset to transfer"),
    contractAddress: z
      .string()
      .describe("The contract address of the ERC20 token to transfer"),
    recipientName: z
      .string()
      .describe(
        "The name of a person or organization to transfer the funds from the address book"
      ),
  })
  .strip()
  .describe("Instructions for transferring ERC20 assets");

/**
 * Input schema for create ERC20 action.
 */
export const CreateErc20Schema = z
  .object({
    name: z.string().describe("The name for the ERC20 token to create"),
    symbol: z.string().describe("The symbol for the ERC20 token to create"),
    amount: z.number().describe("The amount of the ERC20 tokens to create"),
  })
  .strip()
  .describe("Instructions for transferring ERC20 assets");
