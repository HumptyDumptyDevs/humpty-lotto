import React from "react";
import { useReadContract, useBalance } from "wagmi";
import { abi } from "../abi/abiRaffle";

const ReadContract = () => {
  const { data } = useBalance({
    address: "0x50a6217d3962A88e9cB3a6a87887d2A4B3573997",
    unit: "ether",
  });

  return <div>Balance: {data.formatted}</div>;
};

export default ReadContract;
