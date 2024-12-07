// Rewards.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFT {
    function mint(address to, uint256 tokenId) external;
}

contract Rewards {
    INFT public nftContract;

    constructor(address _nftAddress) {
        nftContract = INFT(_nftAddress);
    }

    function rewardContributor(address contributor, uint256 tokenId) public {
        nftContract.mint(contributor, tokenId);
    }
}
