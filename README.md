![Cover](/Cover.png)

# 👩‍🦰 Agent 4 Your Mom

A platform for creating personalized AI agents with crypto features for your mom or other not-techie users.

## ✨ Features

- Access control for agents.
- Personalization for the specified user.
- Address book with a whitelist of people and organizations to send funds to.
- Protection against scammers.
- Launch and send ERC20 with a single request.
- Twitter integration.
- Funding an agent's wallet in a few clicks.
- Sign in using Google account or email address.

## 🛠️ Technologies

- **Base** is used by agents to transfer funds, launch tokens, and make other onchain transactions.
- **Coinbase AgentKit** is used as a framework to run flexible agents with extensible features.
- **Coinbase OnchainKit & Onramp** are used to provide users with a seamless experience of funding their wallets and in the future paying for digital products.
- **Privy Server Wallet** is used as a wallet that gives agents the ability to make any necessary transactions onchain.
- **Nillion SecretVault** is used as a vault for storing address books and other personal data in secret.

## 🔗 Artifacts

- Application - [agent-4-your-mom.vercel.app](https://agent-4-your-mom.vercel.app/)
- Custom Action Provider - [/app/action-providers/agent/README.md]https://github.com/web3goals/agent-4-your-mom-prototype/blob/main/app/action-providers/agent/README.md
- Contracts (Base Sepolia):
  - USD Token - `0x1b21550f42e993d1b692d18d79bcd783638633f2`
  - ERC20 Factory - `0x4f316c6536ce3ee94de802a9efdb20484ec4bdf9`
- Nillion:
  - Organization DID - `did:nil:testnet:nillion1ftk7yp3dsu839lcgtv3mvq4zfuup7hh2njl9j4`
  - Address Book Schema ID - `a774c19a-afb4-46ef-adfb-05fc05604026`

## 🏗️ Architecture

![Architecture](/Architecture.png)
