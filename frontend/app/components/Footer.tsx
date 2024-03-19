import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import PatrickCollins from "../../public/PatrickCollins.webp";

const Footer = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const account = useAccount();
  const blockExplorerUrl = account?.chain?.blockExplorers?.default.url;

  const handleMouseMove = (event: any) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 mb-20">
      <div className="flex sm:flex-row flex-col justify-center items-center gap-10 ">
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
      <p
        className="text-xs sm:text-base"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        Also made possible by the G Patrick Colins{" "}
        <i className="ml-2 fa-light fa-arrow-right"></i>{" "}
        <Link href="https://www.youtube.com/@PatrickAlphaC">
          <i className="ml-2 fa-brands fa-youtube"></i>
        </Link>
      </p>
      {isHovering && (
        <div
          className="fixed"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(10px,-120px)", // Adjust if necessary to better position the popup relative to the cursor
          }}
        >
          {/* Replace the src with the path to your image */}
          <Image
            src={PatrickCollins}
            alt="Patrick Collins"
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

export default Footer;
