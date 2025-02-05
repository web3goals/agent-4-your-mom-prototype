// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./CustomERC20.sol";

contract ERC20Factory {
    mapping(address creator => CustomERC20[] erc20s) public createdErc20s;

    constructor() {}

    function createERC20(
        string memory name,
        string memory symbol,
        uint256 premintValue
    ) external {
        CustomERC20 erc20 = new CustomERC20(
            name,
            symbol,
            premintValue,
            msg.sender
        );
        createdErc20s[msg.sender].push(erc20);
    }

    function getCreatedERC20s(
        address creator
    ) external view returns (CustomERC20[] memory) {
        return createdErc20s[creator];
    }
}
