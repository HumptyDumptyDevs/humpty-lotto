//SPDX-Licencse-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {VRFCoordinatorV2Mock} from "../test/mock/VRFCoordinatorV2Mock.sol";
import {LinkToken} from "../test/mock/LinkToken.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        uint256 entranceFee;
        uint256 interval;
        address vrfCoordinator;
        bytes32 gasLane;
        uint64 subscriptionId;
        uint32 callbackGasLimit;
        address link;
        uint256 deployerKey;
    }

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == 1) {
            activeNetworkConfig = getMainnetEthConfig();
        } else if (block.chainid == 421614) {
            activeNetworkConfig = getArbSepEthConfig();
        } else if (block.chainid == 137) {
            activeNetworkConfig = getPolyEthConfig();
        } else if (block.chainid == 80001) {
            activeNetworkConfig = getPolyMumEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilVrfConfig();
        }
    }

    uint256 public constant DEFAULT_ANVIL_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function getSepoliaEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
                gasLane: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
                subscriptionId: 10189,
                callbackGasLimit: 500000,
                link: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getMainnetEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: 0x271682DEB8C4E0901D1a1550aD2e64D568E69909,
                gasLane: 0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92,
                subscriptionId: 0,
                callbackGasLimit: 500000,
                link: 0x514910771AF9Ca656af840dff83E8264EcF986CA,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }
    function getArbSepEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: 0x50d47e4142598E3411aA864e08a44284e471AC6f,
                gasLane: 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414,
                subscriptionId: 211,
                callbackGasLimit: 2500000,
                link: 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }
    function getPolyMumEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed,
                gasLane: 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f,
                subscriptionId: 7475,
                callbackGasLimit: 2500000,
                link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }
    function getPolyEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: 0xAE975071Be8F8eE67addBC1A82488F1C24858067,
                gasLane: 0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd,
                subscriptionId: 0,
                callbackGasLimit: 2500000,
                link: 0xb0897686c545045aFc77CF20eC7A532E3120E0F1,
                deployerKey: vm.envUint("PRIVATE_KEY_HOT")
            });
    }

    function getOrCreateAnvilVrfConfig() public returns (NetworkConfig memory) {
        //Checking to see whether the vrfCoordinator has already been initialised
        //This is because when we ceate the activeNetworkConfig.vrfCoordinator it is set to 0x0
        //So if it doesnt equal 0x0 then we know it has already been initialised
        //And then we can return the activeNetworkConfig
        if (activeNetworkConfig.vrfCoordinator != address(0)) {
            return activeNetworkConfig;
        }

        LinkToken link = new LinkToken();

        vm.startBroadcast();
        uint96 baseFee = 0.25 ether;
        uint96 gasPriceLink = 1 gwei;

        VRFCoordinatorV2Mock vrfCoordinatorMock = new VRFCoordinatorV2Mock(
            baseFee,
            gasPriceLink
        );

        vm.stopBroadcast();

        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                interval: 30,
                vrfCoordinator: address(vrfCoordinatorMock),
                gasLane: 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc,
                subscriptionId: 0,
                callbackGasLimit: 500000,
                link: address(link),
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }
}
