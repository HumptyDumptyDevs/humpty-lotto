import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

const Footer = () => {
  const account = useAccount();
  const blockExplorerUrl = account?.chain?.blockExplorers?.default.url;

  return (
    <div className="flex sm:flex-row flex-col justify-center items-center gap-10 mb-20">
      <div className="flex gap-10">
        <Link href="https://github.com/HumptyDumptyDevs/humpty-lotto">
          <i className="fa-brands fa-github text-4xl"></i>
        </Link>
        <Link href="https://twitter.com/hddevs">
          <i className="fa-brands fa-x-twitter text-4xl"></i>
        </Link>
        <Link
          href={`${blockExplorerUrl}/address/${process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS}`}
        >
          <i className="fa-regular fa-file-contract text-4xl"></i>
        </Link>
      </div>
      <div className="border-t-2 pt-6 sm:pt-0 sm:border-l-2 sm:border-t-0 h-full border-gray-600 text-4xl sm:pl-6">
        <p className="text-lg">Made with ❤️ by @hddevs</p>
      </div>
    </div>
  );
};

export default Footer;
