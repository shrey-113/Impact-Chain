// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTRewards is ERC721, Ownable {
    uint public tokenCount = 0;

    constructor() ERC721("ContributorReward", "CRT") {}

    function mintNFT(address recipient) public onlyOwner {
        _safeMint(recipient, tokenCount);
        tokenCount++;
    }
}
