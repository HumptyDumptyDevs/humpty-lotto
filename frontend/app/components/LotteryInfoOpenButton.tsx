import React, { useState } from "react";
import LotteryInfoDialog from "./LotteryInfoDialog";

const LotteryInfoOpenButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <LotteryInfoDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="btn btn-square"
      >
        <i className="fa-sharp fa-solid fa-info"></i>
      </button>
    </div>
  );
};

export default LotteryInfoOpenButton;
