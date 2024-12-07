// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DatasetValidation {
    struct Dataset {
        uint id;
        string ipfsHash;
        address uploader;
        uint stakeAmount;
        bool isValid;
        bool isFraudulent;
    }

    address public owner;
    uint public datasetCount = 0;
    mapping(uint => Dataset) public datasets;
    mapping(address => uint) public stakes;

    event DatasetUploaded(uint id, string ipfsHash, address uploader);
    event DatasetValidated(uint id, bool isValid, address validator);
    event StakeSlashed(address validator, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function uploadDataset(string memory _ipfsHash, uint _stakeAmount) public {
        datasets[datasetCount] = Dataset(datasetCount, _ipfsHash, msg.sender, _stakeAmount, false, false);
        stakes[msg.sender] += _stakeAmount;

        emit DatasetUploaded(datasetCount, _ipfsHash, msg.sender);
        datasetCount++;
    }

    function validateDataset(uint _datasetId, bool _isValid) public onlyOwner {
        Dataset storage dataset = datasets[_datasetId];
        dataset.isValid = _isValid;

        emit DatasetValidated(_datasetId, _isValid, msg.sender);
    }

    function slashStake(address _validator, uint _amount) public onlyOwner {
        require(stakes[_validator] >= _amount, "Insufficient stake");
        stakes[_validator] -= _amount;

        emit StakeSlashed(_validator, _amount);
    }
}
