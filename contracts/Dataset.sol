// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./DAOToken.sol";

contract Datasets is Ownable(msg.sender), ReentrancyGuard, Pausable {
    DAOToken public daoToken;

    struct Dataset {
        address ngo;
        string ipfsHash;
        uint256 validationCount;
        bool validated;
        uint256 timestamp;
        uint256 validationEndTime;
        string metadata;
        DatasetStatus status;
        uint256 requiredValidations;
        uint256 stakingAmount;
    }

    struct Validation {
        address validator;
        bool vote;
        uint256 stakedAmount;
        uint256 timestamp;
    }

    enum DatasetStatus {
        Pending,
        UnderValidation,
        Approved,
        Rejected
    }

    // State variables
    mapping(uint256 => Dataset) public datasets;
    mapping(uint256 => mapping(address => Validation)) public validations;
    mapping(uint256 => address[]) public datasetValidators;
    mapping(address => uint256[]) public validatorDatasets;
    uint256 public datasetCount;
    uint256 public validationPeriod;
    uint256 public minStakeAmount;

    // Events
    event DatasetSubmitted(
        uint256 indexed datasetId,
        address indexed ngo,
        string ipfsHash,
        string metadata
    );
    event ValidationSubmitted(
        uint256 indexed datasetId,
        address indexed validator,
        bool vote,
        uint256 stakedAmount
    );
    event DatasetStatusUpdated(uint256 indexed datasetId, DatasetStatus status);
    event ValidatorRewarded(
        uint256 indexed datasetId,
        address indexed validator,
        uint256 reward
    );
    event StakeSlashed(
        uint256 indexed datasetId,
        address indexed validator,
        uint256 amount
    );

    constructor(
        address _daoToken,
        uint256 _validationPeriod,
        uint256 _minStakeAmount
    ) {
        daoToken = DAOToken(_daoToken);
        validationPeriod = _validationPeriod;
        minStakeAmount = _minStakeAmount;
    }

    // Main functions
    function submitDataset(
        string memory _ipfsHash,
        string memory _metadata,
        uint256 _requiredValidations
    ) public whenNotPaused nonReentrant returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(_requiredValidations > 0, "Invalid validation requirement");

        datasetCount++;
        Dataset storage newDataset = datasets[datasetCount];
        newDataset.ngo = msg.sender;
        newDataset.ipfsHash = _ipfsHash;
        newDataset.timestamp = block.timestamp;
        newDataset.validationEndTime = block.timestamp + validationPeriod;
        newDataset.metadata = _metadata;
        newDataset.status = DatasetStatus.Pending;
        newDataset.requiredValidations = _requiredValidations;
        newDataset.stakingAmount = minStakeAmount;

        emit DatasetSubmitted(datasetCount, msg.sender, _ipfsHash, _metadata);
        return datasetCount;
    }

    function validateDataset(
        uint256 _datasetId,
        bool _isValid
    ) public whenNotPaused nonReentrant {
        Dataset storage dataset = datasets[_datasetId];
        require(dataset.ngo != address(0), "Dataset doesn't exist");
        require(
            block.timestamp <= dataset.validationEndTime,
            "Validation period ended"
        );
        require(
            dataset.status == DatasetStatus.Pending,
            "Invalid dataset status"
        );
        require(
            validations[_datasetId][msg.sender].validator == address(0),
            "Already validated"
        );

        // Stake tokens
        require(
            daoToken.transferFrom(
                msg.sender,
                address(this),
                dataset.stakingAmount
            ),
            "Staking failed"
        );

        // Record validation
        validations[_datasetId][msg.sender] = Validation({
            validator: msg.sender,
            vote: _isValid,
            stakedAmount: dataset.stakingAmount,
            timestamp: block.timestamp
        });

        datasetValidators[_datasetId].push(msg.sender);
        validatorDatasets[msg.sender].push(_datasetId);
        dataset.validationCount++;

        emit ValidationSubmitted(
            _datasetId,
            msg.sender,
            _isValid,
            dataset.stakingAmount
        );

        // Check if enough validations received
        if (dataset.validationCount >= dataset.requiredValidations) {
            _finalizeValidation(_datasetId);
        }
    }

    // Internal functions
    function _finalizeValidation(uint256 _datasetId) internal {
        Dataset storage dataset = datasets[_datasetId];
        uint256 approvalCount = 0;
        address[] memory validators = datasetValidators[_datasetId];

        for (uint256 i = 0; i < validators.length; i++) {
            if (validations[_datasetId][validators[i]].vote) {
                approvalCount++;
            }
        }

        bool isApproved = approvalCount > (validators.length / 2);
        dataset.status = isApproved
            ? DatasetStatus.Approved
            : DatasetStatus.Rejected;

        // Distribute rewards or slash stakes
        for (uint256 i = 0; i < validators.length; i++) {
            address validator = validators[i];
            Validation storage validation = validations[_datasetId][validator];

            if (validation.vote == isApproved) {
                // Reward correct validators
                uint256 reward = (validation.stakedAmount * 12) / 10; // 20% reward
                require(
                    daoToken.transfer(validator, reward),
                    "Reward transfer failed"
                );
                emit ValidatorRewarded(_datasetId, validator, reward);
            } else {
                // Slash incorrect validators
                emit StakeSlashed(
                    _datasetId,
                    validator,
                    validation.stakedAmount
                );
            }
        }

        emit DatasetStatusUpdated(_datasetId, dataset.status);
    }

    // View functions
    function getDataset(
        uint256 _datasetId
    )
        public
        view
        returns (
            address ngo,
            string memory ipfsHash,
            uint256 validationCount,
            bool validated,
            uint256 timestamp,
            uint256 validationEndTime,
            string memory metadata,
            DatasetStatus status,
            uint256 requiredValidations
        )
    {
        Dataset storage dataset = datasets[_datasetId];
        return (
            dataset.ngo,
            dataset.ipfsHash,
            dataset.validationCount,
            dataset.validated,
            dataset.timestamp,
            dataset.validationEndTime,
            dataset.metadata,
            dataset.status,
            dataset.requiredValidations
        );
    }

    function getValidation(
        uint256 _datasetId,
        address _validator
    )
        public
        view
        returns (
            bool validationExists,
            bool vote,
            uint256 stakedAmount,
            uint256 timestamp
        )
    {
        Validation storage validation = validations[_datasetId][_validator];
        return (
            validation.validator != address(0),
            validation.vote,
            validation.stakedAmount,
            validation.timestamp
        );
    }

    function getValidatorDatasets(
        address _validator
    ) public view returns (uint256[] memory) {
        return validatorDatasets[_validator];
    }

    // Admin functions
    function updateValidationPeriod(uint256 _newPeriod) public onlyOwner {
        validationPeriod = _newPeriod;
    }

    function updateMinStakeAmount(uint256 _newAmount) public onlyOwner {
        minStakeAmount = _newAmount;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
