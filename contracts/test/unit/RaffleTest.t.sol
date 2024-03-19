//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Raffle} from "../../src/Raffle.sol";
import {DeployRaffle} from "../../script/DeployRaffle.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {Vm} from "forge-std/Vm.sol";
import {VRFCoordinatorV2Mock} from "../mock/VRFCoordinatorV2Mock.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RaffleTest is Test {
    /* Events */
    event EnteredRaffle(address indexed player);

    Raffle raffle;
    HelperConfig helperConfig;
    address USER = makeAddr("user");
    address USERTWO = makeAddr("usertwo");
    uint256 constant STARTING_BALANCE = 10 ether;
    uint256 entranceFee;
    uint256 interval;
    address vrfCoordinator;
    bytes32 gasLane;
    uint64 subscriptionId;
    uint32 callbackGasLimit;
    address link;

    modifier raffleEnteredOnce() {
        vm.prank(USER);
        console.log("pranking user: ", USER);
        console.log("user balance: ", address(USER).balance);
        console.log("Test");
        raffle.enterRaffle{value: entranceFee}();
        _;
    }

    modifier raffleEnteredTwice() {
        vm.prank(USER);
        raffle.enterRaffle{value: entranceFee}();
        vm.prank(USERTWO);
        raffle.enterRaffle{value: entranceFee}();
        _;
    }

    modifier raffleEnteredTwiceAndTimePassed() {
        vm.prank(USER);
        raffle.enterRaffle{value: entranceFee}();
        vm.prank(USERTWO);
        raffle.enterRaffle{value: entranceFee}();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        _;
    }

    modifier skipFork() {
        if (block.chainid != 31337) {
            console.log("Skipping fork");
            return;
        }
        _;
    }

    function setUp() external {
        DeployRaffle deployRaffle = new DeployRaffle();
        (raffle, helperConfig) = deployRaffle.run();
        (
            entranceFee,
            interval,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit,
            link,

        ) = helperConfig.activeNetworkConfig();
        vm.deal(USER, STARTING_BALANCE);
        vm.deal(USERTWO, STARTING_BALANCE);
    }

    function testRaffleInitilizesWithIdleState() public raffleEnteredOnce {
        assert(raffle.getRaffleState() == Raffle.RaffleState.IDLE);
    }

    //UPDATE RAFFLE FEE

    function testSetRaffleFeeCanWillFailIfNotOwner() public {
        vm.expectRevert(Raffle.Raffle__NotOwner.selector);
        raffle.setEntranceFee(100);
    }

    function testSetRaffleFeeCanCanBeCalledByOwner() public {
        vm.prank(msg.sender);
        raffle.setEntranceFee(100);
        assert(raffle.getEntranceFee() == 100);
    }

    //ENTER RAFFLE

    function testRaffleRevertsWhenYouDontPayEnough() public {
        vm.prank(USER);
        vm.expectRevert(Raffle.Raffel__NotEnoughETHSent.selector);
        raffle.enterRaffle();
    }

    function testRaffleRecordsPlaterWhenTheyEnter() public raffleEnteredOnce {
        assertEq(raffle.getPlayers().length, 1);
        assertEq(raffle.getPlayer(0), USER);
    }

    function testEmitsEventOnEntrance() public {
        vm.prank(USER);
        vm.expectEmit(true, false, false, false, address(raffle));
        emit EnteredRaffle(USER);
        raffle.enterRaffle{value: entranceFee}();
    }

    function testCanUserEnterRaffleTwice() public raffleEnteredOnce {
        vm.prank(USER);
        raffle.enterRaffle{value: entranceFee}();
        assertEq(raffle.getPlayers().length, 2);
        assertEq(raffle.getPlayer(1), USER);
    }

    function testCantEnterWhenRaffleIsCalculating() public raffleEnteredTwice {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        raffle.performUpkeep("");

        vm.expectRevert(Raffle.Raffle__RaffleNotOpen.selector);
        raffle.enterRaffle{value: entranceFee}();
    }

    function testRaffleEntryFailsWithLowAmount() public {
        vm.expectRevert();
        vm.prank(USER);
        raffle.enterRaffle();
    }

    function testRaffleEntryFailsWithNoAmount() public {
        vm.expectRevert();
        vm.prank(USER);
        raffle.enterRaffle{value: 0}();
    }

    function testRaffleStateIsIdleIfOnlyOnePlayer() public raffleEnteredOnce {
        Raffle.RaffleState state = raffle.getRaffleState();
        assertEq(uint(state), 0);
    }

    function testRaffleStateIsSetToOpenWhenTwoPlayersJoin()
        public
        raffleEnteredTwice
    {
        Raffle.RaffleState state = raffle.getRaffleState();
        assertEq(uint(state), 1);
    }

    function testTimeStampWhenOpenIsUpdatedWhenTwoPlayersJoin()
        public
        raffleEnteredTwice
    {
        uint256 timeStampWhenOpen = raffle.getTimeStampWhenOpen();
        assert(timeStampWhenOpen > 0);
    }

    //CHECK UPKEEP

    function testCheckUpkeepReturnsFalseIfItHasNoBalance() public {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);

        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsFalseIfRaffleNotOpen()
        public
        raffleEnteredTwice
    {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        raffle.performUpkeep("");

        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsFalseIfEnoughTimeHasntPassedSinceOpen()
        public
        raffleEnteredTwice
    {
        vm.warp(block.timestamp + interval - 5);
        vm.roll(block.number + 1);
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsTrueIfAllConditionsAreMet()
        public
        raffleEnteredTwice
    {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        assert(upkeepNeeded);
    }

    //PERFORM UPKEEP

    function testPerformUpkeepCanOnlyRunIfCheckUpkeepReturnsTrue()
        public
        raffleEnteredTwice
    {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        raffle.performUpkeep("");
    }

    function testPerformUpkeepRevertsIfCheckUpkeepReturnsFalse() public {
        uint256 currentBalance = 0;
        uint256 currentPlayersLength = 0;
        uint8 currentRaffleState = 0;
        //This should just be set to block.timestamp because the raffle hasnt started yet
        uint256 currentTimeSinceOpen = block.timestamp;

        vm.expectRevert(
            abi.encodeWithSelector(
                Raffle.Raffle__RaffleUpkeepNotNeeded.selector,
                currentBalance,
                currentPlayersLength,
                currentRaffleState,
                currentTimeSinceOpen
            )
        );
        raffle.performUpkeep("");
    }

    function testPerformUpkeepUpdatesRaffleStateAndEmitsEvent()
        public
        raffleEnteredTwiceAndTimePassed
    {
        vm.recordLogs();
        raffle.performUpkeep(""); // emit requestId
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 totalEvent = entries[1].topics[0];
        console.logBytes32(totalEvent);
        bytes32 requestId = entries[1].topics[1];
        console.logBytes32(requestId);
        Raffle.RaffleState rState = raffle.getRaffleState();
        assert(uint256(requestId) > 0);
        assert(uint256(rState) == 2);
    }

    // FULFILL RANDOM WORDS

    function testFulfillRandomWordsCanOnlyBeCalledAfterPerformUpkeep(
        uint256 randomRequestId
    ) public raffleEnteredTwiceAndTimePassed skipFork {
        vm.expectRevert("nonexistent request");
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            randomRequestId,
            address(raffle)
        );
    }

    function testFulfillRandomWordsPicksWinnerAndResetsRaffle()
        public
        raffleEnteredTwiceAndTimePassed
        skipFork
    {
        uint256 additionalEntrants = 5;
        uint256 startingIndex = 1;
        for (
            uint256 i = startingIndex;
            i < startingIndex + additionalEntrants;
            i++
        ) {
            address user = makeAddr(Strings.toString(i));
            hoax(user, STARTING_BALANCE);
            raffle.enterRaffle{value: entranceFee}();
        }

        // uint256 previousTimeStamp = raffle.getLastTimeStamp();

        uint256 prize = address(raffle).balance;

        vm.recordLogs();
        raffle.performUpkeep(""); // emit requestId
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 requestId = entries[1].topics[1];

        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            uint256(requestId),
            address(raffle)
        );

        address winner = raffle.getRecentWinner();

        console.log(winner.balance);
        console.log(prize + STARTING_BALANCE);

        assert(uint256(raffle.getRaffleState()) == 0);
        assert(raffle.getRecentWinner() != address(0));
        assert(raffle.getPlayers().length == 0);
        assert(raffle.getTimeStampWhenOpen() == 0);
        assert(winner != address(0));
        assert(
            winner.balance == uint256(prize + STARTING_BALANCE - entranceFee)
        );
    }

    function testCheckUpkeepIsFalseWithNoPlayers() public skipFork {
        bytes4 RAFFLE_UPKEEP_NOT_NEEDED_SELECTOR = bytes4(
            keccak256(
                "Raffle__RaffleUpkeepNotNeeded(uint256,uint256,uint8,uint256)"
            )
        );

        vm.deal(address(raffle), 1 ether);
        vm.warp(block.timestamp + 100);

        uint256 expectedBalance = 1000000000000000000; // Example balance
        uint256 expectedPlayersLength = 0; // Example players length
        int8 expectedRaffleState = 0; // Assuming RaffleState.IDLE is 0
        uint256 expectedTimeSinceLastRaffle = 101; // Example time since last raffle

        bytes memory encodedError = abi.encodeWithSelector(
            RAFFLE_UPKEEP_NOT_NEEDED_SELECTOR,
            expectedBalance,
            expectedPlayersLength,
            expectedRaffleState,
            expectedTimeSinceLastRaffle
        );

        vm.expectRevert(encodedError);
        raffle.performUpkeep("");
    }

    //TESTING GETTERS
    function testGetEntranceFeeIsPopulated() public view {
        assertTrue(
            raffle.getEntranceFee() > 0,
            "Entrance fee should be greater than 0"
        );
    }

    function testGetIntervalIsPopulated() public view {
        assertTrue(
            raffle.getInterval() > 0,
            "Interval should be greater than 0"
        );
    }

    function testGetGasLaneIsPopulated() public view {
        assertTrue(
            raffle.getGasLane() != bytes32(0),
            "Gas lane should not be the zero value"
        );
    }

    function testGetSubscriptionIdIsPopulated() public view {
        assertTrue(
            raffle.getSubscriptionId() > 0,
            "Subscription ID should be greater than 0"
        );
    }

    function testGetCallbackGasLimitIsPopulated() public view {
        assertTrue(
            raffle.getCallbackGasLimit() > 0,
            "Callback gas limit should be greater than 0"
        );
    }

    function testGetLastTimeStampIsReasonable() public view {
        assertTrue(
            raffle.getTimeStampWhenOpen() == 0,
            "Time stamp when open should initially be 0"
        );
    }

    function testGetRecentWinnerInitiallyZero() public view {
        assertTrue(
            raffle.getRecentWinner() == address(0),
            "Recent winner should initially be the zero address"
        );
    }

    function testGetRaffleStateIsOpenOrCalculating() public view {
        Raffle.RaffleState state = raffle.getRaffleState();
        assertTrue(
            uint(state) >= 0 && uint(state) <= 1,
            "Raffle state should be either OPEN or CALCULATING"
        );
    }

    function testGetPlayersInitiallyEmpty() public view {
        address payable[] memory players = raffle.getPlayers();
        assertTrue(
            players.length == 0,
            "Players array should initially be empty"
        );
    }
}
