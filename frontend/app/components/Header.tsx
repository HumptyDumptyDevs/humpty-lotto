import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "../../public/HDD_Logo_Vector.svg";
import Image from "next/image";

const Header = () => {
  return (
    <div className="p-10 w-full mx-auto flex justify-between">
      <div className="flex-1 flex items-center">
        <Image className="h-16" src={Logo} alt="Humpty Dumpty Crypto" />
      </div>
      <div className="flex-grow hidden lg:block">
        <h1 className="text-center uppercase font-extrabold leading-loose text-4xl ">
          Humpty Lotto
        </h1>
      </div>
      <div className="flex-1 flex items-center">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
