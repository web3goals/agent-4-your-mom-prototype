import { Agent } from "@/mongodb/models/agent";
import {
  ActionProvider,
  CreateAction,
  EvmWalletProvider,
} from "@coinbase/agentkit";
import { encodeFunctionData, Hex } from "viem";
import { z } from "zod";
import { abi } from "./constants";
import {
  GetBalanceSchema,
  TransferByNameSchema,
  TransferSchema,
} from "./schemas";

export class ERC20ActionProvider extends ActionProvider {
  agent: Agent;

  constructor(agent: Agent) {
    super("erc20", []);
    this.agent = agent;
  }

  /**
   * Gets the balance of an ERC20 token.
   *
   * @param walletProvider - The wallet provider to get the balance from.
   * @param args - The input arguments for the action.
   * @returns A message containing the balance.
   */
  @CreateAction({
    name: "get_balance",
    description: `
This tool will get the balance of an ERC20 asset in the wallet. It takes the contract address as input.
    `,
    schema: GetBalanceSchema,
  })
  async getBalance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetBalanceSchema>
  ): Promise<string> {
    try {
      const balance = await walletProvider.readContract({
        address: args.contractAddress as Hex,
        abi,
        functionName: "balanceOf",
        args: [walletProvider.getAddress()],
      });

      return `Balance of ${args.contractAddress} is ${balance}`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  }

  /**
   * Transfers a specified amount of an ERC20 token to a destination onchain.
   *
   * @param walletProvider - The wallet provider to transfer the asset from.
   * @param args - The input arguments for the action.
   * @returns A message containing the transfer details.
   */
  @CreateAction({
    name: "transfer",
    description: `
  This tool will transfer an ERC20 token from the wallet to another onchain address.
  
  It takes the following inputs:
  - amount: The amount to transfer
  - contractAddress: The contract address of the token to transfer
  - destination: Where to send the funds (can be an onchain address, ENS 'example.eth', or Basename 'example.base.eth')
  
  Important notes:
  - Ensure sufficient balance of the input asset before transferring
  - When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
      `,
    schema: TransferSchema,
  })
  async transfer(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof TransferSchema>
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: args.contractAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "transfer",
          args: [args.destination as Hex, BigInt(args.amount)],
        }),
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Transferred ${args.amount} of ${args.contractAddress} to ${args.destination}.\nTransaction hash for the transfer: ${hash}`;
    } catch (error) {
      return `Error transferring the asset: ${error}`;
    }
  }

  /**
   * Transfers a specified amount of an ERC20 token to a person or organization by their name.
   *
   * @param walletProvider - The wallet provider to transfer the asset from.
   * @param args - The input arguments for the action.
   * @returns A message containing the transfer details.
   */
  @CreateAction({
    name: "transfer_by_name",
    description: `
This tool will transfer an ERC20 token from the wallet to another person or organization onchain.

It takes the following inputs:
- amount: The amount to transfer
- contractAddress: The contract address of the token to transfer
- destinationName: Whom to send the funds (can be a name of person or organization)

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
    `,
    schema: TransferByNameSchema,
  })
  async transferByName(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof TransferByNameSchema>
  ): Promise<string> {
    try {
      // Define destination by name using Nillion SecretVault
      // TODO:
      const destination = "";
      if (!destination) {
        return "Failed to find an address for the specified name";
      }

      // Send transaction
      const hash = await walletProvider.sendTransaction({
        to: args.contractAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "transfer",
          args: [args.destinationName as Hex, BigInt(args.amount)],
        }),
      });
      await walletProvider.waitForTransactionReceipt(hash);

      return `Transferred ${args.amount} of ${args.contractAddress} to ${args.destinationName}.\nTransaction hash for the transfer: ${hash}`;
    } catch (error) {
      return `Error transferring the asset: ${error}`;
    }
  }

  /**
   * Checks if the ERC20 action provider supports the given network.
   *
   * @returns True if the ERC20 action provider supports the network, false otherwise.
   */
  supportsNetwork = () => {
    return true;
  };
}

export const erc20ActionProvider = (agent: Agent) =>
  new ERC20ActionProvider(agent);
