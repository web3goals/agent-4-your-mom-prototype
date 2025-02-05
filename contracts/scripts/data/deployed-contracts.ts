import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    usdToken: Address | undefined;
    erc20Factory: Address | undefined;
  };
} = {
  baseSepolia: {
    usdToken: "0x1b21550f42e993d1b692d18d79bcd783638633f2",
    erc20Factory: "0x9b18515b74ef6115a673c6d01c454d8f72f84177",
  },
};
