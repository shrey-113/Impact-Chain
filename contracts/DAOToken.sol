// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DAOToken is ERC20, Ownable(msg.sender) {
    // Token details
    uint256 public constant INITIAL_SUPPLY = 1000000; // 1 million tokens
    uint256 public constant DECIMALS = 18;

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("DAO Governance Token", "DAO") {
        _mint(msg.sender, INITIAL_SUPPLY * 10 ** DECIMALS);
    }

    // Mint new tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Get token balance of an address
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    // Transfer tokens with additional checks
    function safeTransfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, to, amount);
        return true;
    }

    // Override decimals to match our DECIMALS constant
    function decimals() public pure override returns (uint8) {
        return uint8(DECIMALS);
    }
}
