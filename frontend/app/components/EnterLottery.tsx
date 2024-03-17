import React from "react";
import { useEffect } from "react";
import { useBalance, useReadContract } from "wagmi";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "../abi/abiRaffle";
import { formatEther, parseEther } from "viem";
import { ToastContainer, toast } from "react-toastify";
import { useLottery } from "../context/LotteryContext";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";

const EnterLottery = () => {
  const queryClient = useQueryClient();
  const lotteryData = useLottery();
  const entranceFee = lotteryData?.entranceFee;
  const symbol = lotteryData?.symbol;
  const isPending = lotteryData?.isPending;

  const {
    data: hash,
    error: writeContractError,
    isPending: writeContractIsPending,
    writeContract,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const enterLottery = async () => {
    console.log("Entering Lottery...");
    console.log(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
    console.log(abi);
    writeContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "enterRaffle",
      value: parseEther("0.1"),
    });
  };

  console.log(writeContractError);
  console.log(writeContractIsPending);

  // Inside your component
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success("Transaction confirmed", {
        theme: "dark",
        toastId: hash,
      });
      queryClient.invalidateQueries();
    }
  }, [isSuccess, hash, queryClient]);

  useEffect(() => {
    if (isLoading && hash) {
      toast.info(
        `Entered Lottery... ${hash.substring(0, 6)}...${hash.slice(-5)}`,
        {
          theme: "dark",
          toastId: `loading-${hash}`,
          icon: <i className="fa-regular fa-copy cursor-pointer text-white " />,
          onClick: () => {
            // Using the Clipboard API to copy the hash
            navigator.clipboard
              .writeText(hash)
              .then(() => {
                // Optionally, you can provide feedback that the content was copied
                console.log("Transaction hash copied to clipboard");
                // Or even use another toast for confirmation, if desired
                toast.success("Transaction hash copied to clipboard!", {
                  theme: "dark",
                });
              })
              .catch((err) => {
                // Handle any errors
                console.error("Could not copy text: ", err);
              });
          },
        }
      );
    }
  }, [isLoading, hash]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col gap-8 text-lg font-bold">
          <div className="flex">
            <p className="">Entrance Fee:</p>
            <p className={`${isPending && "skeleton w-14 animate-pulse"} h-6`}>
              {entranceFee !== undefined && formatEther(entranceFee)}{" "}
              <span className="text-xs">{symbol}</span>
            </p>
          </div>
          <div className="flex justify-center">
            <button onClick={enterLottery} className="btn  btn-primary">
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterLottery;
