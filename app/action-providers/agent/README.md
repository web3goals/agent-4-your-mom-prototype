# 🤖 Agent Action Provider

An action provider for [Coinbase AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome) that allows to transfer ERC20 tokens only to accounts in the address book stored in encrypted form in Nillion Secret Vault.

## ✨ Features

- Get an address of a person or organization from the address book by name.
- Get ERC20 balance by contract address.
- Transfer ERC20 tokens to a person or organization from the address book by their name.
- Create an ERC20 token.

## 👣 Quickstast

1. Register an organization and define a collection in Nillion Secret Vault using [the instructions](https://docs.nillion.com/build/secretVault-secretDataAnalytics/build).

2. Fill in the address book using [this example](https://github.com/web3goals/agent-4-your-mom-prototype/blob/main/app/app/api/agents/new/route.ts#L128).

3. Install and Coinbase AgentKit by [this instruction](https://docs.cdp.coinbase.com/agentkit/docs/quickstart).

4. Copy this action provider into your project.

5. Define this action provider in AgentKit.

```ts
const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [
    agentActionProvider({
      chainsConfig: [
        {
          chain: baseSepolia,
          contracts: {
            erc20Factory: "0x0000000000000000000000000000000000000000",
          },
        },
      ],
      nillionAgentId: "",
      nillionNodes: [
        [
          {
            name: "",
            url: "",
            did: "",
            jwt: "",
          },
        ],
      ],
      nillionSchemaAddressBookId: "",
    }),
  ],
});
```
