import React from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "../abi/abiRaffle";
import { parseEther, parseGwei } from "viem";

const DepositToContract = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get("value") as string;

    writeContract({
      address: "0x50a6217d3962A88e9cB3a6a87887d2A4B3573997",
      abi,
      value: parseEther(value),
      functionName: "fund",
    });
  }

  console.log(error);

  return (
    <form className="flex gap-4" onSubmit={submit}>
      <input className="input" name="value" placeholder="0.05" required />
      <button className="btn btn-primary" disabled={isPending} type="submit">
        {isPending ? "Confirming..." : "Deposit"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default DepositToContract;
