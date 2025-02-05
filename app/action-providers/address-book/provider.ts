import { Agent } from "@/mongodb/models/agent";
import { ActionProvider } from "@coinbase/agentkit";

// TODO: Implement
export class AddressBookActionProvider extends ActionProvider {
  agent: Agent;

  constructor(agent: Agent) {
    super("address_book", []);
    this.agent = agent;
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
