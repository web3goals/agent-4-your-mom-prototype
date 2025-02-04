import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    usdToken: Address | undefined;
  };
} = {
  baseSepolia: {
    usdToken: "0x1b21550f42e993d1b692d18d79bcd783638633f2",
  },
};
