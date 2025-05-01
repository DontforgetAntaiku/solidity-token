// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public feeCollector;
    uint256 public feePercent;

    constructor(
        string memory name,
        string memory symbol,
        uint256 mintAmount,
        uint256 _feePercent
    ) ERC20(name, symbol) {
        feeCollector = msg.sender;
        feePercent = _feePercent;
        _mint(msg.sender, mintAmount * 10 ** decimals());
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 fee = (amount * feePercent) / 10000;
        uint256 amountAfterFee = amount - fee;

        super._transfer(sender, feeCollector, fee);
        super._transfer(sender, recipient, amountAfterFee);
    }
}
