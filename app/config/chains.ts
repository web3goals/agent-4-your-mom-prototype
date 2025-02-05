import { Address } from "viem";
import { baseSepolia } from "viem/chains";

export const chainsConfig = [
  {
    chain: baseSepolia,
    contracts: {
      erc20Factory: "0x4f316c6536ce3ee94de802a9efdb20484ec4bdf9" as Address,
    },
  },
];
