import React from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "../abi/abiRaffle";
import { parseEther, parseGwei } from "viem";

const WithdrawFromContract = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const withdraw = async () => {
    writeContract({
      address: "0x50a6217d3962A88e9cB3a6a87887d2A4B3573997",
      abi,
      functionName: "withdraw",
    });
  };

  return (
    <div>
      <button onClick={withdraw} className="btn btn-primary">
        Withdraw
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
};

export default WithdrawFromContract;
