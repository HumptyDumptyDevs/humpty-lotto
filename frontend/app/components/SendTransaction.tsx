import React from "react";
import {
  BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

const SendTransaction = () => {
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const to = formData.get("address") as `0x${string}`;
    const value = formData.get("value") as string;
    sendTransaction({ to, value: parseEther(value) });
    console.log(to, value);
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex w-full p-20 justify-center items-center">
      <form className="flex gap-5" onSubmit={submit}>
        <input
          className="input"
          name="address"
          placeholder="0xA0Cf…251e"
          required
        />
        <input className="input" name="value" placeholder="0.05" required />
        <button disabled={isPending} className="btn btn-primary" type="submit">
          {isPending ? "Confirming..." : "Send"}{" "}
        </button>

        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </div>
  );
};

export default SendTransaction;
