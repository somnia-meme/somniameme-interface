import { Button } from "../ui/form/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { LiquidityPoolABI } from "@/lib/config";
import { parseEther } from "viem";
import { toast } from "react-toastify";

export function QuickBuyModal({
  closeModal,
  token,
  metadata,
}: {
  closeModal?: () => void;
  token: Token;
  metadata: TokenMetadata;
}) {
  const account = useAccount();
  const [amount, setAmount] = useState(0.01);

  const {
    name,
    symbol,
    price,
    price_change_24h,
    liquidity_pool,
    mcap,
    mcap_change_24h,
  } = token;

  const balance = useBalance({
    address: account.address as `0x${string}`,
    query: {
      enabled: account.isConnected,
    },
  });

  const getTokensOut = useReadContract({
    address: liquidity_pool as `0x${string}`,
    abi: LiquidityPoolABI,
    functionName: "getTokensOut",
    args: [parseEther(amount.toString())],
    query: {
      select(data: any) {
        const value = Number(data);
        const formatted = Number(formatUnits(data, 18));
        return { value, formatted };
      },
    },
  });

  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract();
  const waitForTransaction = useWaitForTransactionReceipt({
    hash: hash,
  });

  async function buyToken() {
    await writeContractAsync({
      abi: LiquidityPoolABI,
      functionName: "buyTokens",
      value: parseEther(amount.toString()),
      address: liquidity_pool as `0x${string}`,
    });

    toast.success("Transaction sent successfully");
  }

  return (
    <motion.div
      className="bg-[var(--surface-dark)] border border-indigo-500/30 rounded-xl w-full overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={metadata?.image_url}
            className="w-10 h-10 rounded-md mr-3 object-cover"
            alt={name}
          />
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-indigo-300">${symbol}</p>
          </div>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-900/40 hover:bg-indigo-900/60 text-white transition-colors"
          onClick={() => closeModal?.()}
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-indigo-300">Current Price</span>
            <span className="text-sm text-white font-medium">
              {price.toLocaleString()} STT
            </span>
          </div>
          {price_change_24h !== undefined && (
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  price_change_24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price_change_24h >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(price_change_24h).toLocaleString()}% (24h)
              </span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-indigo-300">Current MCAP</span>
            <span className="text-sm text-white font-medium">
              {mcap.toLocaleString()} STT
            </span>
          </div>
          {mcap_change_24h !== undefined && (
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  mcap_change_24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {mcap_change_24h >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(mcap_change_24h).toLocaleString()}% (24h)
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-indigo-300 mb-2">
            Amount to Buy
          </label>
          <div className="relative">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value as any)}
              type="text"
              className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-sm text-indigo-300 mr-2">STT</span>
              <button
                onClick={() => setAmount(Number(balance.data?.formatted || 0))}
                className="px-2 py-1 bg-indigo-700/50 hover:bg-indigo-700 rounded text-xs text-white transition-colors"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-sm text-indigo-300">You will receive</span>
          <span className="text-sm text-white font-medium ml-2">
            {(getTokensOut.data?.formatted || 0).toLocaleString()} {symbol}
          </span>
        </div>

        <Button
          onClick={buyToken}
          disabled={
            isPending || !account.isConnected || waitForTransaction.isLoading
          }
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold transition-colors"
        >
          {isPending
            ? "Confirming..."
            : waitForTransaction.isLoading
            ? "Buying..."
            : `Buy ${symbol}`}
        </Button>

        {error && (
          <div className="mt-4 text-red-400 text-sm">
            {(error as any).shortMessage || error.message}
          </div>
        )}
      </div>
    </motion.div>
  );
}
