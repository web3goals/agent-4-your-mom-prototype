import { Agent } from "@/mongodb/models/agent";
import {
  ActionProvider,
  CreateAction,
  EvmWalletProvider,
} from "@coinbase/agentkit";
import { z } from "zod";
import { GetAddressSchema } from "./schemas";
import { nillionConfig } from "@/config/nillion";
import axios from "axios";

export class AddressBookActionProvider extends ActionProvider {
  agent: Agent;

  constructor(agent: Agent) {
    super("address_book", []);
    this.agent = agent;
  }

  /**
   * Gets the address of a person or organization for the address book.
   *
   * @param walletProvider - The wallet provider.
   * @param args - The input arguments for the action.
   * @returns A message containing the address.
   */
  @CreateAction({
    name: "get_address",
    description: `
  This tool will get the address of a person or organization. It takes the name of a person or organization.
      `,
    schema: GetAddressSchema,
  })
  async getAddress(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetAddressSchema>
  ): Promise<string> {
    try {
      // Send request to Nillion SecretVault
      const results = await Promise.all(
        nillionConfig.nodes.map(async (node) => {
          const { data } = await axios.post(
            `${node.url}/api/v1/data/read`,
            {
              schema: nillionConfig.schemaAddressBookId,
              filter: {
                agent: this.agent._id?.toString(),
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
      if (address) {
        return `Address of ${args.name} is ${address}`;
      }

      return `Not found an address for ${args.name}`;
    } catch (error) {
      return `Error getting address: ${error}`;
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

export const addressBookActionProvider = (agent: Agent) =>
  new AddressBookActionProvider(agent);
