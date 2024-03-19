import React from "react";
import { useLottery } from "../context/LotteryContext";
import { formatEther } from "viem";

const LotteryBalance = () => {
  const lotteryData = useLottery();
  const balance = lotteryData?.balance;
  const symbol = lotteryData?.symbol;
  const isPending = lotteryData?.isPending;

  return (
    <div
      className={`${
        isPending && "skeleton w-24 animate-pulse"
      } w-64 h-40 flex gap-4 justify-center`}
    >
      <h1 className="text-9xl">
        {balance !== undefined && formatEther(balance)}
      </h1>
      <h1 className="text-2xl mt-auto">{symbol !== undefined && symbol}</h1>
    </div>
  );
};

export default LotteryBalance;
