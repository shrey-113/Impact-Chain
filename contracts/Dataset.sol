// Datasets.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Datasets {
    struct Dataset {
        address ngo;
        string ipfsHash;
        uint256 validationCount;
        bool validated;
    }

    mapping(uint256 => Dataset) public datasets;
    uint256 public datasetCount;

    function submitDataset(string memory _ipfsHash) public {
        datasetCount++;
        datasets[datasetCount] = Dataset({
            ngo: msg.sender,
            ipfsHash: _ipfsHash,
            validationCount: 0,
            validated: false
        });
    }

    function validateDataset(uint256 _datasetId, bool _isValid) public {
        require(!datasets[_datasetId].validated, "Dataset already validated");

        if (_isValid) {
            datasets[_datasetId].validationCount++;
        }

        if (datasets[_datasetId].validationCount >= 3) {
            datasets[_datasetId].validated = true;
        }
    }
}
