// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./DAOToken.sol";

contract ValidatorStaking is Ownable(msg.sender), ReentrancyGuard, Pausable {
    DAOToken public daoToken;

    struct Validator {
        bool isActive;
        uint256 stakedAmount;
        uint256 commissionRate;
        uint256 totalDelegated;
        uint256 rewardsAccumulated;
        uint256 lastUpdateTime;
        string metadata;
    }

    struct Delegation {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastClaimTime;
    }

    // State variables
    mapping(address => Validator) public validators;
    mapping(address => mapping(address => Delegation)) public delegations;
    mapping(address => address[]) public validatorDelegators;

    uint256 public minValidatorStake;
    uint256 public minDelegationAmount;
    uint256 public validatorCount;
    uint256 public totalStaked;
    uint256 public rewardRate;
    uint256 public constant COMMISSION_DENOMINATOR = 10000; // For 100.00%

    // Events
    event ValidatorRegistered(
        address indexed validator,
        uint256 stake,
        uint256 commissionRate
    );
    event ValidatorDeactivated(address indexed validator);
    event Delegated(
        address indexed delegator,
        address indexed validator,
        uint256 amount
    );
    event Undelegated(
        address indexed delegator,
        address indexed validator,
        uint256 amount
    );
    event RewardsClaimed(address indexed user, uint256 amount);
    event CommissionRateUpdated(address indexed validator, uint256 newRate);

    constructor(
        address _daoToken,
        uint256 _minValidatorStake,
        uint256 _minDelegationAmount,
        uint256 _rewardRate
    ) {
        daoToken = DAOToken(_daoToken);
        minValidatorStake = _minValidatorStake;
        minDelegationAmount = _minDelegationAmount;
        rewardRate = _rewardRate;
    }

    function registerValidator(
        uint256 _stake,
        uint256 _commissionRate,
        string memory _metadata
    ) external whenNotPaused nonReentrant {
        require(!validators[msg.sender].isActive, "Already registered");
        require(_stake >= minValidatorStake, "Insufficient stake");
        require(
            _commissionRate <= COMMISSION_DENOMINATOR,
            "Invalid commission"
        );
        require(
            daoToken.transferFrom(msg.sender, address(this), _stake),
            "Stake transfer failed"
        );

        validators[msg.sender] = Validator({
            isActive: true,
            stakedAmount: _stake,
            commissionRate: _commissionRate,
            totalDelegated: 0,
            rewardsAccumulated: 0,
            lastUpdateTime: block.timestamp,
            metadata: _metadata
        });

        validatorCount++;
        totalStaked += _stake;

        emit ValidatorRegistered(msg.sender, _stake, _commissionRate);
    }

    function delegate(
        address _validator
    ) external payable whenNotPaused nonReentrant {
        require(validators[_validator].isActive, "Validator not active");
        require(msg.value >= minDelegationAmount, "Below min delegation");

        _updateRewards(_validator);

        Delegation storage delegation = delegations[msg.sender][_validator];
        if (delegation.amount > 0) {
            _claimRewards(msg.sender, _validator);
        }

        delegation.amount += msg.value;
        delegation.lastClaimTime = block.timestamp;
        validators[_validator].totalDelegated += msg.value;
        totalStaked += msg.value;

        if (delegation.amount == msg.value) {
            validatorDelegators[_validator].push(msg.sender);
        }

        emit Delegated(msg.sender, _validator, msg.value);
    }

    function undelegate(
        address _validator,
        uint256 _amount
    ) external nonReentrant {
        Delegation storage delegation = delegations[msg.sender][_validator];
        require(delegation.amount >= _amount, "Insufficient delegation");

        _updateRewards(_validator);
        _claimRewards(msg.sender, _validator);

        delegation.amount -= _amount;
        validators[_validator].totalDelegated -= _amount;
        totalStaked -= _amount;

        payable(msg.sender).transfer(_amount);

        emit Undelegated(msg.sender, _validator, _amount);
    }

    function claimRewards(address _validator) external nonReentrant {
        _updateRewards(_validator);
        _claimRewards(msg.sender, _validator);
    }

    function updateCommissionRate(uint256 _newRate) external {
        require(validators[msg.sender].isActive, "Not a validator");
        require(_newRate <= COMMISSION_DENOMINATOR, "Invalid rate");

        _updateRewards(msg.sender);
        validators[msg.sender].commissionRate = _newRate;

        emit CommissionRateUpdated(msg.sender, _newRate);
    }

    function _updateRewards(address _validator) internal {
        Validator storage validator = validators[_validator];
        uint256 timeElapsed = block.timestamp - validator.lastUpdateTime;

        if (timeElapsed > 0 && validator.totalDelegated > 0) {
            uint256 rewards = (validator.totalDelegated *
                rewardRate *
                timeElapsed) / 1e18;
            validator.rewardsAccumulated += rewards;
            validator.lastUpdateTime = block.timestamp;
        }
    }

    function _claimRewards(address _delegator, address _validator) internal {
        Delegation storage delegation = delegations[_delegator][_validator];
        Validator storage validator = validators[_validator];

        uint256 share = (delegation.amount * 1e18) / validator.totalDelegated;
        uint256 rewards = (validator.rewardsAccumulated * share) / 1e18;
        uint256 commission = (rewards * validator.commissionRate) /
            COMMISSION_DENOMINATOR;
        uint256 delegatorReward = rewards - commission;

        if (delegatorReward > 0) {
            require(
                daoToken.transfer(_delegator, delegatorReward),
                "Reward transfer failed"
            );
            emit RewardsClaimed(_delegator, delegatorReward);
        }

        if (commission > 0) {
            require(
                daoToken.transfer(_validator, commission),
                "Commission transfer failed"
            );
        }

        delegation.rewardDebt = validator.rewardsAccumulated;
    }

    function getValidatorInfo(
        address _validator
    )
        external
        view
        returns (
            bool isActive,
            uint256 stakedAmount,
            uint256 commissionRate,
            uint256 totalDelegated,
            uint256 rewardsAccumulated,
            string memory metadata
        )
    {
        Validator storage validator = validators[_validator];
        return (
            validator.isActive,
            validator.stakedAmount,
            validator.commissionRate,
            validator.totalDelegated,
            validator.rewardsAccumulated,
            validator.metadata
        );
    }

    function getDelegation(
        address _delegator,
        address _validator
    )
        external
        view
        returns (uint256 amount, uint256 rewardDebt, uint256 lastClaimTime)
    {
        Delegation storage delegation = delegations[_delegator][_validator];
        return (
            delegation.amount,
            delegation.rewardDebt,
            delegation.lastClaimTime
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}
}
