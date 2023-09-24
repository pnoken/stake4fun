// SPDX-License-Identifier: MIT
pragma solidity 0.8.4; //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./ExternalContract.sol";

contract Staker {
	ExternalContract public externalContract;
	IERC20 public immutable stakingToken;
	IERC20 public immutable rewardsToken;

	constructor(
		address externalContractAddress,
		address _stakingToken,
		address _rewardToken
	) {
		externalContract = ExternalContract(externalContractAddress);
		stakingToken = IERC20(_stakingToken);
		rewardsToken = IERC20(_rewardToken);
	}

	// Modifier to check that ExampleExternalContract is not completed
	modifier notCompleted() {
		require(
			!externalContract.completed(),
			"Staking process already completed"
		);
		_;
	}

	// Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
	// (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)
	mapping(address => uint256) public balances;
	uint256 public constant threshold = 100 ether;
	uint256 public deadline = block.timestamp + 168 hours;
	bool public openForWithdraw;

	// User address => rewardPerTokenStored
	mapping(address => uint) public userRewardPerTokenPaid;

	//Events
	event Receieve(address indexed staker, uint256 amount);
	event WithdrawEnabled(bool enabled);
	event Stake(address indexed staker, uint256 amount);

	function stake() public payable {
		require(
			msg.value <= threshold,
			"Staking amount must not be greater than 1000 MATIC"
		);
		balances[msg.sender] += msg.value;
		emit Stake(msg.sender, msg.value);
	}

	// After some `deadline` allow anyone to call an `execute()` function
	function execute() external notCompleted {
		require(block.timestamp > deadline, "Deadline has not expired");
		if (address(this).balance >= threshold) {
			// If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`
			externalContract.complete{ value: address(this).balance }();
		} else {
			// If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance
			openForWithdraw = true;
			emit WithdrawEnabled(true);
		}
	}

	// Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
	function timeLeft() public view returns (uint256) {
		if (block.timestamp >= deadline) {
			return 0;
		}
		return deadline - block.timestamp;
	}

	// Function to withdraw staked ETH
	function withdraw(uint256 amount) external notCompleted {
		require(openForWithdraw, "Withdraw is not yet enabled");
		require(amount > 0, "Amount must be greater than 0");
		require(balances[msg.sender] >= amount, "Insufficient balance");

		balances[msg.sender] -= amount;
		payable(msg.sender).transfer(amount);
	}

	// Add the `receive()` special function that receives eth and calls stake()
	receive() external payable {
		stake();
		emit Receieve(msg.sender, msg.value);
	}
}

interface IERC20 {
	function totalSupply() external view returns (uint);

	function balanceOf(address account) external view returns (uint);

	function transfer(address recipient, uint amount) external returns (bool);

	function allowance(
		address owner,
		address spender
	) external view returns (uint);

	function approve(address spender, uint amount) external returns (bool);

	function transferFrom(
		address sender,
		address recipient,
		uint amount
	) external returns (bool);

	event Transfer(address indexed from, address indexed to, uint value);
	event Approval(address indexed owner, address indexed spender, uint value);
}
