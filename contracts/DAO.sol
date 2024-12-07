// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DAO {
    struct Proposal {
        uint id;
        string description;
        uint fundAmount;
        address proposer;
        uint voteCount;
        bool funded;
        mapping(address => bool) votes;
    }

    address public owner;
    uint public proposalCount = 0;
    mapping(uint => Proposal) public proposals;

    event ProposalCreated(uint id, string description, uint fundAmount, address proposer);
    event Voted(uint proposalId, address voter);
    event Funded(uint proposalId, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(string memory _description, uint _fundAmount) public {
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.description = _description;
        newProposal.fundAmount = _fundAmount;
        newProposal.proposer = msg.sender;
        newProposal.funded = false;

        emit ProposalCreated(proposalCount, _description, _fundAmount, msg.sender);
        proposalCount++;
    }

    function voteOnProposal(uint _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.votes[msg.sender], "Already voted");
        
        proposal.votes[msg.sender] = true;
        proposal.voteCount++;

        emit Voted(_proposalId, msg.sender);
    }

    function fundProposal(uint _proposalId) public onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.funded, "Already funded");

        proposal.funded = true;

        emit Funded(_proposalId, proposal.fundAmount);
    }
}
