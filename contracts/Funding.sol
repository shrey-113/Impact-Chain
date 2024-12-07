// Funding.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Funding {
    struct FundRequest {
        address ngo;
        uint256 amount;
        bool approved;
    }

    mapping(uint256 => FundRequest) public fundRequests;
    uint256 public requestCount;

    function requestFunds(uint256 _amount) public {
        requestCount++;
        fundRequests[requestCount] = FundRequest({
            ngo: msg.sender,
            amount: _amount,
            approved: false
        });
    }

    function approveFunding(uint256 _requestId) public {
        fundRequests[_requestId].approved = true;
        payable(fundRequests[_requestId].ngo).transfer(
            fundRequests[_requestId].amount
        );
    }
}
