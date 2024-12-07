// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Funding is Ownable(msg.sender), ReentrancyGuard, Pausable {
    struct FundRequest {
        address ngo;
        uint256 amount;
        bool approved;
        bool claimed;
        string description;
        string ipfsData;
        uint256 timestamp;
        uint256 approvalDate;
        uint256 claimDate;
    }

    // State variables
    mapping(uint256 => FundRequest) public fundRequests;
    mapping(address => uint256[]) public ngoRequests;
    uint256 public requestCount;
    uint256 public minRequestAmount;
    uint256 public maxRequestAmount;

    // Events
    event FundRequested(
        uint256 indexed requestId,
        address indexed ngo,
        uint256 amount,
        string description
    );
    event FundingApproved(
        uint256 indexed requestId,
        uint256 amount,
        uint256 approvalDate
    );
    event FundsClaimed(
        uint256 indexed requestId,
        address indexed ngo,
        uint256 amount,
        uint256 claimDate
    );
    event FundingLimitsUpdated(uint256 newMinAmount, uint256 newMaxAmount);

    constructor(uint256 _minRequestAmount, uint256 _maxRequestAmount) {
        minRequestAmount = _minRequestAmount;
        maxRequestAmount = _maxRequestAmount;
    }

    // Main functions
    function requestFunds(
        uint256 _amount,
        string memory _description,
        string memory _ipfsData
    ) public whenNotPaused nonReentrant returns (uint256) {
        require(_amount >= minRequestAmount, "Amount below minimum");
        require(_amount <= maxRequestAmount, "Amount above maximum");

        requestCount++;
        FundRequest storage newRequest = fundRequests[requestCount];
        newRequest.ngo = msg.sender;
        newRequest.amount = _amount;
        newRequest.description = _description;
        newRequest.ipfsData = _ipfsData;
        newRequest.timestamp = block.timestamp;

        ngoRequests[msg.sender].push(requestCount);

        emit FundRequested(requestCount, msg.sender, _amount, _description);
        return requestCount;
    }

    function approveFunding(
        uint256 _requestId
    ) public onlyOwner nonReentrant whenNotPaused {
        FundRequest storage request = fundRequests[_requestId];
        require(!request.approved, "Already approved");
        require(request.ngo != address(0), "Invalid request");

        request.approved = true;
        request.approvalDate = block.timestamp;

        emit FundingApproved(_requestId, request.amount, block.timestamp);
    }

    function claimFunds(uint256 _requestId) public nonReentrant whenNotPaused {
        FundRequest storage request = fundRequests[_requestId];
        require(msg.sender == request.ngo, "Not request owner");
        require(request.approved, "Not approved");
        require(!request.claimed, "Already claimed");
        require(
            address(this).balance >= request.amount,
            "Insufficient contract balance"
        );

        request.claimed = true;
        request.claimDate = block.timestamp;

        (bool success, ) = payable(request.ngo).call{value: request.amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(
            _requestId,
            request.ngo,
            request.amount,
            block.timestamp
        );
    }

    // View functions
    function getFundRequest(
        uint256 _requestId
    )
        public
        view
        returns (
            address ngo,
            uint256 amount,
            bool approved,
            bool claimed,
            string memory description,
            string memory ipfsData,
            uint256 timestamp,
            uint256 approvalDate,
            uint256 claimDate
        )
    {
        FundRequest storage request = fundRequests[_requestId];
        return (
            request.ngo,
            request.amount,
            request.approved,
            request.claimed,
            request.description,
            request.ipfsData,
            request.timestamp,
            request.approvalDate,
            request.claimDate
        );
    }

    function getNGORequests(
        address _ngo
    ) public view returns (uint256[] memory) {
        return ngoRequests[_ngo];
    }

    // Admin functions
    function updateFundingLimits(
        uint256 _newMinAmount,
        uint256 _newMaxAmount
    ) public onlyOwner {
        require(_newMinAmount < _newMaxAmount, "Invalid limits");
        minRequestAmount = _newMinAmount;
        maxRequestAmount = _newMaxAmount;
        emit FundingLimitsUpdated(_newMinAmount, _newMaxAmount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Receive function
    receive() external payable {}
}
