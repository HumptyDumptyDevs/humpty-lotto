import { useState } from "react";
import { Dialog } from "@headlessui/react";
import LotteryInfoText from "./LotteryInfoText";

interface LotteryInfoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function LotteryInfoDialog({ isOpen, setIsOpen }: LotteryInfoDialogProps) {
  return (
    <Dialog className="relative z-50" open={isOpen} onClose={() => {}}>
      <div className="fixed inset-0 bg-black/60 " aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 text-xs md:text-base">
        <Dialog.Panel className="card bg-base-100 border border-white shadow-2xl p-10 w-full max-w-sm rounded">
          <Dialog.Description>
            <LotteryInfoText />
          </Dialog.Description>
          <div className="flex justify-center mt-4">
            <button
              className="btn btn-primary w-fit"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default LotteryInfoDialog;
