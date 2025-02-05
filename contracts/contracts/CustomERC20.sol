// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 premintValue,
        address premintRecipient
    ) ERC20(name, symbol) {
        _mint(premintRecipient, premintValue);
    }

    function mint(uint256 value, address recipient) external {
        _mint(recipient, value);
    }
}
