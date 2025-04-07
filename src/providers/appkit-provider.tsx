import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SCAN_URL } from "@/lib/config";
import { defineChain, http } from "viem";

const chain = defineChain({
  id: 50312,
  name: "Somnia Network",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Testnet Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network"],
      webSocket: ["wss://dream-rpc.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: SCAN_URL,
    },
  },
  testnet: true,
});

const queryClient = new QueryClient();

const projectId = "8a9438d75111d31598c9509633cee7b2";

export const wagmiAdapter = new WagmiAdapter({
  networks: [chain],
  projectId,
  ssr: false,
  transports: {
    [chain.id]: http(),
  },
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [chain],
  defaultNetwork: chain,
  projectId,
  metadata: {
    name: "Somnia Meme",
    description: "Somnia Meme is a meme launch platform on Somnia Network",
    icons: ["https://somnia.meme/logo.png"],
    url: "https://somnia.meme",
  },
  defaultAccountTypes: { eip155: "eoa" },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
