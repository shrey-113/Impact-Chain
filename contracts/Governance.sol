// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DAOToken.sol";

contract Governance is Ownable(msg.sender), ReentrancyGuard {
    // State variables
    DAOToken public daoToken;
    uint256 public minimumTokensToPropose;
    uint256 public votingPeriod;

    struct Cause {
        string description;
        address proposer;
        uint256 votes;
        bool approved;
        uint256 timestamp;
        uint256 votingEndTime;
        mapping(address => uint256) userVotes;
        bool executed;
        string ipfsData; // For additional data storage
    }

    mapping(uint256 => Cause) public causes;
    uint256 public causeCount;

    // Events
    event CauseProposed(
        uint256 indexed causeId,
        string description,
        address proposer,
        uint256 votingEndTime
    );
    event VoteCast(
        uint256 indexed causeId,
        address indexed voter,
        uint256 votes
    );
    event CauseApproved(uint256 indexed causeId);
    event CauseExecuted(uint256 indexed causeId);
    event MinimumTokensUpdated(uint256 newMinimum);
    event VotingPeriodUpdated(uint256 newPeriod);

    // Constructor
    constructor(
        address _daoToken,
        uint256 _minimumTokensToPropose,
        uint256 _votingPeriod
    ) {
        require(_daoToken != address(0), "Invalid token address");
        daoToken = DAOToken(_daoToken);
        minimumTokensToPropose = _minimumTokensToPropose;
        votingPeriod = _votingPeriod;
    }

    // Modifiers
    modifier causeExists(uint256 _causeId) {
        require(_causeId > 0 && _causeId <= causeCount, "Invalid cause ID");
        _;
    }

    modifier votingOpen(uint256 _causeId) {
        require(
            block.timestamp <= causes[_causeId].votingEndTime,
            "Voting period ended"
        );
        _;
    }

    // Main functions
    function proposeCause(
        string memory _description,
        string memory _ipfsData
    ) public nonReentrant returns (uint256) {
        require(
            daoToken.balanceOf(msg.sender) >= minimumTokensToPropose,
            "Insufficient tokens to propose"
        );

        causeCount++;
        Cause storage newCause = causes[causeCount];
        newCause.description = _description;
        newCause.proposer = msg.sender;
        newCause.timestamp = block.timestamp;
        newCause.votingEndTime = block.timestamp + votingPeriod;
        newCause.ipfsData = _ipfsData;

        emit CauseProposed(
            causeCount,
            _description,
            msg.sender,
            newCause.votingEndTime
        );

        return causeCount;
    }

    function vote(
        uint256 _causeId,
        uint256 _votes
    ) public nonReentrant causeExists(_causeId) votingOpen(_causeId) {
        require(_votes > 0, "Must vote with positive amount");
        require(
            daoToken.balanceOf(msg.sender) >= _votes,
            "Insufficient tokens to vote"
        );
        require(causes[_causeId].userVotes[msg.sender] == 0, "Already voted");

        causes[_causeId].votes += _votes;
        causes[_causeId].userVotes[msg.sender] = _votes;

        emit VoteCast(_causeId, msg.sender, _votes);

        // Check if cause can be automatically approved
        if (canBeApproved(_causeId)) {
            _approveCause(_causeId);
        }
    }

    function executeCause(
        uint256 _causeId
    ) public nonReentrant causeExists(_causeId) {
        Cause storage cause = causes[_causeId];
        require(cause.approved, "Cause not approved");
        require(!cause.executed, "Cause already executed");
        require(
            msg.sender == cause.proposer || msg.sender == owner(),
            "Not authorized"
        );

        cause.executed = true;
        emit CauseExecuted(_causeId);
    }

    // View functions
    function getCause(
        uint256 _causeId
    )
        public
        view
        returns (
            string memory description,
            address proposer,
            uint256 votes,
            bool approved,
            uint256 timestamp,
            uint256 votingEndTime,
            bool executed,
            string memory ipfsData
        )
    {
        Cause storage cause = causes[_causeId];
        return (
            cause.description,
            cause.proposer,
            cause.votes,
            cause.approved,
            cause.timestamp,
            cause.votingEndTime,
            cause.executed,
            cause.ipfsData
        );
    }

    function getVotesCast(
        uint256 _causeId,
        address _voter
    ) public view returns (uint256) {
        return causes[_causeId].userVotes[_voter];
    }

    function canBeApproved(uint256 _causeId) public view returns (bool) {
        Cause storage cause = causes[_causeId];
        uint256 totalSupply = daoToken.totalSupply();
        return cause.votes > (totalSupply * 50) / 100; // 50% majority
    }

    // Admin functions
    function updateMinimumTokens(uint256 _newMinimum) public onlyOwner {
        minimumTokensToPropose = _newMinimum;
        emit MinimumTokensUpdated(_newMinimum);
    }

    function updateVotingPeriod(uint256 _newPeriod) public onlyOwner {
        votingPeriod = _newPeriod;
        emit VotingPeriodUpdated(_newPeriod);
    }

    // Internal functions
    function _approveCause(uint256 _causeId) internal {
        causes[_causeId].approved = true;
        emit CauseApproved(_causeId);
    }
}
