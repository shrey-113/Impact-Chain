// Governance.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct Cause {
        string description;
        address proposer;
        uint256 votes;
        bool approved;
    }

    mapping(uint256 => Cause) public causes;
    uint256 public causeCount;

    function proposeCause(string memory _description) public {
        causeCount++;
        causes[causeCount] = Cause({
            description: _description,
            proposer: msg.sender,
            votes: 0,
            approved: false
        });
    }

    function voteCause(uint256 _causeId) public {
        require(!causes[_causeId].approved, "Cause already approved");
        causes[_causeId].votes++;
    }

    function approveCause(uint256 _causeId) public {
        require(causes[_causeId].votes > 0, "Not enough votes");
        causes[_causeId].approved = true;
    }
}
