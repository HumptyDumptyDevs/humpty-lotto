import React from "react";
import { useLottery } from "../context/LotteryContext";

const LotteryInfo = () => {
  const lotteryData = useLottery();
  const symbol = lotteryData?.symbol;
  const interval = lotteryData?.interval;

  return (
    <div className="card bg-base-100 shadow-xl m-5">
      <div className="card-body">
        <h2 className="card-title text-2xl">Poly Lotto Info</h2>
        <p className="mb-4">Welcome to the Humpty Dumpty Poly Lotto!</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Open to All:</strong> Anyone can enter the lottery by
            sending a fixed amount of {symbol}.
          </li>
          <li>
            <strong>Idle:</strong> The lotto will remain idle until there are
            atleast two participants in the pool.
          </li>
          <li>
            <strong>Open:</strong> Once the pool has atleast two participants,
            the lotto will be open for {interval} seconds
          </li>
          <li>
            <strong>Closed:</strong> After {interval} seconds, the lotto will be
            closed as a winner is picked.
          </li>
          <li>
            <strong>Transparency:</strong> All transactions and the winner
            selection process are transparent and can be verified on the
            blockchain.
          </li>
        </ul>
        <p className="text-sm mt-4 italic">
          Please participate responsibly and ensure you understand the risks
          involved. Good luck!
        </p>
      </div>
    </div>
  );
};

export default LotteryInfo;
