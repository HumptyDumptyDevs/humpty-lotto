//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {Raffle} from "../src/Raffle.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {VRFCoordinatorV2Mock} from "../test/mock/VRFCoordinatorV2Mock.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import {LinkToken} from "../test/mock/LinkToken.sol";

contract CreateSubscription is Script {
    uint256 public constant ANVIL_CHAIN_ID = 31337;
    function createSubscriptionUsingConfig() public returns (uint64) {
        HelperConfig helperConfig = new HelperConfig();
        (, , address vrfCoordinator, , , , , uint256 deployerKey) = helperConfig
            .activeNetworkConfig();
        return createSubscription(vrfCoordinator, deployerKey);
    }

    function createSubscription(
        address vrfCoordinator,
        uint256 deployerKey
    ) public returns (uint64) {
        uint64 subscriptionId;
        if (block.chainid == ANVIL_CHAIN_ID) {
            console.log("Creating subscription on ChainId: ", block.chainid);
            vm.startBroadcast(deployerKey);
            subscriptionId = VRFCoordinatorV2Mock(vrfCoordinator)
                .createSubscription();
        } else {
            console.log(
                "Creating subscription on ChainId with interface:  ",
                block.chainid
            );
            vm.startBroadcast(deployerKey);
            subscriptionId = VRFCoordinatorV2Interface(vrfCoordinator)
                .createSubscription();
        }

        vm.stopBroadcast();
        console.log("Your subscriptionId is: ", subscriptionId);

        return subscriptionId;
    }

    function run() external returns (uint64) {
        return createSubscriptionUsingConfig();
    }
}

contract FundSubscription is Script {
    uint96 public constant FUND_AMOUNT = 5 ether;
    uint256 public constant ANVIL_CHAIN_ID = 31337;

    function fundSubscriptionUsingConfig() public {
        HelperConfig helperConfig = new HelperConfig();
        (
            ,
            ,
            address vrfCoordinator,
            ,
            uint64 subscriptionId,
            ,
            address link,
            uint256 deployerKey
        ) = helperConfig.activeNetworkConfig();
        fundSubscription(vrfCoordinator, link, subscriptionId, deployerKey);
    }

    function fundSubscription(
        address vrfCoordinator,
        address link,
        uint64 subscriptionId,
        uint256 deployerKey
    ) public {
        if (block.chainid == ANVIL_CHAIN_ID) {
            vm.startBroadcast(deployerKey);
            VRFCoordinatorV2Mock(vrfCoordinator).fundSubscription(
                subscriptionId,
                FUND_AMOUNT
            );
            vm.stopBroadcast();
        } else {
            vm.startBroadcast(deployerKey);
            LinkToken(link).transferAndCall(
                vrfCoordinator,
                FUND_AMOUNT,
                abi.encode(subscriptionId)
            );
            vm.stopBroadcast();
        }
    }

    function run() external {
        fundSubscriptionUsingConfig();
    }
}

contract AddConsumer is Script {
    function addConsumerUsingConfig(address mostRecentlyDeployed) public {
        HelperConfig helperConfig = new HelperConfig();
        (
            ,
            ,
            address vrfCoordinator,
            ,
            uint64 subscriptionId,
            ,
            ,
            uint256 deployerKey
        ) = helperConfig.activeNetworkConfig();
        addConsumer(
            vrfCoordinator,
            subscriptionId,
            mostRecentlyDeployed,
            deployerKey
        );
    }

    function addConsumer(
        address vrfCoordinator,
        uint64 subscriptionId,
        address mostRecentlyDeployed,
        uint256 deployerKey
    ) public {
        vm.startBroadcast(deployerKey);

        VRFCoordinatorV2Mock(vrfCoordinator).addConsumer(
            subscriptionId,
            mostRecentlyDeployed
        );
        vm.stopBroadcast();
    }

    function run() external {
        address payable mostRecentlyDeployed = payable(
            DevOpsTools.get_most_recent_deployment("Raffle", block.chainid)
        );
        addConsumerUsingConfig(mostRecentlyDeployed);
    }
}

contract EnterRaffle is Script {
    uint256 constant SEND_VALUE = 0.1 ether;

    function enterRaffle(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        Raffle(payable(mostRecentlyDeployed)).enterRaffle{value: SEND_VALUE}();
        vm.stopBroadcast();
    }

    function run() external {
        console.log("Getting most recent deployment");
        address payable mostRecentlyDeployed = payable(
            DevOpsTools.get_most_recent_deployment("Raffle", block.chainid)
        );
        console.log("mostRecentlyDeployed: ", mostRecentlyDeployed);
        enterRaffle(mostRecentlyDeployed);
    }
}

contract PerformUpkeep is Script {
    function performUpkeep(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        Raffle(payable(mostRecentlyDeployed)).performUpkeep("");
        vm.stopBroadcast();
    }

    function run() external {
        console.log("Getting most recent deployment");
        address payable mostRecentlyDeployed = payable(
            DevOpsTools.get_most_recent_deployment("Raffle", block.chainid)
        );
        console.log("mostRecentlyDeployed: ", mostRecentlyDeployed);
        performUpkeep(mostRecentlyDeployed);
    }
}
