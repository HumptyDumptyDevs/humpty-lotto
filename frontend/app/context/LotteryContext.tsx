import React, { createContext, useContext, ReactNode } from "react";
import { useReadContracts, useBalance, useWatchContractEvent } from "wagmi";
import { abi } from "../abi/abiRaffle";
import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

// types/LotteryTypes.ts

export interface LotteryData {
  entranceFee?: bigint;
  raffleState?: number;
  players?: readonly `0x${string}`[]; // Adjust types as necessary
  interval?: number; // Adjust types as necessary
  balance?: bigint; // Assuming balance is a string, adjust as necessary
  recentWinner?: `0x${string}`;
  error?: any;
  symbol?: string;
  timeSinceOpen?: number;
  isPending: boolean;
}

const LotteryContext = createContext<LotteryData | undefined>(undefined);

export const useLottery = () => useContext(LotteryContext);

type LotteryProviderProps = {
  children: ReactNode;
};

export const LotteryProvider = ({ children }: LotteryProviderProps) => {
  const lotteryContractConfig = {
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
  };

  const queryClient = useQueryClient();

  useWatchContractEvent({
    ...lotteryContractConfig,
    eventName: "EnteredRaffle",
    onLogs(logs) {
      queryClient.invalidateQueries();
    },
    onError(error) {
      console.error("New Entry Error", error);
    },
  });

  useWatchContractEvent({
    ...lotteryContractConfig,
    eventName: "RequestedRaffleWinner",
    onLogs(logs) {
      queryClient.invalidateQueries();
    },
    onError(error) {
      console.error("Requested Raffle Winner Error", error);
    },
  });

  useWatchContractEvent({
    ...lotteryContractConfig,
    eventName: "PickedWinner",
    onLogs(logs) {
      queryClient.invalidateQueries();
    },
    onError(error) {
      console.error("Picked Winner Error", error);
    },
  });

  const {
    data: contractData,
    error: contractsError,
    isPending: isContractsPending,
  } = useReadContracts({
    contracts: [
      {
        ...lotteryContractConfig,
        functionName: "getEntranceFee",
      },
      {
        ...lotteryContractConfig,
        functionName: "getRaffleState",
      },
      {
        ...lotteryContractConfig,
        functionName: "getInterval",
      },
      {
        ...lotteryContractConfig,
        functionName: "getPlayers",
      },
      {
        ...lotteryContractConfig,
        functionName: "getBalance",
      },
      {
        ...lotteryContractConfig,
        functionName: "getTimeSinceOpen",
      },
      {
        ...lotteryContractConfig,
        functionName: "getRecentWinner",
      },
    ],
  });

  const { data: balanceData, error: balanceError } = useBalance({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    unit: "ether",
  });

  const transformedData: LotteryData = {
    entranceFee: contractData?.[0]?.result,
    raffleState: contractData?.[1]?.result,
    interval: Number(contractData?.[2]?.result),
    players: contractData?.[3]?.result || [],
    balance: contractData?.[4]?.result,
    timeSinceOpen: Number(contractData?.[5]?.result),
    recentWinner: contractData?.[6]?.result,
    symbol: balanceData?.symbol,
    error: contractsError,
    isPending: isContractsPending,
  };

  return (
    //@ts-ignore
    <LotteryContext.Provider value={transformedData}>
      {children}
    </LotteryContext.Provider>
  );
};
