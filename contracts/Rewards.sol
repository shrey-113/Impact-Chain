// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./DAOToken.sol";

contract Rewards is Ownable(msg.sender), ReentrancyGuard, Pausable {
    DAOToken public daoToken;

    struct RewardPool {
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    struct UserRewards {
        uint256 totalEarned;
        uint256 lastClaimTime;
        bool isActive;
    }

    // State variables
    mapping(address => UserRewards) public userRewards;
    mapping(uint256 => RewardPool) public rewardPools;
    mapping(address => uint256) public stakingBalance;

    uint256 public currentPoolId;
    uint256 public minStakingAmount;
    uint256 public rewardRate; // Rewards per token per second
    uint256 public totalStaked;

    // Events
    event RewardPoolCreated(
        uint256 indexed poolId,
        uint256 amount,
        uint256 startTime,
        uint256 endTime
    );
    event RewardsClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _daoToken,
        uint256 _minStakingAmount,
        uint256 _rewardRate
    ) {
        daoToken = DAOToken(_daoToken);
        minStakingAmount = _minStakingAmount;
        rewardRate = _rewardRate;
    }

    // Main functions
    function createRewardPool(
        uint256 _amount,
        uint256 _duration
    ) public onlyOwner {
        require(_amount > 0, "Invalid amount");
        require(_duration > 0, "Invalid duration");
        require(
            daoToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        currentPoolId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _duration;

        rewardPools[currentPoolId] = RewardPool({
            totalAmount: _amount,
            remainingAmount: _amount,
            startTime: startTime,
            endTime: endTime,
            active: true
        });

        emit RewardPoolCreated(currentPoolId, _amount, startTime, endTime);
    }

    function stake(uint256 _amount) public whenNotPaused nonReentrant {
        require(_amount >= minStakingAmount, "Below minimum stake");
        require(
            daoToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Update rewards before modifying stake
        _updateRewards(msg.sender);

        stakingBalance[msg.sender] += _amount;
        totalStaked += _amount;
        userRewards[msg.sender].isActive = true;

        emit Staked(msg.sender, _amount, block.timestamp);
    }

    function unstake(uint256 _amount) public nonReentrant {
        require(stakingBalance[msg.sender] >= _amount, "Insufficient stake");

        // Update and claim rewards before unstaking
        _updateRewards(msg.sender);
        _claimRewards();

        stakingBalance[msg.sender] -= _amount;
        totalStaked -= _amount;

        if (stakingBalance[msg.sender] == 0) {
            userRewards[msg.sender].isActive = false;
        }

        require(daoToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Unstaked(msg.sender, _amount, block.timestamp);
    }

    function claimRewards() public nonReentrant {
        _updateRewards(msg.sender);
        _claimRewards();
    }

    // Internal functions
    function _updateRewards(address _user) internal {
        if (stakingBalance[_user] == 0) return;

        RewardPool storage currentPool = rewardPools[currentPoolId];
        if (!currentPool.active) return;

        uint256 timeElapsed = block.timestamp -
            userRewards[_user].lastClaimTime;
        uint256 reward = (stakingBalance[_user] * rewardRate * timeElapsed) /
            1e18;

        if (reward > currentPool.remainingAmount) {
            reward = currentPool.remainingAmount;
        }

        userRewards[_user].totalEarned += reward;
        userRewards[_user].lastClaimTime = block.timestamp;
        currentPool.remainingAmount -= reward;

        if (
            currentPool.remainingAmount == 0 ||
            block.timestamp >= currentPool.endTime
        ) {
            currentPool.active = false;
        }
    }

    function _claimRewards() internal {
        uint256 rewardAmount = userRewards[msg.sender].totalEarned;
        if (rewardAmount == 0) return;

        userRewards[msg.sender].totalEarned = 0;
        require(
            daoToken.transfer(msg.sender, rewardAmount),
            "Reward transfer failed"
        );

        emit RewardsClaimed(msg.sender, rewardAmount, block.timestamp);
    }

    // View functions
    function getPendingRewards(address _user) public view returns (uint256) {
        if (stakingBalance[_user] == 0) return 0;

        RewardPool storage currentPool = rewardPools[currentPoolId];
        if (!currentPool.active) return userRewards[_user].totalEarned;

        uint256 timeElapsed = block.timestamp -
            userRewards[_user].lastClaimTime;
        uint256 pendingReward = (stakingBalance[_user] *
            rewardRate *
            timeElapsed) / 1e18;

        return userRewards[_user].totalEarned + pendingReward;
    }

    function getRewardPool(
        uint256 _poolId
    )
        public
        view
        returns (
            uint256 totalAmount,
            uint256 remainingAmount,
            uint256 startTime,
            uint256 endTime,
            bool active
        )
    {
        RewardPool storage pool = rewardPools[_poolId];
        return (
            pool.totalAmount,
            pool.remainingAmount,
            pool.startTime,
            pool.endTime,
            pool.active
        );
    }

    // Admin functions
    function updateRewardRate(uint256 _newRate) public onlyOwner {
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    function updateMinStakingAmount(uint256 _newAmount) public onlyOwner {
        minStakingAmount = _newAmount;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Emergency function
    function emergencyWithdraw() public onlyOwner {
        uint256 balance = daoToken.balanceOf(address(this));
        require(
            daoToken.transfer(owner(), balance),
            "Emergency withdraw failed"
        );
    }
}
