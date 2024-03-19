import React from "react";
import { useLottery } from "../context/LotteryContext";

const LotteryInfoText = () => {
  const lotteryData = useLottery();
  const symbol = lotteryData?.symbol;
  const interval = lotteryData?.interval;

  return (
    <div>
      <p className="mb-4">Welcome to the Humpty Lotto!</p>
      <ul className="list-disc pl-5">
        <li>
          <strong>Open to All:</strong> Anyone can enter the lottery by sending
          a fixed amount of {symbol}.
        </li>
        <li>
          <strong>Idle:</strong> The lotto will remain idle until there are
          atleast two participants in the pool.
        </li>
        <li>
          <strong>Open:</strong> Once the pool has atleast two participants, the
          lotto will be open for {interval} seconds
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
  );
};

export default LotteryInfoText;
