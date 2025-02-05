import hre from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (!CONTRACTS[network].usdToken) {
    const usdToken = await hre.viem.deployContract("USDToken", []);
    console.log(`Contract 'USDToken' deployed to: ${usdToken.address}`);
  }

  if (!CONTRACTS[network].erc20Factory) {
    const usdToken = await hre.viem.deployContract("ERC20Factory", []);
    console.log(`Contract 'ERC20Factory' deployed to: ${usdToken.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
