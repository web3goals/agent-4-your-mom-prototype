import {
  ActionProvider,
  CreateAction,
  EvmWalletProvider,
  ViemWalletProvider,
} from "@coinbase/agentkit";
import { nilql } from "@nillion/nilql";
import axios from "axios";
import {
  Address,
  Chain,
  encodeFunctionData,
  Hex,
  parseEther,
  parseEventLogs,
} from "viem";
import { z } from "zod";
import { erc20Abi } from "./abi/erc20";
import { erc20FactoryAbi } from "./abi/erc20Factory";
import {
  CreateErc20Schema,
  GetAddressBookAddressSchema,
  GetErc20BalanceSchema,
  TransferErc20Schema,
} from "./schemas";

/**
 * An action provider with tools for the agent address book and ERC20 tokens.
 */
export class AgentActionProvider extends ActionProvider {
  chainsConfig: {
    chain: Chain;
    contracts: {
      erc20Factory: Address;
    };
  }[];
  nillionAgentId: string;
  nillionNodes: {
    name: string;
    url: string;
    did: string;
    jwt: string;
  }[];
  nillionSchemaAddressBookId: string;

  constructor(args: {
    chainsConfig: {
      chain: Chain;
      contracts: {
        erc20Factory: Address;
      };
    }[];
    nillionAgentId: string;
    nillionNodes: {
      name: string;
      url: string;
      did: string;
      jwt: string;
    }[];
    nillionSchemaAddressBookId: string;
  }) {
    super("agent", []);
    this.chainsConfig = args.chainsConfig;
    this.nillionAgentId = args.nillionAgentId;
    this.nillionNodes = args.nillionNodes;
    this.nillionSchemaAddressBookId = args.nillionSchemaAddressBookId;
  }

  /**
   * Gets the address of a person or organization from the address book.
   *
   * @param walletProvider - The wallet provider.
   * @param args - The input arguments for the action.
   * @returns A message containing the address.
   */
  @CreateAction({
    name: "get_address_book_address",
    description: `
This tool will get the address of a person or organization from the address book.
It takes the name of a person or organization.
        `,
    schema: GetAddressBookAddressSchema,
  })
  async getAddress(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetAddressBookAddressSchema>
  ): Promise<string> {
    try {
      // Send request to Nillion SecretVault
      const results = await Promise.all(
        this.nillionNodes.map(async (node) => {
          const { data } = await axios.post(
            `${node.url}/api/v1/data/read`,
            {
              schema: this.nillionSchemaAddressBookId,
              filter: {
                agent: this.nillionAgentId,
                name: args.name.toLowerCase(),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${node.jwt}`,
                "Content-Type": "application/json",
              },
            }
          );
          return { nodeName: node.name, data };
        })
      );

      // Get address from the first node result
      const address = results[0].data?.data?.[0]?.address;
      if (!address) {
        return `There's no address for ${args.name} in the address book`;
      }

      // Decrypt address
      const cluster = {
        nodes: Array(this.nillionNodes.length).fill({}),
      };
      const secretKey = await nilql.ClusterKey.generate(cluster, {
        store: true,
      });
      const decryptedAddress = await nilql.decrypt(
        secretKey,
        (address as string).split(",")
      );

      return `Address of ${args.name} is ${decryptedAddress}`;
    } catch (error) {
      return `Error getting address: ${error}`;
    }
  }

  /**
   * Gets the balance of an ERC20 token.
   *
   * @param walletProvider - The wallet provider to get the balance from.
   * @param args - The input arguments for the action.
   * @returns A message containing the balance.
   */
  @CreateAction({
    name: "get_erc_20_balance",
    description: `
This tool will get the balance of an ERC20 asset in the wallet. It takes the contract address as input.
    `,
    schema: GetErc20BalanceSchema,
  })
  async getErc20Balance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetErc20BalanceSchema>
  ): Promise<string> {
    try {
      const balance = await walletProvider.readContract({
        address: args.contractAddress as Hex,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [walletProvider.getAddress()],
      });

      return `Balance of ${args.contractAddress} is ${balance}`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  }

  /**
   * Transfers a specified amount of an ERC20 token to a recipient person or organization from the address book by their name, not their address.
   *
   * @param walletProvider - The wallet provider to transfer the asset from.
   * @param args - The input arguments for the action.
   * @returns A message containing the transfer details.
   */
  @CreateAction({
    name: "transfer_erc20",
    description: `
This tool will transfer an ERC20 token from the wallet to a recipient person or organization from the address book by their name, not their address.

It takes the following inputs:
- amount: The amount to transfer
- contractAddress: The contract address of the token to transfer
- recipientName: The name of a person or organization fromt the address book where to send the funds (e.g., 'Alice', 'Kindness Network')

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
        `,
    schema: TransferErc20Schema,
  })
  async transferErc20(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof TransferErc20Schema>
  ): Promise<string> {
    try {
      // Send request to Nillion SecretVault
      const results = await Promise.all(
        this.nillionNodes.map(async (node) => {
          const { data } = await axios.post(
            `${node.url}/api/v1/data/read`,
            {
              schema: this.nillionSchemaAddressBookId,
              filter: {
                agent: this.nillionAgentId,
                name: args.recipientName.toLowerCase(),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${node.jwt}`,
                "Content-Type": "application/json",
              },
            }
          );
          return { nodeName: node.name, data };
        })
      );

      // Get address from the first node result
      const address = results[0].data?.data?.[0]?.address;
      if (!address) {
        return `There's no address for ${args.recipientName} in the address book`;
      }

      // Decrypt address
      const cluster = {
        nodes: Array(this.nillionNodes.length).fill({}),
      };
      const secretKey = await nilql.ClusterKey.generate(cluster, {
        store: true,
      });
      const decryptedAddress = await nilql.decrypt(
        secretKey,
        (address as string).split(",")
      );

      // Send a transaction to transfer tokens
      const hash = await walletProvider.sendTransaction({
        to: args.contractAddress as Hex,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [decryptedAddress as Hex, parseEther(args.amount.toString())],
        }),
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Transferred ${args.amount} of ${args.contractAddress} to ${args.recipientName}`;
    } catch (error) {
      return `Error transferring the asset: ${error}`;
    }
  }
  /**
   * Create an ERC20 token.
   *
   * @param walletProvider - The wallet provider.
   * @param args - The input arguments for the action.
   * @returns A message containing the action details.
   */
  @CreateAction({
    name: "create_erc20",
    description: `
This tool will create an ERC20 token.

It takes the following inputs:
- name: The name for the ERC20 token to create (e.g., 'Simon Cat Token')
- symbol: The symbol for the ERC20 token to create (e.g., 'SCT')
- amount: The amount of the ERC20 tokens to create
        `,
    schema: CreateErc20Schema,
  })
  async createErc20(
    walletProvider: ViemWalletProvider,
    args: z.infer<typeof CreateErc20Schema>
  ): Promise<string> {
    try {
      // Get ERC20 Factory contract address
      const chainConfig = this.chainsConfig.find(
        (chain) =>
          chain.chain.id.toString() ===
          walletProvider.getNetwork().chainId?.toString()
      );
      const erc20Factory = chainConfig?.contracts.erc20Factory;
      if (!erc20Factory) {
        return `Chain ${
          walletProvider.getNetwork().chainId
        } is not supported for creating ERC20 tokens`;
      }

      // Send a transaction to create an ERC20 token
      const hash = await walletProvider.sendTransaction({
        to: erc20Factory as Hex,
        data: encodeFunctionData({
          abi: erc20FactoryAbi,
          functionName: "createERC20",
          args: [args.name, args.symbol, parseEther(args.amount.toString())],
        }),
      });
      const receipt = await walletProvider.waitForTransactionReceipt(hash);

      // Parse logs to get a created contract address
      const logs = parseEventLogs({
        abi: erc20FactoryAbi,
        eventName: "ERC20Created",
        logs: receipt.logs,
      });
      const address = logs[0].args.erc20;

      return `ERC20 Token '${args.name}' is created, the contract address is ${address}`;
    } catch (error) {
      return `Error creating the asset: ${error}`;
    }
  }

  /**
   * Checks if the action provider supports the given network.
   *
   * @returns True if the action provider supports the network, false otherwise.
   */
  supportsNetwork = () => {
    return true;
  };
}

export const agentActionProvider = (args: {
  chainsConfig: {
    chain: Chain;
    contracts: {
      erc20Factory: Address;
    };
  }[];
  nillionAgentId: string;
  nillionNodes: {
    name: string;
    url: string;
    did: string;
    jwt: string;
  }[];
  nillionSchemaAddressBookId: string;
}) => new AgentActionProvider(args);
