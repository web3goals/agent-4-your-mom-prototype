import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("CryptoBro", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo] = await hre.viem.getWalletClients();

    // Deploy contracts
    const erc20Factory = await hre.viem.deployContract("ERC20Factory", []);

    return { deployer, userOne, userTwo, erc20Factory };
  }

  it("Should create a ERC20", async function () {
    const { userOne, erc20Factory } = await loadFixture(initFixture);

    // Create ERC20
    await expect(
      erc20Factory.write.createERC20(["Test Token", "TT", parseEther("1000")], {
        account: userOne.account.address,
      })
    ).to.be.not.rejected;

    // Check created ERC20
    const createdERC20s = await erc20Factory.read.getCreatedERC20s([
      userOne.account.address,
    ]);
    expect(createdERC20s).to.has.length(1);

    // Check user's ERC20 balance
    const erc20 = await hre.viem.getContractAt("CustomERC20", createdERC20s[0]);
    const balance = await erc20.read.balanceOf([userOne.account.address]);
    expect(balance).to.be.equal(parseEther("1000"));
  });
});
