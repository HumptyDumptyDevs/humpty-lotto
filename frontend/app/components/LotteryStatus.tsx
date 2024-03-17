import React from "react";
import { type BaseError, useReadContracts } from "wagmi";
import { abi } from "../abi/abiRaffle";
import { useLottery } from "../context/LotteryContext";
import { formatEther } from "viem";

const LotteryStatus = () => {
  const lotteryData = useLottery();
  const raffleState = lotteryData?.raffleState;
  const isPending = lotteryData?.isPending;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex text-lg font-bold">
          <p>Lotto Status:</p>
          <p className={`${isPending && "skeleton w-24 animate-pulse"} h-6`}>
            {raffleState !== undefined ? (
              raffleState === 0 ? (
                <span className="badge badge-success badge-lg">Open</span>
              ) : (
                <span className="badge badge-error badge-lg">Closed</span>
              )
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LotteryStatus;
