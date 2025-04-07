import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { parseEther } from "viem";
import { LiquidityPoolABI } from "@/lib/config";
import { toast } from "react-toastify";
import { FaExchangeAlt } from "react-icons/fa";
import { Button } from "@/components/ui/form/button";
import { FaWallet } from "react-icons/fa6";

export const Buy = ({
  token,
  metadata,
}: {
  token: Token;
  metadata: TokenMetadata;
}) => {
  const account = useAccount();
  const [amount, setAmount] = useState(0.01);

  const balanceNative = useBalance({
    address: account.address as any,
    query: {
      enabled: !!account.address,
      refetchInterval: 10000,
    },
  });

  const getTokensOut = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "getTokensOut",
    address: token.liquidity_pool as any,
    args: [parseEther(amount.toString())],
    query: {
      enabled: !!token.liquidity_pool && !!amount,
      select(data) {
        return formatEther(data as any);
      },
      refetchInterval: 10000,
    },
  });

  const swapWriteContract = useWriteContract();
  const swapWaitForTransactionReceipt = useWaitForTransactionReceipt({
    hash: swapWriteContract.data,
  });

  const buyToken = async () => {
    try {
      await swapWriteContract.writeContractAsync({
        abi: LiquidityPoolABI,
        address: token.liquidity_pool as any,
        functionName: "buyTokens",
        value: parseEther(amount.toString()),
        args: [],
      });
      toast.success("Transaction sent successfully");
    } catch (error) {
      console.error("Error buying tokens:", error);
      toast.error("Buy transaction failed");
    }
  };

  const setPercentage = (percentage: number) => {
    if (balanceNative.data) {
      const maxAmount = parseFloat(formatEther(balanceNative.data.value));
      const newAmount = (maxAmount * percentage) / 100;
      setAmount(newAmount);
    }
  };

  const hasInsufficientBalance = useMemo(() => {
    if (!balanceNative.data || !amount) return false;
    const maxSpendable =
      parseFloat(formatEther(balanceNative.data.value)) - 0.01;
    return amount > maxSpendable || maxSpendable <= 0;
  }, [balanceNative.data, amount]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white/90">You pay</h3>
          <div className="text-sm text-white/70 font-medium flex items-center gap-1">
            <FaWallet className="text-xs opacity-70" />
            <span>
              {balanceNative.data
                ? parseFloat(formatEther(balanceNative.data.value)).toFixed(4)
                : "0"}{" "}
              {balanceNative.data?.symbol}
            </span>
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className={`w-full p-4 bg-[var(--surface-dark)] border-2 ${
              hasInsufficientBalance
                ? "border-[var(--danger)]"
                : "border-[var(--primary)]/20"
            } rounded-xl focus:outline-none focus:border-[var(--primary)]/70 transition-all`}
            placeholder="0.0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-[var(--surface-dark)]/80 py-1 px-2 rounded-lg">
            <img className="size-6 rounded-full mr-1" src="/somnia.png" />
            <span className="text-sm font-medium">STT</span>
          </div>
        </div>
        {hasInsufficientBalance && (
          <div className="text-[var(--danger)] text-xs font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Insufficient balance
          </div>
        )}
        <div className="flex gap-2 justify-end">
          {[25, 50, 75, 95].map((percent) => (
            <button
              key={percent}
              onClick={() => setPercentage(percent)}
              className="text-xs px-3 py-1.5 bg-[var(--surface-dark)] rounded-md hover:bg-[var(--primary)]/20 transition-colors font-medium"
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white/90">You receive</h3>
          <div className="text-sm text-white/70 font-medium">Estimated</div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={
              getTokensOut.data ? parseFloat(getTokensOut.data).toFixed(6) : "0"
            }
            readOnly
            className="w-full p-4 bg-[var(--surface-dark)] border-2 border-[var(--primary)]/20 rounded-xl focus:outline-none"
            placeholder="0.0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-[var(--surface-dark)]/80 py-1 px-2 rounded-lg">
            <img
              className="size-6 rounded-full mr-1"
              src={metadata.image_url}
              alt={token.symbol}
            />
            <span className="text-sm font-medium">{token.symbol}</span>
          </div>
        </div>
        <div className="text-xs text-white/60 text-right font-medium">
          1 {balanceNative.data?.symbol || "STT"} ={" "}
          {getTokensOut.data && amount
            ? (parseFloat(getTokensOut.data) / amount).toFixed(6)
            : "0"}{" "}
          {token.symbol}
        </div>
      </div>

      <div className="mt-6">
        {!account.isConnected && (
          <Button
            className="w-full h-12 rounded-xl text-sm font-medium"
            variant="primary"
            leftIcon={<FaWallet />}
          >
            Connect Wallet
          </Button>
        )}
        {account.isConnected && (
          <Button
            variant="primary"
            className="w-full h-12 rounded-xl text-sm font-medium"
            size="lg"
            leftIcon={<FaExchangeAlt />}
            onClick={buyToken}
            disabled={
              swapWriteContract.isPending ||
              swapWaitForTransactionReceipt.isLoading ||
              !amount ||
              amount <= 0 ||
              hasInsufficientBalance
            }
          >
            {swapWriteContract.isPending
              ? "Buying..."
              : swapWaitForTransactionReceipt.isLoading
              ? "Waiting tx..."
              : hasInsufficientBalance
              ? "Insufficient Balance"
              : "Buy"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const Sell = ({
  token,
  metadata,
}: {
  token: Token;
  metadata: TokenMetadata;
}) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);

  // Write contract
  const swapWriteContract = useWriteContract();
  const swapWaitForTransactionReceipt = useWaitForTransactionReceipt({
    hash: swapWriteContract.data,
  });

  const approveWriteContract = useWriteContract();
  const approveWaitForTransactionReceipt = useWaitForTransactionReceipt({
    hash: approveWriteContract.data,
  });

  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    address: token.token_address as any,
    args: [account.address as any, token.liquidity_pool as any],
    query: {
      refetchInterval: 5000,
      subscribed: true,
    },
  });

  const balanceOfToken1 = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: token.token_address as any,
    args: [account.address as any],
    query: {
      enabled: !!account.address,
      select(data) {
        const raw = data;
        const formatted = formatEther(raw as any);
        const parsed = parseFloat(formatted);
        return {
          raw,
          formatted,
          parsed,
        };
      },
      refetchInterval: 10000,
    },
  });

  const approve = async () => {
    try {
      await approveWriteContract.writeContractAsync({
        abi: erc20Abi,
        address: token.token_address as any,
        functionName: "approve",
        args: [token.liquidity_pool as any, parseEther(amount.toString())],
      });
      toast.success("Approve transaction sent successfully");
    } catch (error) {
      console.error("Error approving token:", error);
      toast.error("Approve transaction failed");
    }
  };

  const getEthOut = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "getEthOut",
    address: token.liquidity_pool as any,
    args: [parseEther(amount.toString())],
    query: {
      enabled: !!token.liquidity_pool && !!amount,
      select(data) {
        return formatEther(data as any);
      },
      refetchInterval: 10000,
    },
  });

  const sellToken = async () => {
    try {
      const parsedInAmount = Number(amount) * 0.99; // TODO: temporary fix for precision issues

      await swapWriteContract.writeContractAsync({
        abi: LiquidityPoolABI,
        address: token.liquidity_pool as any,
        functionName: "sellTokens",
        args: [parseEther(String(parsedInAmount))],
      });

      toast.success("Transaction sent successfully");
    } catch (error) {
      console.error("Error selling tokens:", error);
      toast.error("Sell transaction failed");
    }
  };

  const isApproveNeed = useMemo(() => {
    return allowance.data! < parseEther(amount.toString());
  }, [allowance.data, amount]);

  const setPercentage = (percentage: number) => {
    if (balanceOfToken1.data) {
      const newAmount = (balanceOfToken1.data.parsed * percentage) / 100;
      setAmount(newAmount);
    }
  };

  const hasInsufficientBalance = useMemo(() => {
    if (!balanceOfToken1.data || !amount) return false;
    return amount > Number(formatEther(balanceOfToken1.data.raw as any));
  }, [balanceOfToken1.data, amount]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white/90">You pay</h3>
          <div className="text-sm text-white/70 font-medium flex items-center gap-1">
            <FaWallet className="text-xs opacity-70" />
            <span>
              {balanceOfToken1.data
                ? balanceOfToken1.data.parsed.toFixed(4)
                : "0"}{" "}
              {token.symbol}
            </span>
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className={`w-full p-4 bg-[var(--surface-dark)] border-2 ${
              hasInsufficientBalance
                ? "border-[var(--danger)]"
                : "border-[var(--primary)]/20"
            } rounded-xl focus:outline-none focus:border-[var(--primary)]/70 transition-all`}
            placeholder="0.0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-[var(--surface-dark)]/80 py-1 px-2 rounded-lg">
            <img
              className="size-6 rounded-full mr-1"
              src={metadata.image_url}
              alt={token.symbol}
            />
            <span className="text-sm font-medium">{token.symbol}</span>
          </div>
        </div>
        {hasInsufficientBalance && (
          <div className="text-[var(--danger)] text-xs font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Insufficient {token.symbol} balance
          </div>
        )}
        <div className="flex gap-2 justify-end">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => setPercentage(percent)}
              className="text-xs px-3 py-1.5 bg-[var(--surface-dark)] rounded-md hover:bg-[var(--primary)]/20 transition-colors font-medium"
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white/90">You receive</h3>
          <div className="text-sm text-white/70 font-medium">Estimated</div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={getEthOut.data ? parseFloat(getEthOut.data).toFixed(6) : "0"}
            readOnly
            className="w-full p-4 bg-[var(--surface-dark)] border-2 border-[var(--primary)]/20 rounded-xl focus:outline-none"
            placeholder="0.0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-[var(--surface-dark)]/80 py-1 px-2 rounded-lg">
            <img className="size-6 rounded-full mr-1" src="/somnia.png" />
            <span className="text-sm font-medium">STT</span>
          </div>
        </div>
        <div className="text-xs text-white/60 text-right font-medium">
          1 {token.symbol} ={" "}
          {getEthOut.data && amount
            ? (parseFloat(getEthOut.data) / amount).toFixed(6)
            : "0"}{" "}
          STT
        </div>
      </div>

      <div className="mt-6">
        {!account.isConnected && (
          <Button
            className="w-full h-12 rounded-xl text-sm font-medium"
            variant="primary"
            leftIcon={<FaWallet />}
          >
            Connect Wallet
          </Button>
        )}
        {account.isConnected && (
          <>
            {isApproveNeed && (
              <Button
                variant="primary"
                className="w-full h-12 rounded-xl text-sm font-medium"
                size="lg"
                leftIcon={<FaWallet />}
                onClick={approve}
                disabled={
                  approveWriteContract.isPending ||
                  approveWaitForTransactionReceipt.isLoading ||
                  !amount ||
                  amount <= 0 ||
                  hasInsufficientBalance
                }
              >
                {approveWriteContract.isPending
                  ? "Approving..."
                  : approveWaitForTransactionReceipt.isLoading
                  ? "Waiting tx..."
                  : hasInsufficientBalance
                  ? "Insufficient Balance"
                  : "Approve"}
              </Button>
            )}

            {!isApproveNeed && (
              <Button
                variant="primary"
                className="w-full h-12 rounded-xl text-sm font-medium"
                size="lg"
                leftIcon={<FaExchangeAlt />}
                onClick={sellToken}
                disabled={
                  swapWriteContract.isPending ||
                  swapWaitForTransactionReceipt.isLoading ||
                  !amount ||
                  amount <= 0 ||
                  hasInsufficientBalance
                }
              >
                {swapWriteContract.isPending
                  ? "Selling..."
                  : swapWaitForTransactionReceipt.isLoading
                  ? "Waiting tx..."
                  : hasInsufficientBalance
                  ? "Insufficient Balance"
                  : "Sell"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const SwapInterface = ({
  token,
  metadata,
}: {
  token: Token;
  metadata: TokenMetadata;
}) => {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--primary)]/30 overflow-hidden relative p-6 shadow-lg"
      style={{
        background: "var(--surface)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex mb-6 p-1 bg-[var(--surface-dark)] gap-2 rounded-lg">
        <button
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${
            tab === "buy"
              ? "bg-[var(--success)] text-white shadow-md"
              : "text-white/70 hover:text-white/90 hover:bg-[var(--surface-dark)]/80"
          }`}
          onClick={() => setTab("buy")}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${
            tab === "sell"
              ? "bg-[var(--danger)] text-white shadow-md"
              : "text-white/70 hover:text-white/90 hover:bg-[var(--surface-dark)]/80"
          }`}
          onClick={() => setTab("sell")}
        >
          Sell
        </button>
      </div>

      {tab === "buy" ? (
        <Buy token={token} metadata={metadata} />
      ) : (
        <Sell token={token} metadata={metadata} />
      )}
    </motion.div>
  );
};
