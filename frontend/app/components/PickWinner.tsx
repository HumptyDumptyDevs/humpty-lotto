import React from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "../abi/abiRaffle";

const PickWinner = () => {
  const {
    data: hash,
    error: writeContractError,
    isPending: writeContractIsPending,
    writeContract,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  console.log(writeContractError);
  console.log(writeContractIsPending);

  const pickWinner = async () => {
    writeContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "performUpkeep",
      args: ["" as `0x${string}`],
    });
  };

  return (
    <button onClick={pickWinner} className="btn btn-primary">
      End Lottery{" "}
    </button>
  );
};

export default PickWinner;
