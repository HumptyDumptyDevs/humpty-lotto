import React from "react";
import { useBalance, useReadContract } from "wagmi";
import { abi } from "../abi/abiRaffle";

const LotteryPlayers = () => {
  const { data, error, isPending } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getPlayers",
  });

  console.log(error);
  console.log(isPending);

  console.log(data);

  return (
    <div className="flex">
      <div className="overflow-x-auto">
        <table className="table ">
          <thead>
            <tr>
              <th></th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((player: string, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotteryPlayers;
