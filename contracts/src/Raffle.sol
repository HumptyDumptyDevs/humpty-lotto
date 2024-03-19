//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title Raffle
 * @author Charlie Mack
 * @notice This contract is used for a simple raffle
 * @dev Implements Chainlink VRF v2
 */
contract Raffle is VRFConsumerBaseV2 {
    /** Errors */

    error Raffle__NotOwner();
    error Raffel__NotEnoughETHSent();
    error Raffel__TransferFailed();
    error Raffle__RaffleNotOpen();
    error Raffle__RaffleUpkeepNotNeeded(
        uint256 balance,
        uint256 playersLength,
        RaffleState raffleState,
        uint256 timeSinceOpen
    );

    /** Interfaces */

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    /** Type Declarations */

    enum RaffleState {
        IDLE,
        OPEN,
        CALCULATING
    }

    /** State Variables */

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private immutable i_interval;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    address private immutable i_owner;

    address payable[] private s_players;
    uint256 private s_timeStampWhenOpen;
    address private s_recentWinner;
    uint256 private s_entranceFee;
    RaffleState private s_raffleState;

    /** Events */

    event EnteredRaffle(address indexed player);
    event PickedWinner(address indexed winner);
    event RequestedRaffleWinner(uint256 indexed requestId);

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert Raffle__NotOwner();
        _;
    }

    constructor(
        uint256 entranceFee,
        uint256 interval,
        address vrfCoordinator,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_owner = msg.sender;
        s_entranceFee = entranceFee;
        i_interval = interval;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_timeStampWhenOpen = 0;
        s_raffleState = RaffleState.IDLE;
    }

    function enterRaffle() external payable {
        if (s_raffleState == RaffleState.CALCULATING) {
            revert Raffle__RaffleNotOpen();
        }

        if (msg.value < s_entranceFee) {
            revert Raffel__NotEnoughETHSent();
        }

        s_players.push(payable(msg.sender));

        if (s_players.length >= 2 && s_raffleState == RaffleState.IDLE) {
            s_raffleState = RaffleState.OPEN;
            s_timeStampWhenOpen = block.timestamp;
        }

        emit EnteredRaffle(msg.sender);
    }

    /**
     * @dev This is the function that the Chainlink Automation nodes call
     * to see if it's time to perform an upkeep.
     * The following should be true for this to return true:
     * 1. The raffle is in the OPEN state
     * 2. The time since the last raffle is greater than the interval
     * 3. The contract has ETH (aka, players)
     * 4. (Implicit) The subscription is funded with LINK
     */
    function checkUpkeep(
        bytes memory /*checkData*/
    ) public view returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool isOpen = RaffleState.OPEN == s_raffleState;
        bool hasBalance = address(this).balance > 0;
        bool hasPlayers = s_players.length >= 2;
        bool timeHasPassed = (block.timestamp - s_timeStampWhenOpen) >
            i_interval &&
            s_timeStampWhenOpen != 0;
        upkeepNeeded = timeHasPassed && isOpen && hasBalance && hasPlayers;
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(bytes calldata /* performData */) external {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__RaffleUpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                s_raffleState,
                block.timestamp - s_timeStampWhenOpen
            );
        }
        s_raffleState = RaffleState.CALCULATING;

        //1 Request the RNG
        //2 Get the random Number
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable winner = s_players[indexOfWinner];
        s_recentWinner = winner;

        //reset the raffle
        s_raffleState = RaffleState.IDLE;
        s_timeStampWhenOpen = 0;
        s_players = new address payable[](0);

        emit PickedWinner(winner);

        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffel__TransferFailed();
        }
    }

    //Allow owner to update the entrance fee
    function setEntranceFee(uint256 entranceFee) external onlyOwner {
        s_entranceFee = entranceFee;
    }

    /** Getter Functions */

    function getEntranceFee() public view returns (uint256) {
        return s_entranceFee;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getGasLane() public view returns (bytes32) {
        return i_gasLane;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getCallbackGasLimit() public view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getPlayer(uint256 index) public view returns (address payable) {
        return s_players[index];
    }

    function getTimeStampWhenOpen() public view returns (uint256) {
        return s_timeStampWhenOpen;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTimeSinceOpen() public view returns (uint256) {
        return block.timestamp - s_timeStampWhenOpen;
    }
}
