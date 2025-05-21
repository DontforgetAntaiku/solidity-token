// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public feeCollector;
    uint256 public feePercent;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _feePercent,
        address _feeCollector
    ) ERC20(name, symbol) {
        feeCollector = _feeCollector;
        feePercent   = _feePercent;
        _mint(msg.sender, initialSupply);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from == address(0) || to == address(0) || to == feeCollector) {
            super._update(from, to, amount);
            return;
        }

        uint256 fee = (amount * feePercent) / 10000;
        uint256 net = amount - fee;

        super._update(from, feeCollector, fee);
        super._update(from, to, net);
    }
}
