export const abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "entranceFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "interval",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "vrfCoordinator",
        type: "address",
        internalType: "address",
      },
      {
        name: "gasLane",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "subscriptionId",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "callbackGasLimit",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "checkUpkeep",
    inputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "upkeepNeeded",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "enterRaffle",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getBalance",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCallbackGasLimit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntranceFee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGasLane",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInterval",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPlayer",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address payable",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPlayers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address payable[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRaffleState",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum Raffle.RaffleState",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRecentWinner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSubscriptionId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTimeSinceOpen",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTimeStampWhenOpen",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "performUpkeep",
    inputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rawFulfillRandomWords",
    inputs: [
      {
        name: "requestId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "randomWords",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "EnteredRaffle",
    inputs: [
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PickedWinner",
    inputs: [
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RequestedRaffleWinner",
    inputs: [
      {
        name: "requestId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OnlyCoordinatorCanFulfill",
    inputs: [
      {
        name: "have",
        type: "address",
        internalType: "address",
      },
      {
        name: "want",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "Raffel__NotEnoughETHSent",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffel__TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__RaffleNotOpen",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__RaffleUpkeepNotNeeded",
    inputs: [
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "playersLength",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "raffleState",
        type: "uint8",
        internalType: "enum Raffle.RaffleState",
      },
      {
        name: "timeSinceOpen",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;
