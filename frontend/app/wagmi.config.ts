import { http, createConfig, Config } from "wagmi";
import { polygonMumbai, polygon, localhost } from "wagmi/chains";
import { defineChain } from "viem";

export const local = defineChain({
  id: 31337,
  name: "Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

console.log(polygonMumbai);

export let config: Config;

if (process.env.NODE_ENV === "development") {
  config = createConfig({
    chains: [polygonMumbai, polygon, local],
    ssr: true,
    transports: {
      [polygonMumbai.id]: http(
        "https://polygon-mumbai.g.alchemy.com/v2/Leh7xj6JIcZCVTAnyo5kXC0Fy5mleDha"
      ),
      [polygon.id]: http(
        "https://polygon-mainnet.g.alchemy.com/v2/VPt7dmhM5KFSmVf3TjqnzuU_PkXqi1f8"
      ),
      [local.id]: http(),
    },
  });
} else {
  config = createConfig({
    chains: [polygon],
    ssr: true,
    transports: {
      [polygon.id]: http(
        "https://polygon-mainnet.g.alchemy.com/v2/VPt7dmhM5KFSmVf3TjqnzuU_PkXqi1f8"
      ),
    },
  });
}
