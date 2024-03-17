import React, { createContext, useContext, ReactNode } from "react";
import { useReadContracts, useBalance } from "wagmi";
import { abi } from "../abi/abiRaffle";
import { Address } from "viem";

// types/LotteryTypes.ts

export interface LotteryData {
  entranceFee?: bigint;
  raffleState?: number;
  players?: readonly `0x${string}`[]; // Adjust types as necessary
  interval?: number; // Adjust types as necessary
  balance?: bigint; // Assuming balance is a string, adjust as necessary
  error?: any;
  symbol?: string;
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
    players: contractData?.[3]?.result,
    balance: contractData?.[4]?.result,
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
