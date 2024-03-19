import React, { useRef } from "react";
import { LotteryProvider } from "../context/LotteryContext";
import LotteryBalance from "./LotteryBalance";
import LotteryPlayers from "./LotteryPlayers";
import EnterLottery from "./EnterLottery";
import LotteryStatus from "./LotteryStatus";
import LotteryInfo from "./LotteryInfo";
import LotteryInfoOpenButton from "./LotteryInfoOpenButton";

const Body = () => {
  const enterLotteryButtonRef = useRef(null);

  return (
    <LotteryProvider>
      <main className="max-w-[2000px] mx-auto p-20">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start gap-10">
          <div className="flex-1 gap-10 flex flex-col">
            <LotteryStatus enterLotteryButtonRef={enterLotteryButtonRef} />
            <EnterLottery enterLotteryButtonRef={enterLotteryButtonRef} />
            <LotteryPlayers />
          </div>
          <div className="flex-grow flex justify-center">
            <LotteryBalance />
          </div>
          <div className="flex-1">
            <div className="hidden lg:block 2xl:hidden">
              <LotteryInfoOpenButton />
            </div>
            <div className="hidden 2xl:block">
              <LotteryInfo />
            </div>
          </div>
        </div>
      </main>
    </LotteryProvider>
  );
};

export default Body;
