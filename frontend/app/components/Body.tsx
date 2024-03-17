import React from "react";
import { LotteryProvider } from "../context/LotteryContext";
import LotteryBalance from "./LotteryBalance";
import LotteryPlayers from "./LotteryPlayers";
import EnterLottery from "./EnterLottery";
import PickWinner from "./PickWinner";
import SendTransaction from "./SendTransaction";
import LotteryStatus from "./LotteryStatus";
import LotteryInfo from "./LotteryInfo";

const Body = () => {
  return (
    <LotteryProvider>
      <main className="w-full flex flex-col mx-auto p-20">
        <div className="p-20 flex justify-between">
          <div className="flex-1 w-2/3 px-36 gap-10 flex flex-col">
            <LotteryStatus />
            <EnterLottery />
            <LotteryPlayers />
          </div>
          <div className="flex-1 flex justify-center">
            <LotteryBalance />
          </div>
          <div className="flex-1">
            <LotteryInfo />
          </div>
        </div>
      </main>
    </LotteryProvider>
  );
};

export default Body;
