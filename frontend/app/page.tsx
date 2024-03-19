"use client";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Body from "./components/Body";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <div>
              <Header />
              <Body />
            </div>
            <Footer />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
      <ToastContainer />
    </WagmiProvider>
  );
}
