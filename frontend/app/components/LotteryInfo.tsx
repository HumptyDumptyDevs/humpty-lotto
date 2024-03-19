import React from "react";
import { useLottery } from "../context/LotteryContext";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import LotteryInfoText from "./LotteryInfoText";

const LotteryInfo = () => {
  const lotteryData = useLottery();
  const symbol = lotteryData?.symbol;
  const interval = lotteryData?.interval;

  return (
    <div className="card bg-base-100 shadow-xl m-5">
      <div className="card-body">
        <h2 className="card-title text-2xl">Humpty Lotto</h2>
        <LotteryInfoText />
      </div>
    </div>
  );
};

export default LotteryInfo;
